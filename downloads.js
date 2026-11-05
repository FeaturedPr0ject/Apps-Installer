(() => {
  function getMenu(wrap) {
    const button = wrap?.querySelector(".download-expand");
    return button?._downloadMenu || wrap?.querySelector(".download-menu") || null;
  }

  function closeDropdown(wrap, restoreFocus = false) {
    if (!wrap) return;
    const button = wrap.querySelector(".download-expand");
    const menu = getMenu(wrap);
    if (!button || !menu) return;
    if (window.AppPopup) window.AppPopup.close(menu);
    else menu.hidden = true;
    button.setAttribute("aria-expanded", "false");
    wrap.closest(".app")?.classList.remove("dropdown-open");
    if (restoreFocus) button.focus();
  }

  function closeOthers(except) {
    document.querySelectorAll(".download-wrap").forEach(wrap => {
      if (wrap !== except) closeDropdown(wrap);
    });
  }

  document.addEventListener("click", event => {
    const button = event.target.closest(".download-expand");
    if (button) {
      const wrap = button.closest(".download-wrap");
      const menu = getMenu(wrap);
      if (!wrap || !menu || button.disabled) return;
      if (window.AppPopup?.isOpen(menu)) {
        closeDropdown(wrap);
      } else {
        closeOthers(wrap);
        if (window.AppPopup) window.AppPopup.open(menu, button);
        else menu.hidden = false;
        button.setAttribute("aria-expanded", "true");
        wrap.closest(".app")?.classList.add("dropdown-open");
      }
      return;
    }

    const option = event.target.closest(".download-option");
    if (option) {
      const menu = option.closest(".download-menu");
      closeDropdown(menu?._downloadOwner);
      return;
    }

    if (!event.target.closest(".download-wrap") && !event.target.closest(".download-menu")) {
      closeOthers(null);
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const openMenu = document.querySelector(".download-menu[data-popup-open='true']");
    if (openMenu) closeDropdown(openMenu._downloadOwner, true);
  });
})();