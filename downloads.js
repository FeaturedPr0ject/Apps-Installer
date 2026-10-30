(() => {
  function closeDropdown(wrap, restoreFocus = false) {
    if (!wrap) return;
    const button = wrap.querySelector(".download-expand");
    const menu = wrap.querySelector(".download-menu");
    if (!button || !menu) return;
    menu.hidden = true;
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
      const menu = wrap?.querySelector(".download-menu");
      if (!wrap || !menu || button.disabled) return;
      const shouldOpen = menu.hidden;
      closeOthers(wrap);
      menu.hidden = !shouldOpen;
      button.setAttribute("aria-expanded", String(shouldOpen));
      wrap.closest(".app")?.classList.toggle("dropdown-open", shouldOpen);
      return;
    }

    const option = event.target.closest(".download-option");
    if (option) {
      closeDropdown(option.closest(".download-wrap"));
      return;
    }

    if (!event.target.closest(".download-wrap")) closeOthers(null);
  });

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const openMenu = document.querySelector(".download-menu:not([hidden])");
    if (openMenu) closeDropdown(openMenu.closest(".download-wrap"), true);
  });
})();
