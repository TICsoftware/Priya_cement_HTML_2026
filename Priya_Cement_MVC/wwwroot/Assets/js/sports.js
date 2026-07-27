// right side image animation
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
   const section = document.querySelector('.sce-section');
   if (!section) return;

   const photo = section.querySelector('[data-sce-photo]');
   if (!photo) return;

   gsap.set(photo, {
      opacity: 0,
      x: 150,       // starts off to the right
      rotation: 0
   });

   gsap.to(photo, {
      opacity: 1,
      x: 0,
      rotation: -5,   // settles into its tilted resting angle
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
         trigger: section,
         start: 'top 70%',
         end: 'bottom 20%',
         toggleActions: 'restart none none reverse',
         invalidateOnRefresh: true
         // markers: true, // uncomment to debug the trigger lines while testing
      }
   });

   ScrollTrigger.refresh();
});