(() => {
  const slot = document.getElementById("ad-slot");
  if (!slot) return;

  function safeUrl(value) {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const url = new URL(value, location.href);
      return ["https:", "http:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  async function loadAd() {
    try {
      const response = await fetch("./ad.json", { cache: "no-store" });
      if (!response.ok) return;
      const ad = await response.json();
      if (!ad || ad.enabled !== true) return;

      const titleText = typeof ad.title === "string" ? ad.title.trim() : "";
      const descriptionText = typeof ad.description === "string" ? ad.description.trim() : "";
      const imageUrl = safeUrl(ad.image);
      const targetUrl = safeUrl(ad.url);
      if (!titleText && !descriptionText && !imageUrl) return;

      const card = document.createElement("div");
      card.className = "ad-card";

      const badge = document.createElement("span");
      badge.className = "ad-badge";
      badge.textContent = typeof ad.badge === "string" && ad.badge.trim() ? ad.badge.trim() : "Ad";

      if (imageUrl) {
        const image = document.createElement("img");
        image.className = "ad-image";
        image.src = imageUrl;
        image.alt = "";
        image.loading = "lazy";
        card.append(image);
      }

      const content = document.createElement("div");
      content.className = "ad-content";
      const title = document.createElement("div");
      title.className = "ad-title";
      title.textContent = titleText || "Featured";
      content.append(title);

      if (descriptionText) {
        const description = document.createElement("p");
        description.className = "ad-description";
        description.textContent = descriptionText;
        content.append(description);
      }

      if (targetUrl) {
        const cta = document.createElement("span");
        cta.className = "ad-cta";
        cta.textContent = typeof ad.button === "string" && ad.button.trim() ? ad.button.trim() : "Learn more";
        content.append(cta);
      }

      card.append(content, badge);

      if (targetUrl) {
        const link = document.createElement("a");
        link.className = "ad-link";
        link.href = targetUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", "Open " + (titleText || "advertisement"));
        card.append(link);
      }

      slot.replaceChildren(card);
      slot.hidden = false;
    } catch {}
  }

  loadAd();
})();
