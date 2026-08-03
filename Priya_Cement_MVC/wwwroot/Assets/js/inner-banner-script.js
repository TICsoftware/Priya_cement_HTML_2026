document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const banner = document.querySelector(".inside-banner-outer");
  const image = document.querySelector(".innerbanner-image");
  const caption = document.querySelector(".innerbanner-caption");
  if (!banner || !image) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Natural size on load — zoom only happens while scrolling
  gsap.set(image, {
    scale: 1,
    yPercent: 0,
    transformOrigin: "50% 50%",
    force3D: true,
  });

  if (!reduceMotion) {
    // Scroll: soft Y parallax + gentle zoom out of the crop
    gsap.to(image, {
      yPercent: 12,
      scale: 1.12,
      ease: "none",
      force3D: true,
      scrollTrigger: {
        trigger: banner,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  // Load: caption reveal
  if (caption) {
    if (reduceMotion) {
      gsap.set(caption, { clearProps: "all" });
    } else {
      gsap.from(caption, {
        y: 80,
        opacity: 0,
        duration: 1.4,
        ease: "power4.out",
      });
    }
  }
});
