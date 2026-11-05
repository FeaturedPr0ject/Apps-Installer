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
    overlay.querySelector(".egg-jumpscare-stage")?.remove();
    overlay.classList.remove("has-jumpscare", "is-jumpscare-pause");
    overlay.classList.add("is-whiteout");
    resetCount();
    window.setTimeout(() => window.location.reload(), 2000);
  }

  function showRandomEntityJumpscare(overlay) {
    const entities = [
      { id: "G-26", tint: "#E8F1ED", background: "#020303", image: "./assets/entities/g-26.svg" },
      { id: "G-159", tint: "#9BE22A", background: "#040702", image: "./assets/entities/g-159.svg" },
      { id: "A-60", tint: "#DC0000", background: "#100102", image: "./assets/entities/a-60.svg" },
      { id: "G-60", tint: "#39F9FF", background: "#00141A", image: "./assets/entities/g-60.svg" },
      { id: "G-55", tint: "#C8C8C8", background: "#050505", image: "./assets/entities/g-55.svg" }
    ];

    let previousEntity = "";
    try { previousEntity = sessionStorage.getItem("appsInstallerLastEntity") || ""; } catch {}
    const available = entities.filter(entity => entity.id !== previousEntity);
    const entity = available[Math.floor(Math.random() * available.length)] || entities[0];

    try { sessionStorage.setItem("appsInstallerLastEntity", entity.id); } catch {}

    overlay.dataset.entity = entity.id;
    overlay.style.setProperty("--entity-tint", entity.tint);
    overlay.style.setProperty("--entity-background", entity.background);
    overlay.classList.add("is-jumpscare-pause");
    overlay.querySelector(".egg-message")?.remove();

    window.setTimeout(() => {
      const stage = document.createElement("div");
      stage.className = "egg-jumpscare-stage";

      const echoRed = document.createElement("img");
      echoRed.className = "egg-entity-image egg-entity-echo egg-entity-echo-red";
      echoRed.src = entity.image;
      echoRed.alt = "";
      echoRed.draggable = false;

      const echoCyan = document.createElement("img");
      echoCyan.className = "egg-entity-image egg-entity-echo egg-entity-echo-cyan";
      echoCyan.src = entity.image;
      echoCyan.alt = "";
      echoCyan.draggable = false;

      const image = document.createElement("img");
      image.className = "egg-entity-image egg-entity-main";
      image.alt = entity.id + " original fan-made jumpscare illustration";
      image.decoding = "sync";
      image.draggable = false;
      image.src = entity.image;
      image.addEventListener("error", () => {
        stage.remove();
        overlay.classList.remove("has-jumpscare");
        overlay.classList.add("entity-image-unavailable");
        showWhiteoutAndReload(overlay);
      }, { once: true });

      stage.append(echoRed, echoCyan, image);
      overlay.append(stage);
      overlay.classList.remove("is-jumpscare-pause");
      overlay.classList.add("has-jumpscare");
    }, 115);

    window.setTimeout(() => showWhiteoutAndReload(overlay), 1950);
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