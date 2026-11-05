(() => {
  const records = new WeakMap();
  const closingTimers = new WeakMap();
  const openPopups = new Set();
  const CLOSE_MS = 210;

  function remember(menu) {
    let record = records.get(menu);
    if (!record) {
      record = {
        parent: menu.parentNode,
        nextSibling: menu.nextSibling,
        style: menu.getAttribute("style"),
        hidden: menu.hasAttribute("hidden")
      };
      records.set(menu, record);
    }
    return record;
  }

  function restore(menu, record) {
    menu.classList.remove("popup-floating");
    menu.removeAttribute("data-popup-open");
    if (record.style === null) menu.removeAttribute("style");
    else menu.setAttribute("style", record.style);
    if (record.parent && record.parent.isConnected) {
      const before = record.nextSibling && record.nextSibling.parentNode === record.parent
        ? record.nextSibling
        : null;
      record.parent.insertBefore(menu, before);
    }
    if (record.hidden) menu.setAttribute("hidden", "");
    else menu.removeAttribute("hidden");
    records.delete(menu);
    openPopups.delete(menu);
  }

  function place(menu, anchor, record) {
    if (!anchor || !anchor.isConnected || !menu.isConnected) return;
    const anchorRect = anchor.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const matchWidth = menu.classList.contains("accent-menu") ||
      menu.classList.contains("language-setting-menu");
    const desiredWidth = matchWidth ? anchorRect.width : menu.getBoundingClientRect().width;
    const width = Math.min(desiredWidth || 280, viewportWidth - 20);
    if (matchWidth) menu.style.width = width + "px";
    menu.style.maxWidth = "calc(100vw - 20px)";
    menu.style.left = "10px";
    menu.style.top = "10px";
    menu.style.visibility = "hidden";

    const menuHeight = menu.getBoundingClientRect().height;
    const below = viewportHeight - anchorRect.bottom - 12;
    const above = anchorRect.top - 12;
    const placeAbove = below < menuHeight && above > below;
    let top = placeAbove ? anchorRect.top - menuHeight - 8 : anchorRect.bottom + 8;
    top = Math.max(10, Math.min(top, viewportHeight - menuHeight - 10));
    let left = anchorRect.left;
    left = Math.max(10, Math.min(left, viewportWidth - width - 10));

    menu.style.position = "fixed";
    menu.style.left = left + "px";
    menu.style.top = top + "px";
    menu.style.width = matchWidth ? width + "px" : "";
    menu.style.visibility = "";
    menu.dataset.popupPlacement = placeAbove ? "above" : "below";
    record.anchor = anchor;
  }

  function open(menu, anchor) {
    if (!menu || !anchor) return;
    const pending = closingTimers.get(menu);
    if (pending) {
      clearTimeout(pending);
      closingTimers.delete(menu);
    }

    const record = remember(menu);
    record.anchor = anchor;
    menu.hidden = false;
    menu.classList.add("popup-floating");
    menu.dataset.popupOpen = "false";
    menu.style.position = "fixed";
    menu.style.zIndex = "30000";
    menu.style.display = menu.classList.contains("category-menu") ? "block" : "grid";
    document.body.appendChild(menu);
    openPopups.add(menu);
    place(menu, anchor, record);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!records.has(menu)) return;
        menu.dataset.popupOpen = "true";
        menu.style.visibility = "visible";
      });
    });
  }

  function close(menu) {
    if (!menu || !records.has(menu)) return;
    const record = records.get(menu);
    menu.dataset.popupOpen = "false";
    menu.style.visibility = "visible";
    const oldTimer = closingTimers.get(menu);
    if (oldTimer) clearTimeout(oldTimer);
    const timer = setTimeout(() => {
      restore(menu, record);
      closingTimers.delete(menu);
    }, CLOSE_MS);
    closingTimers.set(menu, timer);
  }

  function closeAll(except) {
    [...openPopups].forEach(menu => {
      if (menu !== except) close(menu);
    });
  }

  function isOpen(menu) {
    return Boolean(menu && records.has(menu) && menu.dataset.popupOpen === "true");
  }

  function reposition() {
    openPopups.forEach(menu => {
      const record = records.get(menu);
      if (record?.anchor?.isConnected) place(menu, record.anchor, record);
      else close(menu);
    });
  }

  window.addEventListener("resize", reposition, { passive: true });
  window.addEventListener("scroll", reposition, { passive: true, capture: true });

  window.AppPopup = { open, close, closeAll, isOpen };
})();