document.addEventListener("DOMContentLoaded", () => {

  // Prevent flash of unstyled content before ScrollTrigger fires
  gsap.set(".gallery-center", { scale: 0.65, rotate: 0, opacity: 0 });
  gsap.set(".gallery-left", { x: -200, y: 80, rotate: -35, opacity: 0 });
  gsap.set(".gallery-right", { x: 200, y: 80, rotate: 35, opacity: 0 });

  gsap.set(".story-gallery-left", { x: -150, opacity: 0, rotate: -15 });
  gsap.set(".story-turmuric", { x: 150, y: -50, opacity: 0, rotate: 20 });
  gsap.set(".story-leaf", { x: 100, y: 60, opacity: 0, rotate: -20 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".story-gallery",
      start: "top 50%",
      toggleActions: "play none none reverse",
    }
  });

  tl.to(".gallery-center", {
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: "power4.out"
    })
    .to(".gallery-left", {
      x: 0,
      y: 0,
      rotate: -8,
      opacity: 1,
      duration: 1,
      ease: "power4.out"
    }, "-=0.7")
    .to(".gallery-right", {
      x: 0,
      y: 0,
      rotate: 8,
      opacity: 1,
      duration: 1,
      ease: "power4.out"
    }, "-=1")
    // Decorative elements animate in after the cards
    .to(".story-gallery-left", {
      x: 0,
      opacity: 1,
      rotate: 0,
      duration: 0.9,
      ease: "power3.out"
    }, "-=0.4")
    .to(".story-turmuric", {
      x: 0,
      y: 0,
      opacity: 1,
      rotate: 0,
      duration: 0.9,
      ease: "power3.out"
    }, "-=0.6")
    .to(".story-leaf", {
      x: 0,
      y: 0,
      opacity: 1,
      rotate: 0,
      duration: 0.9,
      ease: "power3.out"
    }, "-=0.7");

});