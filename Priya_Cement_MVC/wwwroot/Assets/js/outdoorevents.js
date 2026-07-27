//------------- Two left Image Intro Animation-------------- //
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {

  const section = document.querySelector('.bc-experience-section');
  if (!section) return;

  const backPhoto = section.querySelector('.nourish-photo-back');
  const frontPhoto = section.querySelector('.nourish-photo-front');
  if (!backPhoto || !frontPhoto) return;

  gsap.set(backPhoto, {
    opacity: 0,
    x: -150   // starts off to the left
  });
  gsap.set(frontPhoto, {
    opacity: 0,
    x: 150    // starts off to the right
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      end: 'bottom 20%',
      toggleActions: 'restart none none reverse',
      invalidateOnRefresh: true
      // markers: true, // uncomment to debug the trigger lines while testing
    }
  });

  tl.to(backPhoto, {
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: 'power3.out'
    })
    .to(frontPhoto, {
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, '<0.15'); // starts 0.15s after back photo begins, so they arrive close together but not simultaneously

  ScrollTrigger.refresh();
});

//------------- Two left Image Intro Animation-------------- //




gsap.registerPlugin(ScrollTrigger);

function buildCurvePath(curveHeight, flatY, width, totalHeight){
   const halfW = width / 2;
   if (curveHeight <= 0.5){
      return `M0,${flatY} L${width},${flatY} L${width},${totalHeight} L0,${totalHeight} Z`;
   }
   const radius = (curveHeight / 2) + (halfW * halfW) / (2 * curveHeight);
   return `M0,${flatY} A${radius},${radius} 0 0,1 ${width},${flatY} L${width},${totalHeight} L0,${totalHeight} Z`;
}

window.addEventListener('load', () => {

   const wrap = document.querySelector('.curveSvg-bg');
   const bgPath = document.querySelector('.curvePath');
   const clipPath = document.querySelector('.curveClipPath');
   if (!wrap || !bgPath) return;

   const maxCurve = parseFloat(bgPath.dataset.maxCurve) || 140;
   const flatY = 144;
   const width = 1000;
   const totalHeight = 400;

   const state = { curve: 0 };

   const applyCurve = (val) => {
      const d = buildCurvePath(val, flatY, width, totalHeight);
      bgPath.setAttribute('d', d);
      if (clipPath) clipPath.setAttribute('d', d);
   };

   applyCurve(0); // start flat/straight

   gsap.to(state, {
      curve: maxCurve,
      duration: 1.3,
      ease: 'power3.inOut',
      onUpdate: () => applyCurve(state.curve),
      scrollTrigger: {
         trigger: wrap.closest('section'),
         start: 'top 70%',
         end: 'bottom 20%',
         toggleActions: 'restart none none reverse',
         invalidateOnRefresh: true
         // markers: true, // uncomment to debug the trigger lines while testing
      }
   });
});


// ==================== OUTDOOR CATERING EXCELLENCE — SCROLL ANIMATIONS ====================
// Requires GSAP + ScrollTrigger to already be loaded on the page before this file.

(function () {
   const section = document.querySelector(".bc-catering-section");
   if (!section || typeof gsap === "undefined") return;

   gsap.registerPlugin(ScrollTrigger);

   const fork = section.querySelector(".bc-catering-deco--fork");
   const tomato = section.querySelector(".bc-catering-deco--tomato");
   const dome = section.querySelector(".bc-catering-dome");

   const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

   if (prefersReducedMotion) return;

   const tl = gsap.timeline({
      scrollTrigger: {
         trigger: section,
         start: "top 75%",
         end: "top 30%",
         scrub: false,
         toggleActions: "play none none reverse"
      }
   });

   // Dome reveal — scales up from the bottom like it's rising into place
   if (dome) {
      gsap.set(dome, { transformOrigin: "50% 100%", scaleY: 0.6, scaleX: 0.92, opacity: 0 });
      tl.to(dome, {
         scaleY: 1,
         scaleX: 1,
         opacity: 1,
         duration: 1,
         ease: "power3.out"
      }, 0);
   }

   // Fork slides in from the left
   if (fork) {
      gsap.set(fork, { x: -120, opacity: 0 });
      tl.to(fork, {
         x: 0,
         opacity: 1,
         duration: 0.7,
         ease: "power3.out"
      }, 0.15);
   }

   // Tomato splatter slides in from the right
   if (tomato) {
      gsap.set(tomato, { x: 120, opacity: 0 });
      tl.to(tomato, {
         x: 0,
         opacity: 1,
         duration: 0.7,
         ease: "power3.out"
      }, 0.15);
   }
})();
