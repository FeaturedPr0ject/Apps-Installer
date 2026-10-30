(() => {
  const root = document.getElementById("ad-popup-root");
  if (!root) return;

  function safeUrl(value) {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const url = new URL(value, location.href);
      return ["https:", "http:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  }

  function buildPopup(ad) {
    const imageUrl = safeUrl(ad.image);
    const targetUrl = safeUrl(ad.url);
    const titleText = typeof ad.title === "string" ? ad.title.trim() : "";
    const descriptionText = typeof ad.description === "string" ? ad.description.trim() : "";
    if (!titleText && !descriptionText && !imageUrl) return null;

    const overlay = createElement("div", "xp-ad-overlay");
    overlay.hidden = true;

    const dialog = createElement("section", "xp-ad-window");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "xp-ad-title");
    dialog.setAttribute("aria-describedby", "xp-ad-description");

    const titlebar = createElement("header", "xp-ad-titlebar");
    const titleIcon = createElement("span", "xp-ad-title-icon", "i");
    titleIcon.setAttribute("aria-hidden", "true");
    const windowTitle = createElement("span", "xp-ad-window-title", "Apps Installer - Advertisement");
    const closeButton = createElement("button", "xp-ad-close");
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close advertisement");
    closeButton.title = "Close";
    titlebar.append(titleIcon, windowTitle, closeButton);

    const body = createElement("div", "xp-ad-body");
    if (imageUrl) {
      const image = document.createElement("img");
      image.className = "xp-ad-image";
      image.src = imageUrl;
      image.alt = "";
      image.loading = "eager";
      body.append(image);
    }

    const content = createElement("div", "xp-ad-content");
    const badgeText = typeof ad.badge === "string" && ad.badge.trim() ? ad.badge.trim() : "Advertisement";
    content.append(createElement("div", "xp-ad-badge", badgeText));
    const title = createElement("h2", "xp-ad-title", titleText || "Featured");
    title.id = "xp-ad-title";
    content.append(title);
    const description = createElement("p", "xp-ad-description", descriptionText);
    description.id = "xp-ad-description";
    content.append(description);
    body.append(content);

    const footer = createElement("footer", "xp-ad-footer");
    if (targetUrl) {
      const action = createElement("a", "xp-ad-button xp-ad-button-primary",
        typeof ad.button === "string" && ad.button.trim() ? ad.button.trim() : "Learn more");
      action.href = targetUrl;
      action.target = "_blank";
      action.rel = "noopener noreferrer";
      footer.append(action);
    }

    dialog.append(titlebar, body, footer);
    overlay.append(dialog);
    root.replaceChildren(overlay);

    let previousFocus = null;
    let previousOverflow = "";

    let dragState = null;
    let translateX = 0;
    let translateY = 0;

    titlebar.addEventListener("pointerdown", event => {
      if (event.button !== 0 || event.target.closest("button")) return;
      const rect = dialog.getBoundingClientRect();
      dragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        rectLeft: rect.left,
        rectTop: rect.top,
        startTranslateX: translateX,
        startTranslateY: translateY
      };
      titlebar.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    titlebar.addEventListener("pointermove", event => {
      if (!dragState || event.pointerId !== dragState.pointerId) return;
      const rect = dialog.getBoundingClientRect();
      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY;
      const minDx = 12 - dragState.rectLeft;
      const maxDx = window.innerWidth - 12 - (dragState.rectLeft + rect.width);
      const minDy = 12 - dragState.rectTop;
      const maxDy = window.innerHeight - 12 - (dragState.rectTop + rect.height);
      const boundedDx = Math.min(Math.max(dx, minDx), Math.max(minDx, maxDx));
      const boundedDy = Math.min(Math.max(dy, minDy), Math.max(minDy, maxDy));
      translateX = dragState.startTranslateX + boundedDx;
      translateY = dragState.startTranslateY + boundedDy;
      dialog.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    });

    const endDrag = event => {
      if (!dragState || (event && event.pointerId !== dragState.pointerId)) return;
      if (titlebar.hasPointerCapture(dragState.pointerId)) {
        titlebar.releasePointerCapture(dragState.pointerId);
      }
      dragState = null;
    };
    titlebar.addEventListener("pointerup", endDrag);
    titlebar.addEventListener("pointercancel", endDrag);

    function closePopup() {
      if (overlay.hidden) return;
      overlay.hidden = true;
      document.body.classList.remove("xp-ad-open");
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onEscape);
      previousFocus?.focus?.();
    }

    function onEscape(event) {
      if (event.key === "Escape" && !overlay.hidden) closePopup();
    }

    closeButton.addEventListener("click", closePopup);
    if (targetUrl) {
      footer.querySelector(".xp-ad-button-primary").addEventListener("click", closePopup);
    }

    dialog.addEventListener("keydown", event => {
      if (event.key !== "Tab") return;
      const focusable = [...dialog.querySelectorAll("a[href], button:not(:disabled)")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    return {
      show() {
        previousFocus = document.activeElement;
        previousOverflow = document.body.style.overflow;
        translateX = 0;
        translateY = 0;
        dialog.style.transform = "";
        overlay.hidden = false;
        document.body.classList.add("xp-ad-open");
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onEscape);
        closeButton.focus();
      }
    };
  }

  async function init() {
    try {
      const response = await fetch("./ad.json", { cache: "no-store" });
      if (!response.ok) return;
      const ad = await response.json();
      if (!ad || ad.enabled !== true) return;

      const popup = buildPopup(ad);
      if (!popup) return;
      const delay = Number.isFinite(ad.popupDelayMs)
        ? Math.max(0, Math.min(15000, ad.popupDelayMs))
        : 900;
      window.setTimeout(popup.show, delay);
    } catch {}
  }

  init();
})();
