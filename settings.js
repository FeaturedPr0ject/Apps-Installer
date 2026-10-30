(() => {
  const CONSENT_COOKIE = "gi_cookie_choice";
  const SETTINGS_COOKIE = "gi_preferences";
  const COOKIE_DAYS = 365;
  const DEFAULTS = { theme: "system", accent: "#f44336" };
  const ACCENTS = ["#f44336", "#ff7043", "#3b82f6", "#16a34a", "#8b5cf6"];
  const root = document.documentElement;
  const banner = document.getElementById("cookie-banner");
  const modal = document.getElementById("settings-modal");
  const settingsButton = document.getElementById("settings-button");
  const closeButton = document.getElementById("settings-close");
  const cancelButton = document.getElementById("settings-cancel");
  const saveButton = document.getElementById("settings-save");
  const accentSelect = document.getElementById("accent-select");
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  if (!banner || !modal || !settingsButton) return;

  let consent = readCookie(CONSENT_COOKIE);
  let savedSettings = consent === "accepted" ? readSettingsCookie() : { ...DEFAULTS };
  let draftSettings = { ...savedSettings };

  function readCookie(name) {
    const entry = document.cookie.split("; ").find(part => part.startsWith(name + "="));
    if (!entry) return null;
    try { return decodeURIComponent(entry.slice(name.length + 1)); }
    catch { return null; }
  }

  function writeCookie(name, value, days) {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = name + "=" + encodeURIComponent(value) +
      "; Max-Age=" + (days * 24 * 60 * 60) + "; Path=/; SameSite=Lax" + secure;
  }

  function removeCookie(name) {
    document.cookie = name + "=; Max-Age=0; Path=/; SameSite=Lax" +
      (location.protocol === "https:" ? "; Secure" : "");
  }

  function readSettingsCookie() {
    try {
      const value = JSON.parse(readCookie(SETTINGS_COOKIE) || "null");
      return {
        theme: ["system", "light", "dark"].includes(value?.theme) ? value.theme : DEFAULTS.theme,
        accent: ACCENTS.includes(value?.accent) ? value.accent : DEFAULTS.accent
      };
    } catch {
      return { ...DEFAULTS };
    }
  }

  function applySettings(settings) {
    root.dataset.theme = settings.theme;
    root.style.setProperty("--accent", settings.accent);
    if (metaTheme) metaTheme.setAttribute("content", settings.theme === "dark" ? "#17191d" : "#ffffff");
  }

  function updateControls() {
    modal.querySelectorAll("[data-theme-value]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.themeValue === draftSettings.theme));
    });
    if (accentSelect) accentSelect.value = draftSettings.accent;
  }

  function openSettings() {
    draftSettings = { ...savedSettings };
    updateControls();
    applySettings(draftSettings);
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    closeButton?.focus();
  }

  function closeSettings(restore = true) {
    if (restore) applySettings(savedSettings);
    modal.hidden = true;
    document.body.style.overflow = "";
    settingsButton.focus();
  }

  function savePreferences() {
    savedSettings = { ...draftSettings };
    applySettings(savedSettings);
    consent = "accepted";
    writeCookie(CONSENT_COOKIE, "accepted", COOKIE_DAYS);
    writeCookie(SETTINGS_COOKIE, JSON.stringify(savedSettings), COOKIE_DAYS);
    banner.hidden = true;
    closeSettings(false);
  }

  settingsButton.addEventListener("click", openSettings);
  closeButton.addEventListener("click", () => closeSettings());
  cancelButton.addEventListener("click", () => closeSettings());

  modal.addEventListener("click", event => {
    if (event.target === modal) closeSettings();
    const themeButton = event.target.closest("[data-theme-value]");
    if (themeButton) {
      draftSettings.theme = themeButton.dataset.themeValue;
      updateControls();
      applySettings(draftSettings);
    }
  });

  accentSelect?.addEventListener("change", () => {
    draftSettings.accent = accentSelect.value;
    applySettings(draftSettings);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) closeSettings();
  });

  saveButton.addEventListener("click", savePreferences);
  banner.querySelector("[data-cookie-action='accept']").addEventListener("click", () => {
    draftSettings = { ...savedSettings };
    savePreferences();
  });
  banner.querySelector("[data-cookie-action='reject']").addEventListener("click", () => {
    consent = "declined";
    removeCookie(SETTINGS_COOKIE);
    writeCookie(CONSENT_COOKIE, "declined", COOKIE_DAYS);
    savedSettings = { ...DEFAULTS };
    draftSettings = { ...DEFAULTS };
    applySettings(savedSettings);
    banner.hidden = true;
  });
  banner.querySelector("[data-cookie-action='customize']").addEventListener("click", openSettings);

  applySettings(savedSettings);
  banner.hidden = consent === "accepted" || consent === "declined";
})();
