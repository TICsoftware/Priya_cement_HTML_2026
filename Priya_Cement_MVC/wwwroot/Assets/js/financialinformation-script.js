document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  if (typeof gsap.registerPlugin === "function") gsap.registerPlugin(ScrollTrigger);

  function getColCount() {
    const w = window.innerWidth;
    if (w > 991) return 4;
    if (w > 575) return 2;
    return 1;
  }

  document.querySelectorAll(".fi-card-grid").forEach((grid) => {
    const cards = gsap.utils.toArray(
      grid.querySelectorAll(".fi-report-card, .fi-mgt-card")
    );
    if (!cards.length) return;

    grid.classList.add("is-rise-anim");

    cards.forEach((card, i) => {
      const col = i % getColCount();
      const fromY = 60 * (i + 1);

      gsap.fromTo(
        card,
        { y: fromY, autoAlpha: 0, force3D: true },
        {
          y: 0,
          autoAlpha: 1,
          ease: "none",
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
});
