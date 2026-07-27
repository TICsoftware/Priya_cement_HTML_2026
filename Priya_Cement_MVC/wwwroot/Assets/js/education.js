// First section aniamtion
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {

  const section = document.querySelector('.bc-experience-section');
  if (!section) return;

  const media = section.querySelector('.nourish-media');
  if (!media) return;

  gsap.set(media, {
    opacity: 0,
    x: -150,          // starts well off to the left
    transformOrigin: '50% 50%'
  });

  gsap.to(media, {
    opacity: 1,
    x: 0,              // travels to its resting position
    duration: 1.3,
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


gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {

  const section = document.querySelector('.cd-section');
  if (!section) return;

  const photos = gsap.utils.toArray('[data-cd="photo"]');
  const stamps = gsap.utils.toArray('[data-cd="stamp"]');

  // starting states — photos and stamps only
  photos.forEach(el => {
    const dir = el.dataset.from;
    gsap.set(el, {
      opacity: 0,
      scale: 0.85,
      x: dir === 'left' ? -120 : dir === 'right' ? 120 : 0,
      y: dir === 'bottom' ? 80 : 40,
      rotation: 0
    });
  });
  gsap.set(stamps, { opacity: 0, scale: 0.4, rotation: -25, transformOrigin: '50% 50%' });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      end: 'bottom 20%',              // required — gives ScrollTrigger a point to fire leave/enterBack from
      toggleActions: 'restart none none reverse',
      invalidateOnRefresh: true        // recalculates from/to values on resize/refresh
      // markers: true,               // uncomment to debug the trigger lines while testing
    }
  });

  tl.to('.cd-photo-1', {
      opacity: 1, scale: 1, x: 0, y: 0, rotation: -9,
      duration: 1.1, ease: 'power3.out'
    })
    .to('.cd-photo-3', {
      opacity: 1, scale: 1, x: 0, y: 0, rotation: 7,
      duration: 1.1, ease: 'power3.out'
    }, '<0.1')
    .to('.cd-photo-2', {
      opacity: 1, scale: 1, x: 0, y: 0, rotation: 6,
      duration: 1, ease: 'power3.out'
    }, '<0.15')
    .to(stamps, {
      opacity: 1, scale: 1, rotation: 0,
      duration: 0.7, ease: 'back.out(2.2)',
      stagger: 0.15
    }, '-=0.7');

  ScrollTrigger.refresh();
});