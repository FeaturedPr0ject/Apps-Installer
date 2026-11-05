const crypto = require("crypto");

const COOKIE_NAME = "__Host-apps_installer_gate";
const SESSION_SECONDS = 6 * 60 * 60;
const EXPECTED_ACTION = "apps_installer_entry";
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function send(res, status, body, extraHeaders = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Content-Type-Options", "nosniff");
  for (const [name, value] of Object.entries(extraHeaders)) res.setHeader(name, value);
  res.end(JSON.stringify(body));
}

function getAllowedHostnames() {
  return (process.env.TURNSTILE_ALLOWED_HOSTNAMES || "apps-installer-site.vercel.app")
    .split(",")
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);
}

function getCookie(req, name) {
  const header = req.headers.cookie || "";
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    if (part.slice(0, index).trim() === name) return part.slice(index + 1).trim();
  }
  return "";
}

function signExpiry(expiry, secret) {
  return crypto.createHmac("sha256", secret).update(String(expiry)).digest("hex");
}

function hasValidSession(req, secret) {
  const value = getCookie(req, COOKIE_NAME);
  const [expiryText, signature] = value.split(".");
  const expiry = Number(expiryText);
  if (!Number.isSafeInteger(expiry) || expiry <= Math.floor(Date.now() / 1000)) return false;
  if (!/^[a-f0-9]{64}$/i.test(signature || "")) return false;
  const expectedBuffer = Buffer.from(signExpiry(expiry, secret), "hex");
  const actualBuffer = Buffer.from(signature, "hex");
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

function getRemoteIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) return forwarded.split(",")[0].trim();
  const realIp = req.headers["x-real-ip"];
  return typeof realIp === "string" ? realIp.trim() : "";
}

function requestOriginAllowed(req, hostnames) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return hostnames.includes(new URL(origin).hostname.toLowerCase());
  } catch {
    return false;
  }
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return {};
}

module.exports = async function handler(req, res) {
  const siteKey = process.env.TURNSTILE_SITE_KEY || "";
  const secretKey = process.env.TURNSTILE_SECRET_KEY || "";
  const sessionSecret = process.env.TURNSTILE_SESSION_SECRET || secretKey;
  const allowedHostnames = getAllowedHostnames();

  if (req.method === "GET") {
    if (!siteKey || !secretKey || !sessionSecret) {
      return send(res, 200, { enabled: false, verified: false });
    }
    return send(res, 200, {
      enabled: true,
      verified: hasValidSession(req, sessionSecret),
      siteKey,
      action: EXPECTED_ACTION
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return send(res, 405, { verified: false, error: "method-not-allowed" });
  }

  if (!siteKey || !secretKey || !sessionSecret) {
    return send(res, 503, { verified: false, error: "protection-not-configured" });
  }
  if (!requestOriginAllowed(req, allowedHostnames)) {
    return send(res, 403, { verified: false, error: "origin-not-allowed" });
  }

  const body = await readBody(req);
  const token = typeof body.token === "string" ? body.token.trim() : "";
  if (!token || token.length > 2048) {
    return send(res, 400, { verified: false, error: "invalid-token" });
  }

  const payload = { secret: secretKey, response: token };
  const remoteIp = getRemoteIp(req);
  if (remoteIp) payload.remoteip = remoteIp;

  let result;
  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error("siteverify-unavailable");
    result = await response.json();
  } catch {
    return send(res, 503, { verified: false, error: "verification-unavailable" });
  }

  const hostname = typeof result.hostname === "string" ? result.hostname.toLowerCase() : "";
  if (
    result.success !== true ||
    result.action !== EXPECTED_ACTION ||
    !allowedHostnames.includes(hostname)
  ) {
    return send(res, 403, { verified: false, error: "verification-failed" });
  }

  const expiry = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const signature = signExpiry(expiry, sessionSecret);
  const cookie = COOKIE_NAME + "=" + expiry + "." + signature +
    "; Max-Age=" + SESSION_SECONDS + "; Path=/; HttpOnly; Secure; SameSite=Lax";

  return send(res, 200, { verified: true }, { "Set-Cookie": cookie });
};