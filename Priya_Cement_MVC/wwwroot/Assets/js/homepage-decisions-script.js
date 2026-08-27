/* ---------------------------------------
   HOME — decisions / buildbegins section
--------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.home-decisions-section');
  if (!section) return;

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  if (typeof gsap.registerPlugin === 'function') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const intro = section.querySelector('[data-home-decisions-intro]');
  const grid = section.querySelector('[data-home-decisions-grid]');
  const cards = grid
    ? gsap.utils.toArray(grid.querySelectorAll('[data-home-decisions-card]'))
    : [];

  /* Intro — one-shot enter */
  if (!reduceMotion && intro) {
    gsap.fromTo(
      intro,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        },
      }
    );
  }

  /* Cards — Contact / FI scrub rise */
  if (!grid || !cards.length) return;

  if (reduceMotion) {
    gsap.set(cards, { clearProps: 'transform,opacity' });
    return;
  }

  grid.classList.add('is-rise-anim');

  function getColCount() {
    return window.innerWidth >= 768 ? 3 : 1;
  }

  cards.forEach((card, i) => {
    const col = i % getColCount();
    const fromY = 60 * (i + 1);

    gsap.fromTo(
      card,
      { y: fromY, autoAlpha: 0, force3D: true },
      {
        y: 0,
        autoAlpha: 1,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: card,
          start: `top ${90 - col * 4}%`,
          end: `top ${58 - col * 3}%`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      }
    );
  });
});
