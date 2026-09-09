(function () {
  const TRIGGER_SELECTOR = "[data-video-src]";
  const FILE_VIDEO_RE = /\.(mp4|webm|ogg|ogv|m4v)(\?|#|$)/i;

  let modal;
  let frame;
  let lastTrigger = null;
  let isOpen = false;

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function getYouTubeId(url) {
    if (!url) return "";

    try {
      const parsed = new URL(url, window.location.origin);
      const host = parsed.hostname.replace(/^www\./, "");

      if (host === "youtu.be") {
        return parsed.pathname.split("/").filter(Boolean)[0] || "";
      }

      if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
        const fromQuery = parsed.searchParams.get("v");
        if (fromQuery) return fromQuery;

        const parts = parsed.pathname.split("/").filter(Boolean);
        if (parts.length >= 2 && ["embed", "shorts", "live", "v"].indexOf(parts[0]) !== -1) {
          return parts[1];
        }
      }
    } catch (err) {
      return "";
    }

    return "";
  }

  function resolveType(src) {
    if (FILE_VIDEO_RE.test(src)) return "file";
    if (getYouTubeId(src)) return "youtube";
    return "";
  }

  function getSrc(trigger) {
    return (trigger.getAttribute("data-video-src") || "").trim();
  }

  function ensureModal() {
    if (modal) return modal;

    modal = document.createElement("div");
    modal.className = "video-modal";
    modal.id = "videoModal";
    modal.setAttribute("hidden", "");
    modal.innerHTML =
      '<div class="video-modal-backdrop" data-video-modal-close></div>' +
      '<div class="video-modal-dialog" role="dialog" aria-modal="true" aria-label="Video player">' +
      '<button type="button" class="video-modal-close" data-video-modal-close aria-label="Close video">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      "</svg>" +
      "</button>" +
      '<div class="video-modal-frame"></div>' +
      "</div>";

    document.body.appendChild(modal);
    frame = modal.querySelector(".video-modal-frame");

    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-video-modal-close]")) closeModal();
    });

    return modal;
  }

  function setScrollLock(locked) {
    document.documentElement.classList.toggle("video-modal-open", locked);
    document.body.classList.toggle("video-modal-open", locked);

    if (window.lenis && typeof window.lenis.stop === "function" && typeof window.lenis.start === "function") {
      if (locked) window.lenis.stop();
      else window.lenis.start();
    }
  }

  function clearPlayer() {
    if (!frame) return;
    const video = frame.querySelector("video");
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    frame.innerHTML = "";
  }

  function openModal(trigger) {
    const src = getSrc(trigger);
    if (!src) return;

    const kind = resolveType(src);
    ensureModal();

    let playerHtml = "";

    if (kind === "file") {
      const safeSrc = src.replace(/"/g, "&quot;");
      playerHtml =
        '<video class="video-modal-el" controls autoplay playsinline>' +
        '<source src="' + safeSrc + '" type="video/mp4">' +
        "</video>";
    } else if (kind === "youtube") {
      const id = getYouTubeId(src);
      if (!id) return;
      playerHtml =
        '<iframe class="video-modal-el" src="https://www.youtube.com/embed/' +
        encodeURIComponent(id) +
        '?autoplay=1&rel=0" title="YouTube video player" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    } else {
      return;
    }

    lastTrigger = trigger;
    isOpen = true;
    clearPlayer();
    frame.innerHTML = playerHtml;
    modal.removeAttribute("hidden");
    modal.classList.add("is-open");
    setScrollLock(true);

    const closeBtn = modal.querySelector(".video-modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!isOpen || !modal) return;

    isOpen = false;
    clearPlayer();
    modal.classList.remove("is-open");
    modal.setAttribute("hidden", "");
    setScrollLock(false);

    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
    lastTrigger = null;
  }

  ready(function () {
    document.addEventListener("click", function (e) {
      const trigger = e.target.closest(TRIGGER_SELECTOR);
      if (!trigger) return;

      e.preventDefault();
      if (isOpen) return;
      openModal(trigger);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  });
})();
