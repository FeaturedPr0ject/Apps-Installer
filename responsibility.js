(() => {
  const NOTICE_VERSION = "2026-10-31-v1";
  const STORAGE_KEY = "apps_installer_responsibility_notice";
  const overlay = document.getElementById("responsibility-overlay");
  const dialog = overlay?.querySelector(".responsibility-dialog");
  const acknowledgeButton = document.getElementById("responsibility-ack");
  const reopenButton = document.getElementById("open-responsibility");

  if (!overlay || !dialog || !acknowledgeButton || !reopenButton) return;

  let returnFocus = null;
  let previousOverflow = "";

  function hasAcknowledged() {
    try {
      return localStorage.getItem(STORAGE_KEY) === NOTICE_VERSION;
    } catch {
      return false;
    }
  }

  function openNotice() {
    returnFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    overlay.hidden = false;
    document.body.classList.add("responsibility-open");
    document.body.style.overflow = "hidden";
    acknowledgeButton.focus();
  }

  function closeNotice() {
    try {
      localStorage.setItem(STORAGE_KEY, NOTICE_VERSION);
    } catch {}
    overlay.hidden = true;
    document.body.classList.remove("responsibility-open");
    document.body.style.overflow = previousOverflow;
    if (returnFocus && typeof returnFocus.focus === "function") returnFocus.focus();
  }

  acknowledgeButton.addEventListener("click", closeNotice);
  reopenButton.addEventListener("click", openNotice);

  dialog.addEventListener("keydown", event => {
    if (event.key === "Tab") {
      event.preventDefault();
      acknowledgeButton.focus();
    }
  });

  if (!hasAcknowledged()) openNotice();
})();
