(() => {
  const gate = document.getElementById("security-gate");
  const title = document.getElementById("security-title");
  const description = document.getElementById("security-description");
  const status = document.getElementById("security-status");
  const widgetHost = document.getElementById("turnstile-widget");
  const spinner = document.getElementById("security-spinner");
  const retryButton = document.getElementById("security-retry");
  const body = document.body;

  if (!gate || !widgetHost || !title || !description || !status || !spinner || !retryButton) {
    body.dataset.securityPassed = "true";
    window.dispatchEvent(new CustomEvent("apps-installer:security-passed"));
    return;
  }

  const language = (() => {
    try {
      return localStorage.getItem("apps_installer_language") === "en" ? "en" : "vi";
    } catch {
      return document.documentElement.lang === "en" ? "en" : "vi";
    }
  })();

  const copy = {
    vi: {
      eyebrow: "BẢO VỆ TRUY CẬP",
      title: "Đang kiểm tra truy cập",
      description: "Hệ thống đang kiểm tra tín hiệu bảo mật của trình duyệt. Nếu cần, bạn sẽ được yêu cầu xác nhận mình không phải robot.",
      privacy: "Cloudflare Turnstile xử lý một số tín hiệu kỹ thuật của trình duyệt và mạng để nhận diện lưu lượng tự động.",
      checking: "Đang xác minh...",
      retry: "Thử lại",
      failed: "Không thể hoàn tất xác minh. Vui lòng thử lại.",
      unavailable: "Không thể kết nối dịch vụ xác minh. Kiểm tra kết nối mạng rồi thử lại.",
      invalid: "Xác minh chưa thành công. Vui lòng thực hiện lại.",
      loading: "Đang tải thành phần bảo mật..."
    },
    en: {
      eyebrow: "SECURE ACCESS",
      title: "Checking your connection",
      description: "We are checking security signals from this browser. If needed, you will be asked to confirm that you are human.",
      privacy: "Cloudflare Turnstile processes limited browser and network signals to identify automated traffic.",
      checking: "Verifying...",
      retry: "Try again",
      failed: "Verification could not be completed. Please try again.",
      unavailable: "The verification service could not be reached. Check your connection and retry.",
      invalid: "Verification was not successful. Please try again.",
      loading: "Loading security check..."
    }
  }[language];

  const eyebrow = document.getElementById("security-eyebrow");
  const privacy = document.getElementById("security-privacy");
  if (eyebrow) eyebrow.textContent = copy.eyebrow;
  title.textContent = copy.title;
  description.textContent = copy.description;
  if (privacy) privacy.textContent = copy.privacy;
  retryButton.textContent = copy.retry;
  status.textContent = copy.checking;

  body.classList.add("security-gated");
  let widgetId = null;
  let released = false;
  let verifying = false;
  let scriptLoading = false;

  function releaseGate() {
    if (released) return;
    released = true;
    body.dataset.securityPassed = "true";
    body.classList.remove("security-gated");
    gate.classList.add("security-gate-exit");
    setTimeout(() => {
      gate.hidden = true;
      window.dispatchEvent(new CustomEvent("apps-installer:security-passed"));
    }, 240);
  }

  function showFailure(message, retryWidget = false) {
    spinner.hidden = true;
    status.textContent = message || copy.failed;
    retryButton.hidden = false;
    if (retryWidget && window.turnstile && widgetId !== null) {
      retryButton.onclick = () => {
        retryButton.hidden = true;
        spinner.hidden = false;
        status.textContent = copy.checking;
        try { window.turnstile.reset(widgetId); }
        catch { window.location.reload(); }
      };
    } else {
      retryButton.onclick = () => window.location.reload();
    }
  }

  async function verifyToken(token) {
    if (verifying || released) return;
    verifying = true;
    status.textContent = copy.checking;
    retryButton.hidden = true;
    try {
      const response = await fetch("/api/turnstile", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok && result.verified === true) {
        releaseGate();
        return;
      }
      showFailure(response.status === 503 ? copy.unavailable : copy.invalid, true);
    } catch {
      showFailure(copy.unavailable, true);
    } finally {
      verifying = false;
    }
  }

  function renderWidget(siteKey, action) {
    if (!window.turnstile || widgetId !== null || released) return;
    widgetId = window.turnstile.render(widgetHost, {
      sitekey: siteKey,
      action: action || "apps_installer_entry",
      appearance: "interaction-only",
      execution: "render",
      theme: "auto",
      retry: "auto",
      "refresh-expired": "auto",
      callback: verifyToken,
      "expired-callback": () => {
        status.textContent = copy.failed;
      },
      "error-callback": () => {
        showFailure(copy.unavailable, true);
      },
      "timeout-callback": () => {
        showFailure(copy.failed, true);
      }
    });
    status.textContent = copy.loading;
  }

  function loadWidget(siteKey, action) {
    if (window.turnstile) {
      renderWidget(siteKey, action);
      return;
    }
    if (scriptLoading) return;
    scriptLoading = true;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => renderWidget(siteKey, action);
    script.onerror = () => showFailure(copy.unavailable, false);
    document.head.appendChild(script);
  }

  async function start() {
    try {
      const response = await fetch("/api/turnstile", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store"
      });
      if (!response.ok) throw new Error("security-config-unavailable");
      const config = await response.json();
      if (!config.enabled) {
        releaseGate();
        return;
      }
      if (config.verified === true) {
        releaseGate();
        return;
      }
      if (typeof config.siteKey !== "string" || !config.siteKey) {
        showFailure(copy.unavailable, false);
        return;
      }
      loadWidget(config.siteKey, config.action);
    } catch {
      showFailure(copy.unavailable, false);
    }
  }

  retryButton.addEventListener("click", () => {
    if (!retryButton.onclick) window.location.reload();
  });

  start();
})();