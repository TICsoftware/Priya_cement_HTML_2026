document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  if (typeof gsap.registerPlugin === "function") gsap.registerPlugin(ScrollTrigger);

  function getColCount(grid) {
    const w = window.innerWidth;
    if (w <= 767) return 1;
    if (w <= 991) return 2;
    if (w <= 1199) return 3;
    if (w <= 1366 || (grid && grid.classList.contains("image-gallery-4"))) return 4;
    return 5;
  }

  document.querySelectorAll(".image-gallery").forEach((grid) => {
    const cards = gsap.utils.toArray(grid.querySelectorAll(".image-gallery-card"));
    if (!cards.length) return;

    grid.classList.add("is-rise-anim");

    cards.forEach((card, i) => {
      const col = i % getColCount(grid);
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
