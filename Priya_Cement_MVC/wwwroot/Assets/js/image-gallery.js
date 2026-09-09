(function () {
  const GALLERY_SELECTOR = "[data-gallery]";
  const ITEM_SELECTOR = ".image-gallery-card";
  const TRANSITION_MS = 450;
  const OPEN_MS = 400;

  let modal;
  let stageImgs = [];
  let activeSlot = 0;
  let countEl;
  let lastTrigger = null;
  let isOpen = false;
  let items = [];
  let index = 0;
  let animTimer = null;
  let closeTimer = null;

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function getItemSrc(el) {
    return (el.getAttribute("data-gallery-src") || el.getAttribute("href") || "").trim();
  }

  function getItemAlt(el) {
    const img = el.querySelector("img");
    return (el.getAttribute("aria-label") || (img && img.getAttribute("alt")) || "Gallery image").trim();
  }

  function collectItems(gallery) {
    return Array.prototype.slice.call(gallery.querySelectorAll(ITEM_SELECTOR)).filter(function (el) {
      const src = getItemSrc(el);
      return src && src !== "#";
    });
  }

  function directionTo(from, to, total) {
    if (from === to) return 1;
    const forward = (to - from + total) % total;
    const backward = (from - to + total) % total;
    return forward <= backward ? 1 : -1;
  }

  function ensureModal() {
    if (modal) return modal;

    modal = document.createElement("div");
    modal.className = "image-gallery-modal";
    modal.id = "imageGalleryModal";
    modal.setAttribute("hidden", "");
    modal.innerHTML =
      '<div class="image-gallery-backdrop" data-gallery-close></div>' +
      '<button type="button" class="image-gallery-close" data-gallery-close aria-label="Close gallery">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      "</button>" +
      '<button type="button" class="image-gallery-nav image-gallery-prev" data-gallery-prev aria-label="Previous image">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</button>" +
      '<button type="button" class="image-gallery-nav image-gallery-next" data-gallery-next aria-label="Next image">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</button>" +
      '<div class="image-gallery-dialog" role="dialog" aria-modal="true" aria-label="Image gallery">' +
      '<div class="image-gallery-stage">' +
      '<img alt="">' +
      '<img alt="">' +
      "</div>" +
      '<div class="image-gallery-footer">' +
      '<p class="image-gallery-count" aria-live="polite"></p>' +
      "</div>" +
      "</div>";

    document.body.appendChild(modal);
    stageImgs = Array.prototype.slice.call(modal.querySelectorAll(".image-gallery-stage img"));
    countEl = modal.querySelector(".image-gallery-count");
    activeSlot = 0;

    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-gallery-close]")) closeModal();
      else if (e.target.closest("[data-gallery-prev]")) showAt(index - 1, -1);
      else if (e.target.closest("[data-gallery-next]")) showAt(index + 1, 1);
    });

    return modal;
  }

  function setScrollLock(locked) {
    document.documentElement.classList.toggle("image-gallery-open", locked);
    document.body.classList.toggle("image-gallery-open", locked);

    if (window.lenis && typeof window.lenis.stop === "function" && typeof window.lenis.start === "function") {
      if (locked) window.lenis.stop();
      else window.lenis.start();
    }
  }

  function updatePager() {
    countEl.textContent = index + 1 + " / " + items.length;
  }

  function resetImgClasses(img) {
    img.classList.remove("is-active", "is-from-next", "is-from-prev", "is-to-next", "is-to-prev");
  }

  function preloadAround(current) {
    [current + 1, current - 1].forEach(function (i) {
      const item = items[(i + items.length) % items.length];
      if (!item) return;
      const pre = new Image();
      pre.src = getItemSrc(item);
    });
  }

  function showAt(nextIndex, dir, instant) {
    if (!items.length) return;

    const wrapped = (nextIndex + items.length) % items.length;
    if (!instant && wrapped === index && stageImgs[activeSlot] && stageImgs[activeSlot].getAttribute("src")) return;

    if (dir == null) dir = directionTo(index, wrapped, items.length);
    index = wrapped;
    updatePager();

    const item = items[index];
    const src = getItemSrc(item);
    const alt = getItemAlt(item);
    const incomingSlot = instant || !stageImgs[activeSlot].getAttribute("src") ? activeSlot : 1 - activeSlot;
    const incoming = stageImgs[incomingSlot];
    const outgoing = stageImgs[activeSlot];

    incoming.src = src;
    incoming.alt = alt;
    preloadAround(index);

    if (instant || incomingSlot === activeSlot || prefersReducedMotion()) {
      stageImgs.forEach(resetImgClasses);
      incoming.classList.add("is-active");
      activeSlot = incomingSlot;
      return;
    }

    clearTimeout(animTimer);
    resetImgClasses(incoming);
    incoming.classList.add(dir === 1 ? "is-from-next" : "is-from-prev");
    incoming.offsetWidth;
    incoming.classList.add("is-active");
    incoming.classList.remove("is-from-next", "is-from-prev");

    outgoing.classList.remove("is-from-next", "is-from-prev");
    outgoing.classList.add(dir === 1 ? "is-to-prev" : "is-to-next");
    outgoing.classList.remove("is-active");

    activeSlot = incomingSlot;
    animTimer = setTimeout(function () {
      resetImgClasses(outgoing);
    }, TRANSITION_MS);
  }

  function openModal(gallery, trigger) {
    items = collectItems(gallery);
    if (!items.length) return;

    const start = items.indexOf(trigger);
    index = start >= 0 ? start : 0;

    ensureModal();
    clearTimeout(closeTimer);
    showAt(index, 0, true);

    lastTrigger = trigger;
    isOpen = true;
    modal.removeAttribute("hidden");
    setScrollLock(true);

    if (prefersReducedMotion()) {
      modal.classList.add("is-open");
    } else {
      modal.classList.remove("is-open");
      modal.offsetWidth;
      requestAnimationFrame(function () {
        modal.classList.add("is-open");
      });
    }

    const closeBtn = modal.querySelector(".image-gallery-close");
    if (closeBtn) closeBtn.focus();
  }

  function finishClose() {
    if (isOpen || !modal) return;

    modal.setAttribute("hidden", "");
    clearTimeout(animTimer);
    stageImgs.forEach(function (img) {
      resetImgClasses(img);
      img.removeAttribute("src");
      img.alt = "";
    });
    activeSlot = 0;
    items = [];
  }

  function closeModal() {
    if (!isOpen || !modal) return;

    isOpen = false;
    modal.classList.remove("is-open");
    setScrollLock(false);
    clearTimeout(closeTimer);

    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
    lastTrigger = null;

    if (prefersReducedMotion()) {
      finishClose();
    } else {
      closeTimer = setTimeout(finishClose, OPEN_MS);
    }
  }

  ready(function () {
    document.addEventListener("click", function (e) {
      const trigger = e.target.closest(ITEM_SELECTOR);
      if (!trigger) return;

      const gallery = trigger.closest(GALLERY_SELECTOR);
      if (!gallery) return;

      e.preventDefault();
      if (isOpen) {
        showAt(collectItems(gallery).indexOf(trigger));
        return;
      }
      openModal(gallery, trigger);
    });

    document.addEventListener("keydown", function (e) {
      if (!isOpen) return;
      if (e.key === "Escape") closeModal();
      else if (e.key === "ArrowLeft") showAt(index - 1, -1);
      else if (e.key === "ArrowRight") showAt(index + 1, 1);
    });
  });
})();
