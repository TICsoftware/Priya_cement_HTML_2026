/* ---------------------------------------
   SITE PRELOADER
   Logo + progress bar + counter. On completion:
     - logo shatters into particle tiles (original dissolve look)
     - homepage header/hero fade in underneath while the loader crossfades out
     - dispatches 'homepagePreloaderDone', which homepage-script.js waits
       on before constructing the hero Swiper — that slider's own existing
       animation is untouched by this file.

   Skip: ?loader=0
   Session: after first successful loader in this tab, skip on later
   homepage navigations (About → Home). Refresh/hard refresh still shows it.
--------------------------------------- */
(function () {
  const LOADER_SEEN_KEY = 'priyaHomepageLoaderSeen';

  function whenReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function isPageReload() {
    try {
      const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
      if (nav) return nav.type === 'reload';
    } catch (e) { /* ignore */ }
    try {
      // Legacy API (Safari older): TYPE_RELOAD === 1
      return !!(performance.navigation && performance.navigation.type === 1);
    } catch (e) {
      return false;
    }
  }

  function hasSeenLoaderThisSession() {
    try {
      return sessionStorage.getItem(LOADER_SEEN_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function markLoaderSeen() {
    try {
      sessionStorage.setItem(LOADER_SEEN_KEY, '1');
    } catch (e) { /* private mode / blocked */ }
  }

  function skipLoader() {
    if (new URLSearchParams(window.location.search).get('loader') === '0') return true;
    // Explicit refresh always gets the loader again
    if (isPageReload()) return false;
    // Same-tab return from other pages → skip
    return hasSeenLoaderThisSession();
  }

  function announceDone() {
    document.dispatchEvent(new CustomEvent('homepagePreloaderDone'));
  }

  function animateHeaderIn() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    header.style.transition = 'none';
    header.style.opacity = '0';
    header.style.transform = 'translateY(-28px)';
    void header.offsetHeight;
    header.style.transition =
      'opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1), ' +
      'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)';

    requestAnimationFrame(() => {
      header.style.opacity = '1';
      header.style.transform = 'translateY(0)';
    });

    header.addEventListener(
      'transitionend',
      () => {
        header.style.transition = '';
        header.style.opacity = '';
        header.style.transform = '';
      },
      { once: true }
    );
  }

  // Hero is already fully built (Swiper initializes immediately, hidden
  // behind this backdrop) by the time this runs — this only handles how
  // it becomes visible. Starts under the fading preloader for a soft crossfade.
  function animateHeroIn() {
    const hero = document.querySelector('.hero-banner-section');
    if (!hero) return;

    hero.style.transition = 'none';
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(16px) scale(1.01)';
    hero.style.filter = 'blur(3px)';
    hero.style.willChange = 'opacity, transform, filter';
    void hero.offsetHeight;

    hero.style.transition =
      'opacity 1.15s cubic-bezier(0.22, 1, 0.36, 1), ' +
      'transform 1.15s cubic-bezier(0.22, 1, 0.36, 1), ' +
      'filter 1.15s cubic-bezier(0.22, 1, 0.36, 1)';

    requestAnimationFrame(() => {
      hero.style.opacity = '1';
      hero.style.transform = 'translateY(0) scale(1)';
      hero.style.filter = 'blur(0)';
    });

    hero.addEventListener(
      'transitionend',
      () => {
        hero.style.transition = '';
        hero.style.transitionDelay = '';
        hero.style.opacity = '';
        hero.style.transform = '';
        hero.style.filter = '';
        hero.style.willChange = '';
      },
      { once: true }
    );
  }

  // Layered on top of animateHeroIn(): once the section itself is
  // settling into focus, the active slide's title+paragraph rise up
  // into place, then its CTA fades in last. Only touches transform on
  // .slide-content itself (the wrapper, not the parallax-tagged title/
  // paragraph inside it) and opacity-only on the button — its transform
  // is already owned by Swiper's native parallax (data-swiper-parallax),
  // so this never fights it for the same property.
  function animateHeroContentIn() {
    const activeSlide = document.querySelector('.hero-swiper .swiper-slide-active');
    if (!activeSlide) return;

    const content = activeSlide.querySelector('.slide-content');
    const btnWrap = activeSlide.querySelector('.outer-hero-button');

    if (content) {
      content.style.transition = 'none';
      content.style.opacity = '0';
      content.style.transform = 'translateY(18px)';
      content.style.willChange = 'opacity, transform';
      void content.offsetHeight;

      content.style.transition =
        'opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.35s, ' +
        'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.35s';

      requestAnimationFrame(() => {
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
      });

      content.addEventListener(
        'transitionend',
        () => {
          content.style.transition = '';
          content.style.opacity = '';
          content.style.transform = '';
          content.style.willChange = '';
        },
        { once: true }
      );
    }

    if (btnWrap) {
      btnWrap.style.transition = 'none';
      btnWrap.style.opacity = '0';
      btnWrap.style.willChange = 'opacity';
      void btnWrap.offsetHeight;

      btnWrap.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.55s';

      requestAnimationFrame(() => {
        btnWrap.style.opacity = '1';
      });

      btnWrap.addEventListener(
        'transitionend',
        () => {
          btnWrap.style.transition = '';
          btnWrap.style.opacity = '';
          btnWrap.style.willChange = '';
        },
        { once: true }
      );
    }
  }

  function init() {
    const html = document.documentElement;
    const preloader = document.getElementById('sitePreloader');
    const fill = document.getElementById('sitePreloaderFill');
    const counter = document.getElementById('sitePreloaderCounter');
    const logoWrap = preloader && preloader.querySelector('.site-preloader__logo-wrap');
    const logo = document.getElementById('sitePreloaderLogo');

    const finishImmediate = () => {
      html.classList.remove('site-preloader-pending');
      if (preloader) preloader.remove();
      announceDone();
    };

    if (!preloader || !fill || !counter || !logoWrap || !logo) {
      finishImmediate();
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (skipLoader() || reduceMotion) {
      // No animated fill, no shatter, header snaps to place (no translate).
      finishImmediate();
      return;
    }

    html.classList.add('site-preloader-lock');
    document.getElementById('siteHeader')?.setAttribute('inert', '');
    document.getElementById('main-content')?.setAttribute('inert', '');

    function unlock() {
      html.classList.remove('site-preloader-lock');
      document.getElementById('siteHeader')?.removeAttribute('inert');
      document.getElementById('main-content')?.removeAttribute('inert');
    }

    function setProgress(n) {
      fill.style.width = n + '%';
      counter.firstChild.textContent = n;
    }

    let finished = false;
    let shatterStarted = false;
    let shatterHandle = null;
    let revealStarted = false;
    const MIN_MS = 750;
    const MAX_MS = 3500;
    const SHATTER_AT = 80; // dissolve starts once the bar reaches this
    // Gentle nudge only — hard ×6 made the dissolve look abrupt
    const FAST_TIME_SCALE = 1.35;
    let pageLoaded = document.readyState === 'complete';
    window.addEventListener('load', () => { pageLoaded = true; }, { once: true });

    const startTime = performance.now();
    let shown = 0;

    function beginPageReveal() {
      if (revealStarted) return;
      revealStarted = true;
      html.classList.remove('site-preloader-pending');
      unlock();
      markLoaderSeen();
      animateHeaderIn();
      animateHeroIn();
      animateHeroContentIn();
      announceDone();
    }

    function beginShatter() {
      if (shatterStarted) return;
      shatterStarted = true;
      shatterHandle = shatterLogo();
    }

    function finishAtFull() {
      if (finished) return;
      finished = true;

      beginShatter(); // safety net if 100% was reached without passing 80% first
      if (shatterHandle) shatterHandle.fastForward();
    }

    function tick() {
      if (finished) return;
      const elapsed = performance.now() - startTime;
      const minRatio = Math.min(1, elapsed / MIN_MS);
      // Reserve the last stretch for real load confirmation, not a guess.
      const target = pageLoaded ? 100 : Math.min(90, Math.round(minRatio * 90));
      shown += (target - shown) * 0.35;
      if (target - shown < 0.4) shown = target;
      const displayed = Math.round(shown);
      setProgress(displayed);

      if (displayed >= SHATTER_AT) {
        beginShatter();
      }

      if (displayed >= 100 || elapsed > MAX_MS) {
        setProgress(100);
        finishAtFull();
        return;
      }
      requestAnimationFrame(tick);
    }

    function shatterLogo() {
      const rect = logo.getBoundingClientRect();
      const wrapRect = logoWrap.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      // Original shatter grid — small tiles, same look as before
      const TARGET_TILE = 16;
      const cols = Math.min(40, Math.max(4, Math.round(w / TARGET_TILE)));
      const rows = Math.min(40, Math.max(4, Math.round(h / TARGET_TILE)));
      const tileW = w / cols;
      const tileH = h / rows;
      const offsetX = rect.left - wrapRect.left;
      const offsetY = rect.top - wrapRect.top;
      const src = logo.currentSrc || logo.src;

      // Same radial explosion as before
      const centerX = w / 2;
      const centerY = h / 2;
      const travelDist = Math.hypot(window.innerWidth, window.innerHeight) * 0.65;

      const tiles = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const tile = document.createElement('div');
          tile.className = 'site-preloader-tile';
          tile.style.width = tileW + 'px';
          tile.style.height = tileH + 'px';
          tile.style.left = (offsetX + c * tileW) + 'px';
          tile.style.top = (offsetY + r * tileH) + 'px';
          tile.style.backgroundImage = 'url(' + src + ')';
          tile.style.backgroundSize = w + 'px ' + h + 'px';
          tile.style.backgroundPosition = (-c * tileW) + 'px ' + (-r * tileH) + 'px';

          let vx = (c + 0.5) * tileW - centerX;
          let vy = (r + 0.5) * tileH - centerY;
          const mag = Math.hypot(vx, vy);
          if (mag < 0.01) {
            const a = Math.random() * Math.PI * 2;
            vx = Math.cos(a);
            vy = Math.sin(a);
          } else {
            vx /= mag;
            vy /= mag;
          }
          tile.dataset.dx = String(vx * travelDist);
          tile.dataset.dy = String(vy * travelDist);

          logoWrap.appendChild(tile);
          tiles.push(tile);
        }
      }
      logo.style.visibility = 'hidden';

      const progressEl = preloader.querySelector('.site-preloader__progress');

      if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
          onComplete: () => {
            if (preloader && preloader.parentNode) preloader.remove();
          },
        });

        // Original dissolve motion — only timing eased for a smoother exit
        tl.to(
          tiles,
          {
            autoAlpha: 0,
            x: (i, target) => parseFloat(target.dataset.dx) + gsap.utils.random(-20, 20),
            y: (i, target) => parseFloat(target.dataset.dy) + gsap.utils.random(-20, 20),
            rotate: () => gsap.utils.random(-45, 45),
            scale: 0.6,
            duration: 0.85,
            ease: 'power2.out',
            stagger: { amount: 0.28, from: 'random' },
          },
          0
        );

        if (progressEl) {
          tl.to(progressEl, { autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, 0);
        }

        // Homepage fades in under the loader while particles are still dissolving
        tl.call(beginPageReveal, null, 0.3);

        // Soft crossfade of the preloader backdrop
        tl.to(
          preloader,
          { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' },
          0.35
        );

        return { fastForward: () => tl.timeScale(FAST_TIME_SCALE) };
      }

      // No-GSAP fallback
      tiles.forEach((t) => {
        t.style.transition = 'opacity .7s ease, transform .7s ease';
        t.style.opacity = '0';
        t.style.transform = 'scale(0.6)';
      });
      if (progressEl) {
        progressEl.style.transition = 'opacity .5s ease';
        progressEl.style.opacity = '0';
      }
      window.setTimeout(beginPageReveal, 280);
      preloader.style.transition = 'opacity .7s ease';
      window.setTimeout(() => {
        preloader.style.opacity = '0';
      }, 320);
      let fallbackTimer = window.setTimeout(() => {
        if (preloader && preloader.parentNode) preloader.remove();
      }, 1100);
      return {
        fastForward: () => {
          window.clearTimeout(fallbackTimer);
          beginPageReveal();
          preloader.style.transition = 'opacity .45s ease';
          preloader.style.opacity = '0';
          fallbackTimer = window.setTimeout(() => {
            if (preloader && preloader.parentNode) preloader.remove();
          }, 480);
        },
      };
    }

    window.setTimeout(finishAtFull, MAX_MS + 400);
    requestAnimationFrame(tick);
  }

  whenReady(init);
})();
