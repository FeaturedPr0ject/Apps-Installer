(() => {
  const STORAGE_KEY = "apps_installer_language";
  const PROMPT_SEEN_KEY = "apps_installer_language_prompt_seen_v1";
  const dictionaries = {
    en: {
      search: "Search apps...",
      all: "All",
      windowsPackage: "Windows Package",
      systemPackage: "System Package",
      heroEyebrow: "INDEPENDENT SOFTWARE CATALOG",
      heroFirst: "Discover apps.",
      heroSecond: "Make more possible.",
      heroDescription: "Explore useful software for Windows and your system, with clear descriptions and transparent download destinations.",
      curated: "Curated listings",
      transparent: "Transparent links",
      browse: "BROWSE THE LIBRARY",
      disclosureTitle: "Independent app catalog",
      disclosureBody: "Apps Installer is not affiliated with the developers or publishers of the listed apps. Download buttons open external websites; files are not hosted, modified, or installed by this site. Check the destination domain and software publisher before downloading or running any file.",
      footerDescription: "An independent directory of useful software.",
      footerNotice: "Responsibility notice",
      oneApp: "app",
      manyApps: "apps",
      loading: "Loading apps...",
      pleaseWait: "Please wait.",
      noMatchingApps: "No matching apps",
      tryAnotherSearch: "Try another search.",
      noApps: "No apps yet",
      newApps: "New apps will appear here soon.",
      loadError: "Could not load app catalog",
      invalidCatalog: "The app list has an invalid format",
      externalDestination: "External destination",
      download: "Download",
      moreDownloads: "More download options for",
      cookieTitle: "Cookie preferences",
      cookieText: "We use a preference cookie to remember your theme and accent color on this device. This page does not use tracking cookies.",
      onlyNecessary: "Only necessary",
      customize: "Customize",
      allowPreferences: "Allow preferences",
      settingsTitle: "Appearance settings",
      settingsDescription: "Choose how Apps Installer looks on this device.",
      theme: "Theme",
      system: "System",
      light: "Light",
      dark: "Dark",
      accentColor: "Accent color",
      language: "Language",
      settingsNote: "Your appearance choices are stored in a first-party browser cookie only after you allow preference cookies. Choose “Only necessary” to keep the default appearance without saving these preferences.",
      cancel: "Cancel",
      save: "Save preferences",
      red: "Red",
      orange: "Orange",
      blue: "Blue",
      green: "Green",
      purple: "Purple",
      languageEyebrow: "LANGUAGE",
      languageTitle: "Choose your language",
      languageDescription: "Select the language you want to use on Apps Installer.",
      vietnameseSubtitle: "Vietnamese interface",
      englishSubtitle: "English interface",
      continue: "Continue",
      responsibilityEyebrow: "PLEASE READ BEFORE CONTINUING",
      responsibilityTitle: "Responsibility & Download Notice",
      responsibilityIntro: "Apps Installer is an independent app catalog. Download buttons take you to external websites; this site does not host, modify, or run those files.",
      ourResponsibility: "Our responsibility",
      our1: "We are responsible for maintaining this catalog and presenting app names, descriptions, and download destinations as accurately as we reasonably can.",
      our2: "We will review reports about incorrect, broken, misleading, or potentially unsafe listings and take appropriate action, including removing links when necessary.",
      our3: "We will identify external download destinations where available and will not intentionally disguise third-party links as official publisher pages.",
      yourResponsibility: "Your responsibility when using this catalog",
      your1: "Check the destination domain and make sure it belongs to the app publisher or another source you trust before downloading.",
      your2: "Verify the publisher, digital signature, version, device compatibility, and license terms where available.",
      your3: "Keep your operating system and security software up to date. Scan downloaded files before opening them and never disable security protections just to run a download.",
      your4: "Review the third-party website's terms and privacy practices. External websites and files are controlled by their respective operators and may change without notice.",
      your5: "Do not provide passwords, payment details, recovery codes, or other sensitive information unless you have independently verified the website and have a legitimate reason to do so.",
      your6: "Use downloaded software lawfully and follow the publisher's instructions and applicable rules.",
      responsibilityNote: "By selecting “I Understand”, you confirm that you have read this notice. This acknowledgement does not remove or waive any responsibility that cannot legally be excluded.",
      understand: "I Understand",
      searchAria: "Search apps",
      settingsAria: "Open appearance settings",
      closeAria: "Close settings",
      appCategoriesAria: "App categories",
      categoryMenuHeading: "BROWSE CATEGORIES",
      categoryAllDescription: "Show every app",
      categoryWindowsDescription: "Apps for Windows",
      categorySystemDescription: "System utilities and tools",
      accentAria: "Accent color"
    },
    vi: {
      search: "Tìm kiếm ứng dụng...",
      all: "Tất cả",
      windowsPackage: "Gói Windows",
      systemPackage: "Gói hệ thống",
      heroEyebrow: "DANH MỤC PHẦN MỀM ĐỘC LẬP",
      heroFirst: "Khám phá ứng dụng.",
      heroSecond: "Mở rộng khả năng.",
      heroDescription: "Khám phá phần mềm hữu ích cho Windows và hệ thống, cùng mô tả rõ ràng và đường dẫn tải xuống minh bạch.",
      curated: "Ứng dụng được tuyển chọn",
      transparent: "Liên kết minh bạch",
      browse: "KHÁM PHÁ THƯ VIỆN",
      disclosureTitle: "Danh mục ứng dụng độc lập",
      disclosureBody: "Apps Installer không liên kết với nhà phát triển hoặc nhà phát hành của các ứng dụng được liệt kê. Nút tải xuống sẽ mở trang web bên ngoài; trang này không lưu trữ, chỉnh sửa hoặc cài đặt tệp. Hãy kiểm tra tên miền đích và nhà phát hành phần mềm trước khi tải xuống hoặc chạy bất kỳ tệp nào.",
      footerDescription: "Danh mục phần mềm hữu ích độc lập.",
      footerNotice: "Thông báo trách nhiệm",
      oneApp: "ứng dụng",
      manyApps: "ứng dụng",
      loading: "Đang tải danh mục ứng dụng...",
      pleaseWait: "Vui lòng chờ.",
      noMatchingApps: "Không tìm thấy ứng dụng phù hợp",
      tryAnotherSearch: "Hãy thử từ khóa khác.",
      noApps: "Chưa có ứng dụng",
      newApps: "Ứng dụng mới sẽ được cập nhật tại đây.",
      loadError: "Không thể tải danh mục ứng dụng",
      invalidCatalog: "Danh sách ứng dụng không đúng định dạng",
      externalDestination: "Nguồn tải bên ngoài",
      download: "Tải xuống",
      moreDownloads: "Thêm tùy chọn tải xuống cho",
      cookieTitle: "Tùy chọn cookie",
      cookieText: "Trang sử dụng cookie tùy chọn để ghi nhớ giao diện và màu nhấn trên thiết bị này. Trang không sử dụng cookie theo dõi.",
      onlyNecessary: "Chỉ cần thiết",
      customize: "Tùy chỉnh",
      allowPreferences: "Cho phép lưu tùy chọn",
      settingsTitle: "Cài đặt giao diện",
      settingsDescription: "Tùy chỉnh cách Apps Installer hiển thị trên thiết bị này.",
      theme: "Giao diện",
      system: "Theo hệ thống",
      light: "Sáng",
      dark: "Tối",
      accentColor: "Màu nhấn",
      language: "Ngôn ngữ",
      settingsNote: "Tùy chọn giao diện chỉ được lưu bằng cookie của trang sau khi bạn cho phép cookie tùy chọn. Chọn “Chỉ cần thiết” để dùng giao diện mặc định mà không lưu các tùy chọn này.",
      cancel: "Hủy",
      save: "Lưu tùy chọn",
      red: "Đỏ",
      orange: "Cam",
      blue: "Xanh dương",
      green: "Xanh lá",
      purple: "Tím",
      languageEyebrow: "NGÔN NGỮ",
      languageTitle: "Chọn ngôn ngữ",
      languageDescription: "Chọn ngôn ngữ bạn muốn sử dụng trên Apps Installer.",
      vietnameseSubtitle: "Giao diện tiếng Việt",
      englishSubtitle: "Giao diện tiếng Anh",
      continue: "Tiếp tục",
      responsibilityEyebrow: "VUI LÒNG ĐỌC TRƯỚC KHI TIẾP TỤC",
      responsibilityTitle: "Thông báo trách nhiệm và tải xuống",
      responsibilityIntro: "Apps Installer là danh mục ứng dụng độc lập. Các nút tải xuống sẽ đưa bạn đến trang web bên ngoài; trang này không lưu trữ, chỉnh sửa hoặc chạy các tệp đó.",
      ourResponsibility: "Trách nhiệm của chúng tôi",
      our1: "Chúng tôi có trách nhiệm duy trì danh mục và trình bày tên ứng dụng, mô tả và đích tải xuống chính xác nhất trong khả năng hợp lý.",
      our2: "Chúng tôi sẽ xem xét báo cáo về mục sai, liên kết hỏng, gây hiểu lầm hoặc có nguy cơ không an toàn và thực hiện biện pháp phù hợp, bao gồm gỡ liên kết khi cần.",
      our3: "Chúng tôi sẽ xác định nguồn tải bên ngoài khi có thể và không cố ý ngụy trang liên kết bên thứ ba thành trang chính thức của nhà phát hành.",
      yourResponsibility: "Trách nhiệm của bạn khi sử dụng danh mục",
      your1: "Kiểm tra tên miền đích và bảo đảm đó là trang của nhà phát hành ứng dụng hoặc nguồn khác mà bạn tin cậy trước khi tải xuống.",
      your2: "Kiểm tra nhà phát hành, chữ ký số, phiên bản, khả năng tương thích thiết bị và điều khoản giấy phép khi có thông tin.",
      your3: "Luôn cập nhật hệ điều hành và phần mềm bảo mật. Quét tệp đã tải trước khi mở và không tắt tính năng bảo vệ chỉ để chạy tệp tải xuống.",
      your4: "Xem xét điều khoản và chính sách quyền riêng tư của trang web bên thứ ba. Các trang web và tệp bên ngoài do đơn vị tương ứng kiểm soát và có thể thay đổi mà không báo trước.",
      your5: "Không cung cấp mật khẩu, thông tin thanh toán, mã khôi phục hoặc dữ liệu nhạy cảm khác trừ khi bạn đã tự xác minh trang web và có lý do hợp lệ.",
      your6: "Sử dụng phần mềm đã tải xuống đúng pháp luật và tuân theo hướng dẫn của nhà phát hành cũng như các quy định áp dụng.",
      responsibilityNote: "Khi chọn “Tôi đã hiểu”, bạn xác nhận đã đọc thông báo này. Việc xác nhận không loại bỏ hoặc miễn trừ bất kỳ trách nhiệm nào mà pháp luật không cho phép loại trừ.",
      understand: "Tôi đã hiểu",
      searchAria: "Tìm kiếm ứng dụng",
      settingsAria: "Mở cài đặt giao diện",
      closeAria: "Đóng cài đặt",
      appCategoriesAria: "Danh mục ứng dụng",
      categoryMenuHeading: "CHỌN DANH MỤC",
      categoryAllDescription: "Hiển thị tất cả ứng dụng",
      categoryWindowsDescription: "Ứng dụng dành cho Windows",
      categorySystemDescription: "Tiện ích và công cụ hệ thống",
      accentAria: "Màu nhấn"
    }
  };

  let currentLanguage = readSavedLanguage();
  let draftLanguage = currentLanguage;
  let returnOverflow = "";
  const modal = document.getElementById("language-modal");
  const responsibilityOverlay = document.getElementById("responsibility-overlay");
  const languageSetting = document.getElementById("language-setting");
  const languageSettingPicker = document.getElementById("language-setting-picker");
  const languageSettingMenu = document.getElementById("language-setting-menu");
  const languageSettingCurrent = document.getElementById("language-setting-current");
  const continueButton = document.getElementById("language-continue");

  function readSavedLanguage() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (value === "vi" || value === "en") {
        if (localStorage.getItem(PROMPT_SEEN_KEY) !== "1") {
          localStorage.setItem(PROMPT_SEEN_KEY, "1");
        }
        return value;
      }
      return "vi";
    } catch {
      return "vi";
    }
  }

  function t(key) {
    return dictionaries[currentLanguage][key] ?? dictionaries.en[key] ?? key;
  }

  function setText(selector, key) {
    const element = document.querySelector(selector);
    if (element) element.textContent = t(key);
  }

  function setTextNode(selector, key) {
    const element = document.querySelector(selector);
    if (!element) return;
    const textNode = [...element.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
    if (textNode) textNode.nodeValue = " " + t(key);
  }

  function applyTranslations() {
    document.documentElement.lang = currentLanguage;
    const dict = dictionaries[currentLanguage];

    const search = document.getElementById("search");
    if (search) {
      search.placeholder = dict.search;
      search.setAttribute("aria-label", dict.searchAria);
    }

    const settingsButton = document.getElementById("settings-button");
    if (settingsButton) {
      settingsButton.title = dict.settingsAria;
      settingsButton.setAttribute("aria-label", dict.settingsAria);
    }

    const categoryMenu = document.getElementById("category-menu");
    if (categoryMenu) categoryMenu.setAttribute("aria-label", dict.appCategoriesAria);
    const categoryNames = {
      all: "all",
      "windows-package": "windowsPackage",
      "system-package": "systemPackage"
    };
    Object.entries(categoryNames).forEach(([category, key]) => {
      const label = document.querySelector('[data-category-name="' + category + '"]');
      if (label) label.textContent = dict[key];
    });
    const activeCategoryOption = document.querySelector('.category-option[aria-checked="true"]');
    const categoryTriggerLabel = document.getElementById("category-trigger-label");
    if (activeCategoryOption && categoryTriggerLabel) {
      categoryTriggerLabel.textContent = activeCategoryOption.querySelector("[data-category-name]")?.textContent || dict.all;
    }
    setText("#category-menu-heading", "categoryMenuHeading");
    setText("#category-all-description", "categoryAllDescription");
    setText("#category-windows-description", "categoryWindowsDescription");
    setText("#category-system-description", "categorySystemDescription");

    setTextNode(".hero-eyebrow", "heroEyebrow");
    const heroTitle = document.querySelector(".hero h1");
    if (heroTitle) {
      const firstLine = [...heroTitle.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
      const secondLine = heroTitle.querySelector("span");
      if (firstLine) firstLine.nodeValue = dict.heroFirst;
      if (secondLine) secondLine.textContent = dict.heroSecond;
    }
    setText(".hero-content > p", "heroDescription");
    setTextNode(".hero-tags span:first-child", "curated");
    setTextNode(".hero-tags span:last-child", "transparent");
    const loadingState = document.querySelector("#apps .empty");
    if (loadingState) {
      const loadingTitle = loadingState.querySelector("strong");
      if (loadingTitle) loadingTitle.textContent = dict.loading;
      const loadingText = [...loadingState.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
      if (loadingText) loadingText.nodeValue = dict.pleaseWait;
    }
    setText(".section-eyebrow", "browse");
    const selectedCategory = document.querySelector('.category-option[aria-checked="true"]')?.dataset.category || "all";
    setText("#category-title", categoryNames[selectedCategory] || "all");
    setText(".disclosure-copy > strong", "disclosureTitle");
    setText(".disclosure-copy > span", "disclosureBody");
    setText(".footer-copy", "footerDescription");
    setTextNode("#open-responsibility", "footerNotice");

    setText("#cookie-banner .cookie-copy strong", "cookieTitle");
    setText("#cookie-banner .cookie-copy p", "cookieText");
    setText("[data-cookie-action='reject']", "onlyNecessary");
    setText("[data-cookie-action='customize']", "customize");
    setText("[data-cookie-action='accept']", "allowPreferences");
    const cookieBanner = document.getElementById("cookie-banner");
    if (cookieBanner) cookieBanner.setAttribute("aria-label", dict.cookieTitle);

    setText("#settings-title", "settingsTitle");
    setText("#settings-modal .dialog-heading p", "settingsDescription");
    const labels = document.querySelectorAll("#settings-modal .setting-label");
    if (labels[0]) labels[0].textContent = dict.theme;
    if (labels[1]) labels[1].textContent = dict.accentColor;
    if (labels[2]) labels[2].textContent = dict.language;
    document.querySelectorAll("[data-theme-value]").forEach(button => {
      button.textContent = dict[button.dataset.themeValue];
    });
    const colorKeys = {
      "#f44336": "red",
      "#ff7043": "orange",
      "#3b82f6": "blue",
      "#16a34a": "green",
      "#8b5cf6": "purple"
    };
    document.querySelectorAll("[data-accent-value]").forEach(button => {
      const label = button.querySelector("span:nth-child(2)");
      if (label) label.textContent = dict[colorKeys[button.dataset.accentValue]];
    });
    const accentCurrent = document.getElementById("accent-current-label");
    const selectedAccent = document.querySelector("[data-accent-value][aria-selected='true']");
    if (accentCurrent && selectedAccent) {
      accentCurrent.textContent = selectedAccent.querySelector("span:nth-child(2)")?.textContent || "";
    }
    const accentMenu = document.getElementById("accent-menu");
    if (accentMenu) accentMenu.setAttribute("aria-label", dict.accentAria);
    setText(".settings-note", "settingsNote");
    setText("#settings-cancel", "cancel");
    setText("#settings-save", "save");
    const closeSettings = document.getElementById("settings-close");
    if (closeSettings) closeSettings.setAttribute("aria-label", dict.closeAria);

    setText(".responsibility-eyebrow", "responsibilityEyebrow");
    setText("#responsibility-title", "responsibilityTitle");
    setText("#responsibility-intro", "responsibilityIntro");
    const responsibilityHeadings = document.querySelectorAll(".responsibility-section h3");
    if (responsibilityHeadings[0]) responsibilityHeadings[0].textContent = dict.ourResponsibility;
    if (responsibilityHeadings[1]) responsibilityHeadings[1].textContent = dict.yourResponsibility;
    document.querySelectorAll(".responsibility-section ul").forEach((list, listIndex) => {
      const keys = listIndex === 0 ? ["our1", "our2", "our3"] : ["your1", "your2", "your3", "your4", "your5", "your6"];
      [...list.querySelectorAll("li")].forEach((item, index) => {
        if (keys[index]) item.textContent = dict[keys[index]];
      });
    });
    setText(".responsibility-note", "responsibilityNote");
    setText("#responsibility-ack", "understand");

    setText("#language-eyebrow", "languageEyebrow");
    setText("#language-title", "languageTitle");
    setText("#language-description", "languageDescription");
    setText("#language-continue", "continue");
    setText(".language-choice[data-language-choice='vi'] .language-choice-copy small", "vietnameseSubtitle");
    setText(".language-choice[data-language-choice='en'] .language-choice-copy small", "englishSubtitle");

    if (languageSetting && languageSettingCurrent) {
      languageSettingCurrent.textContent = currentLanguage === "vi" ? "Tiếng Việt" : "English";
      setLanguageSettingMenu(false);
    }
    document.querySelectorAll("[data-language-setting-value]").forEach(option => {
      option.setAttribute("aria-selected", String(option.dataset.languageSettingValue === currentLanguage));
    });
    if (languageSettingMenu) languageSettingMenu.setAttribute("aria-label", dict.language);
    document.title = currentLanguage === "vi" ? "Apps Installer – Khám phá ứng dụng" : "Apps Installer – Discover Applications";
  }

  function setLanguage(language) {
    if (language !== "vi" && language !== "en") return;
    currentLanguage = language;
    try { localStorage.setItem(STORAGE_KEY, language); } catch {}
    applyTranslations();
    window.dispatchEvent(new CustomEvent("apps-installer:language-changed", { detail: { language } }));
  }

  function updateChoiceButtons() {
    if (!modal) return;
    modal.querySelectorAll("[data-language-choice]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.languageChoice === draftLanguage));
    });
  }

  function hasSeenLanguagePrompt() {
    try { return localStorage.getItem(PROMPT_SEEN_KEY) === "1"; }
    catch { return false; }
  }

  function openLanguagePicker() {
    if (!modal || !modal.hidden || hasSeenLanguagePrompt()) return;
    draftLanguage = currentLanguage;
    updateChoiceButtons();
    returnOverflow = document.body.style.overflow;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector("[data-language-choice='" + draftLanguage + "']")?.focus();
  }

  function closeLanguagePicker() {
    if (!modal) return;
    setLanguage(draftLanguage);
    try { localStorage.setItem(PROMPT_SEEN_KEY, "1"); } catch {}
    modal.hidden = true;
    document.body.style.overflow = returnOverflow;
  }

  if (modal) {
    modal.querySelectorAll("[data-language-choice]").forEach(button => {
      button.addEventListener("click", () => {
        draftLanguage = button.dataset.languageChoice;
        updateChoiceButtons();
      });
    });

    continueButton?.addEventListener("click", closeLanguagePicker);

    modal.addEventListener("keydown", event => {
      if (event.key !== "Tab") return;
      const controls = [...modal.querySelectorAll("button")];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function setLanguageSettingMenu(open) {
    if (!languageSettingMenu || !languageSetting) return;
    if (open) {
      window.AppPopup?.open(languageSettingMenu, languageSetting);
      if (!window.AppPopup) languageSettingMenu.hidden = false;
    } else {
      window.AppPopup?.close(languageSettingMenu);
      if (!window.AppPopup) languageSettingMenu.hidden = true;
    }
    languageSetting.setAttribute("aria-expanded", String(open));
  }

  languageSetting?.addEventListener("click", () => {
    setLanguageSettingMenu(languageSettingMenu.hidden);
  });

  languageSettingMenu?.querySelectorAll("[data-language-setting-value]").forEach(option => {
    option.addEventListener("click", () => {
      setLanguage(option.dataset.languageSettingValue);
      setLanguageSettingMenu(false);
      languageSetting.focus();
    });
  });

  document.addEventListener("click", event => {
    if (languageSettingPicker &&
        !languageSettingPicker.contains(event.target) &&
        !languageSettingMenu?.contains(event.target)) {
      setLanguageSettingMenu(false);
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && languageSettingMenu && !languageSettingMenu.hidden) {
      setLanguageSettingMenu(false);
      languageSetting?.focus();
    }
  });

  window.APP_LANG = {
    get language() { return currentLanguage; },
    t,
    setLanguage,
    applyTranslations,
    openLanguagePicker,
    closeLanguageSettingMenu: () => setLanguageSettingMenu(false)
  };

  applyTranslations();
  window.addEventListener("apps-installer:responsibility-closed", openLanguagePicker);

  function onSecurityPassed() {
    if (!responsibilityOverlay || responsibilityOverlay.hidden) openLanguagePicker();
  }

  window.addEventListener("apps-installer:security-passed", onSecurityPassed, { once: true });

  if (
    document.body.dataset.securityPassed === "true" &&
    (!responsibilityOverlay || responsibilityOverlay.hidden)
  ) {
    onSecurityPassed();
  }
})();