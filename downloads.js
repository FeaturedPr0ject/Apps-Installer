(() => {
  const STORAGE_KEY = "gi_download_history_v1";
  const navButtons = [...document.querySelectorAll("[data-view]")];
  const gamesView = document.getElementById("games-view");
  const downloadsView = document.getElementById("downloads-view");
  const searchBox = document.querySelector(".search");
  const items = document.getElementById("download-items");
  const badge = document.getElementById("download-badge");
  const clearButton = document.getElementById("clear-downloads");

  if (!gamesView || !downloadsView || !items || !badge) return;

  function safeUrl(value) {
    try {
      const url = new URL(value, location.href);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  function loadHistory() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(saved)) return [];
      return saved.filter(item =>
        item &&
        typeof item.name === "string" &&
        typeof item.url === "string" &&
        safeUrl(item.url)
      ).slice(0, 40);
    } catch {
      return [];
    }
  }

  let history = loadHistory();

  function saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      showStorageNotice();
    }
    updateBadge();
  }

  function updateBadge() {
    badge.textContent = String(history.length);
    badge.hidden = history.length === 0;
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently opened";
    return date.toLocaleString();
  }

  function makeEmpty() {
    const empty = document.createElement("div");
    empty.className = "empty";
    const title = document.createElement("strong");
    title.textContent = "No downloads yet";
    empty.append(title, document.createTextNode("Choose a game and press Download."));
    return empty;
  }

  function renderHistory() {
    items.replaceChildren();
    updateBadge();
    if (!history.length) {
      items.append(makeEmpty());
      return;
    }

    const container = document.createElement("div");
    container.className = "download-history-list";

    history.forEach((entry, index) => {
      const row = document.createElement("article");
      row.className = "download-history-item";

      const logo = document.createElement("img");
      logo.className = "download-history-logo";
      logo.alt = "";
      logo.loading = "lazy";
      logo.src = safeUrl(entry.image) || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='54' height='54'%3E%3Crect width='100%25' height='100%25' rx='12' fill='%23888888' fill-opacity='.12'/%3E%3C/svg%3E";

      const info = document.createElement("div");
      info.className = "download-history-info";
      const name = document.createElement("h3");
      name.className = "download-history-name";
      name.textContent = entry.name;
      const meta = document.createElement("p");
      meta.className = "download-history-meta";
      meta.textContent = "Link opened · " + formatDate(entry.openedAt);
      info.append(name, meta);

      const actions = document.createElement("div");
      actions.className = "download-history-actions";
      const again = document.createElement("a");
      again.className = "download-again";
      again.href = safeUrl(entry.url);
      again.target = "_blank";
      again.rel = "noopener noreferrer";
      again.textContent = "Download again";
      again.dataset.downloadName = entry.name;
      again.dataset.downloadImage = safeUrl(entry.image);
      const remove = document.createElement("button");
      remove.className = "remove-download";
      remove.type = "button";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => {
        history.splice(index, 1);
        saveHistory();
        renderHistory();
      });
      actions.append(again, remove);
      row.append(logo, info, actions);
      container.append(row);
    });

    items.append(container);
  }

  function addHistory(link) {
    const url = safeUrl(link.href);
    if (!url) return;
    const name = link.dataset.downloadName || link.textContent.trim() || "Game download";
    const image = safeUrl(link.dataset.downloadImage || "");
    history = [
      { name, image, url, openedAt: Date.now() },
      ...history.filter(entry => !(entry.name === name && entry.url === url))
    ].slice(0, 40);
    saveHistory();
    renderHistory();
  }

  function showStorageNotice() {
    const notice = document.createElement("div");
    notice.className = "empty";
    notice.textContent = "Browser storage is unavailable. Download history may not be saved.";
    items.prepend(notice);
  }

  function showView(name) {
    const downloadsActive = name === "downloads";
    gamesView.hidden = downloadsActive;
    downloadsView.hidden = !downloadsActive;
    if (searchBox) searchBox.hidden = downloadsActive;
    navButtons.forEach(button => {
      const active = button.dataset.view === name;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (downloadsActive) renderHistory();
  }

  navButtons.forEach(button => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });

  document.addEventListener("click", event => {
    const link = event.target.closest("a.download, a.download-again");
    if (!link || link.getAttribute("aria-disabled") === "true") return;
    addHistory(link);
  });

  clearButton?.addEventListener("click", () => {
    history = [];
    saveHistory();
    renderHistory();
  });

  renderHistory();
  showView("games");
})();
