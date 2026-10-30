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
  const accentPicker = document.getElementById("accent-picker");
  const accentTrigger = document.getElementById("accent-trigger");
  const accentMenu = document.getElementById("accent-menu");
  const accentCurrentLabel = document.getElementById("accent-current-label");
  const accentCurrentDot = document.getElementById("accent-current-dot");
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
    const selectedChoice = [...modal.querySelectorAll("[data-accent-value]")]
      .find(choice => choice.dataset.accentValue === draftSettings.accent);
    if (selectedChoice) {
      accentCurrentLabel.textContent = selectedChoice.querySelector("span:nth-child(2)").textContent;
      accentCurrentDot.style.setProperty("--swatch", draftSettings.accent);
    }
    modal.querySelectorAll("[data-accent-value]").forEach(choice => {
      choice.setAttribute("aria-selected", String(choice.dataset.accentValue === draftSettings.accent));
    });
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
    setAccentMenu(false);
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

  function setAccentMenu(open) {
    accentMenu.hidden = !open;
    accentTrigger.setAttribute("aria-expanded", String(open));
  }

  settingsButton.addEventListener("click", openSettings);
  closeButton.addEventListener("click", () => closeSettings());
  cancelButton.addEventListener("click", () => closeSettings());
  accentTrigger.addEventListener("click", () => {
    setAccentMenu(accentMenu.hidden);
  });

  modal.addEventListener("click", event => {
    if (event.target === modal) closeSettings();
    const themeButton = event.target.closest("[data-theme-value]");
    if (themeButton) {
      draftSettings.theme = themeButton.dataset.themeValue;
      updateControls();
      applySettings(draftSettings);
    }

    const accentChoice = event.target.closest("[data-accent-value]");
    if (accentChoice) {
      draftSettings.accent = accentChoice.dataset.accentValue;
      updateControls();
      applySettings(draftSettings);
      setAccentMenu(false);
      accentTrigger.focus();
    } else if (accentPicker && !accentPicker.contains(event.target)) {
      setAccentMenu(false);
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) {
      if (!accentMenu.hidden) {
        setAccentMenu(false);
        accentTrigger.focus();
      } else {
        closeSettings();
      }
    }
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
