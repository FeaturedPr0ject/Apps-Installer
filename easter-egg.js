(() => {
  const brand = document.querySelector(".brand");
  const brandName = brand?.querySelector(".brand-name");
  if (!brand || !brandName || window.__APPS_INSTALLER_EASTER_EGG__) return;

  window.__APPS_INSTALLER_EASTER_EGG__ = true;

  const COUNT_KEY = "appsInstallerSecretClickCount";
  const TARGET_COUNT = 20;
  let clickCount = 0;
  let isFinishing = false;
  let activeToast = null;

  try {
    clickCount = Math.max(0, Math.min(TARGET_COUNT - 1, Number.parseInt(sessionStorage.getItem(COUNT_KEY) || "0", 10) || 0));
  } catch {}

  function saveCount() {
    try {
      sessionStorage.setItem(COUNT_KEY, String(clickCount));
    } catch {}
  }

  function resetCount() {
    clickCount = 0;
    try {
      sessionStorage.removeItem(COUNT_KEY);
    } catch {}
  }

  function currentLanguage() {
    const selected = window.APP_LANG?.language;
    if (selected === "vi" || selected === "en") return selected;
    const documentLanguage = document.documentElement.lang?.toLowerCase();
    return documentLanguage?.startsWith("vi") ? "vi" : "en";
  }

  function updateWarningLevel() {
    brand.classList.remove("egg-warning-1", "egg-warning-2", "egg-warning-3");
    if (clickCount >= 16) brand.classList.add("egg-warning-3");
    else if (clickCount >= 11) brand.classList.add("egg-warning-2");
    else if (clickCount >= 6) brand.classList.add("egg-warning-1");
  }

  function showToast(message, critical = false) {
    if (activeToast) activeToast.remove();
    const toast = document.createElement("div");
    toast.className = "egg-toast" + (critical ? " egg-toast-critical" : "");
    toast.setAttribute("role", "status");
    toast.textContent = message;
    document.body.append(toast);
    activeToast = toast;
    window.setTimeout(() => {
      if (activeToast === toast) activeToast = null;
      toast.remove();
    }, 1950);
  }

  function triggerRandomEvent() {
    brandName.classList.remove("egg-random-glitch");
    void brandName.offsetWidth;
    brandName.classList.add("egg-random-glitch");
    window.setTimeout(() => brandName.classList.remove("egg-random-glitch"), 260);

    const messages = currentLanguage() === "vi"
      ? [
          "TÍN HIỆU KHÔNG ỔN ĐỊNH",
          "BẠN VỪA CHẠM VÀO THỨ GÌ VẬY?",
          "ĐỪNG TIẾP TỤC...",
          "CÓ GÌ ĐÓ ĐANG THAY ĐỔI",
          "BẠN VẪN ĐANG NHẤN SAO?"
        ]
      : [
          "SIGNAL INSTABILITY",
          "WHAT DID YOU TOUCH?",
          "DO NOT CONTINUE...",
          "SOMETHING IS CHANGING",
          "ARE YOU STILL CLICKING?"
        ];

    const probability = Math.min(.76, .18 + clickCount * .027);
    if (Math.random() < probability) {
      const message = messages[Math.floor(Math.random() * messages.length)];
      showToast(message, clickCount >= 16);
    }
  }

  function splitIntoCharacters(value) {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(value)].map(item => item.segment);
    }
    return Array.from(value);
  }

  function shatterBrand() {
    const characters = splitIntoCharacters(brandName.textContent || "AppsInstaller");
    brandName.replaceChildren();
    brandName.classList.remove("egg-random-glitch");
    brandName.classList.add("egg-shattering");
    brand.setAttribute("aria-hidden", "true");

    characters.forEach((character, index) => {
      const shard = document.createElement("span");
      shard.className = "egg-shard";
      shard.textContent = character === " " ? "\u00a0" : character;
      shard.style.setProperty("--egg-x", (Math.random() * 170 - 85).toFixed(1) + "px");
      shard.style.setProperty("--egg-y", (Math.random() * 130 - 30).toFixed(1) + "px");
      shard.style.setProperty("--egg-r", (Math.random() * 100 - 50).toFixed(1) + "deg");
      shard.style.setProperty("--egg-delay", (index * 24 + Math.random() * 80).toFixed(0) + "ms");
      brandName.append(shard);
    });
  }

  function showWhiteoutAndReload(overlay) {
    overlay.classList.remove("has-jumpscare");
    overlay.classList.add("is-whiteout");
    resetCount();
    window.setTimeout(() => window.location.reload(), 2000);
  }

  function showRandomEntityJumpscare(overlay) {
    const entities = [
      {
        id: "G-26",
        tint: "#E8F1ED",
        background: "#020303",
        image: "https://static.wikia.nocookie.net/rooms-low-detailed/images/6/6c/JumpscareG26.gif",
        fallback: "https://static.wikia.nocookie.net/rooms-low-detailed/images/6/6c/JumpscareG26.gif/revision/latest/scale-to-width-down/120?cb=20230731164709"
      }
    ];

    const entity = entities[Math.floor(Math.random() * entities.length)];
    overlay.dataset.entity = entity.id;
    overlay.style.setProperty("--entity-tint", entity.tint);
    overlay.style.setProperty("--entity-background", entity.background);
    overlay.classList.add("has-jumpscare");

    const image = document.createElement("img");
    image.className = "egg-entity-image";
    image.alt = entity.id + " jumpscare";
    image.decoding = "async";
    image.draggable = false;
    image.src = entity.image;
    image.dataset.fallbackUsed = "false";
    image.addEventListener("error", () => {
      if (image.dataset.fallbackUsed === "false") {
        image.dataset.fallbackUsed = "true";
        image.src = entity.fallback;
        return;
      }
      image.remove();
      overlay.classList.add("entity-image-unavailable");
    });

    overlay.querySelector(".egg-message")?.remove();
    overlay.append(image);

    window.setTimeout(() => showWhiteoutAndReload(overlay), 1800);
  }

  function createFinalOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "apps-easter-egg-overlay";
    overlay.setAttribute("role", "alert");
    overlay.setAttribute("aria-live", "assertive");

    const message = document.createElement("p");
    message.className = "egg-message";
    overlay.append(message);
    document.body.append(overlay);

    window.requestAnimationFrame(() => overlay.classList.add("is-visible"));

    const finalText = currentLanguage() === "vi"
      ? "B̷̫̋͘Ạ̸͕͘N̴̲͐̕ ̵̟̃̆͜Đ̷͉̃̕Ã̸͙̥͛ ̷̗̺̾̈L̴̝͂́ͅÀ̷̬̉M̸̠̔͝ ̴̩̑G̷͚̣͌Ì̵̘̲̈́͒ ̷̧͉̀V̴̤͖̀̏Ậ̴̘͈̃̂Y̵̩͆?̸̥͗"
      : "WHAT HAVE YOU DONE?";

    const characters = splitIntoCharacters(finalText);
    let index = 0;
    message.classList.add("is-typing");

    function typeNextCharacter() {
      if (index >= characters.length) {
        window.setTimeout(() => showRandomEntityJumpscare(overlay), 180);
        return;
      }

      message.textContent += characters[index];
      index += 1;
      const delay = 42 + Math.floor(Math.random() * 23);
      window.setTimeout(typeNextCharacter, delay);
    }

    typeNextCharacter();
  }
  function finishEasterEgg() {
    if (isFinishing) return;
    isFinishing = true;
    saveCount();
    brand.classList.remove("egg-warning-1", "egg-warning-2", "egg-warning-3");
    shatterBrand();
    window.setTimeout(createFinalOverlay, 3000);
  }

  function handleBrandClick(event) {
    event.preventDefault();
    if (isFinishing) return;

    clickCount = Math.min(TARGET_COUNT, clickCount + 1);
    saveCount();
    updateWarningLevel();

    if (clickCount >= TARGET_COUNT) {
      finishEasterEgg();
      return;
    }

    triggerRandomEvent();
  }

  brand.addEventListener("click", handleBrandClick);
  updateWarningLevel();
})();