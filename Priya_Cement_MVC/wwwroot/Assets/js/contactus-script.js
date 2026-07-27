gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  initCuFormLeaves();
  initCuEnquiryPlates();
  initSolutionsMedia();
});

function initCuFormLeaves() {
  const rightLeaf = document.querySelector(".cu-leaf-right");
  const leftLeaf = document.querySelector(".cu-leaf-left");

  if (!rightLeaf || !leftLeaf) return;

  gsap.set([rightLeaf, leftLeaf], {
    opacity: 0,
    scale: 0.6
  });

  function revealLeaves() {
    gsap.fromTo(rightLeaf,
      {
        xPercent: -35,
        yPercent: 10,
        scale: 0.6,
        opacity: 0
      },
      {
        xPercent: 0,
        yPercent: 0,
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        overwrite: true
      }
    );

    gsap.fromTo(leftLeaf,
      {
        xPercent: 35,
        yPercent: -10,
        scale: 0.6,
        opacity: 0
      },
      {
        xPercent: 0,
        yPercent: 0,
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.1,
        overwrite: true
      }
    );
  }

  ScrollTrigger.create({
    trigger: ".cu-form-section",
    start: "top 75%",
    end: "bottom 25%",
    onEnter: revealLeaves,
    onEnterBack: revealLeaves
  });
}

function initCuEnquiryPlates() {
  const section = document.querySelector(".cu-enquiry-section");
  if (!section) return;

  const circles = gsap.utils.toArray(".cu-plate-circle", section);
  const plates = gsap.utils.toArray(".cu-plate-img", section);

  if (!circles.length || !plates.length) return;

  gsap.set([...circles, ...plates], {
    transformOrigin: "50% 50%",
    force3D: true
  });

  ScrollTrigger.matchMedia({
    "(min-width: 1280px)": () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "bottom 25%",
          scrub: 1.5,
          invalidateOnRefresh: true
        }
      });

      tl.fromTo(
        circles,
        { rotation: -90 },
        { rotation: 90, ease: "none" },
        0
      ).fromTo(
        plates,
        { rotation: 45 },
        { rotation: -45, ease: "none" },
        0
      );
    },

    "(max-width: 1279px)": () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "bottom 20%",
          scrub: 1.2,
          invalidateOnRefresh: true
        }
      });

      tl.fromTo(
        circles,
        { rotation: -35 },
        { rotation: 35, ease: "none" },
        0
      ).fromTo(
        plates,
        { rotation: 18 },
        { rotation: -18, ease: "none" },
        0
      );
    }
  });

  ScrollTrigger.refresh();
}

function initSolutionsMedia() {
  const section = document.querySelector(".solutions-section");
  if (!section) return;

  const circle = section.querySelector(".solutions-circle");
  const salad = section.querySelector(".solutions-salad");
  const splash = section.querySelector(".solutions-splash");

  if (!circle || !salad) return;

  gsap.set(circle, {
    transformOrigin: "50% 50%",
    force3D: true,
    opacity: 0,
    scale: 0.88,
    rotation: -28
  });

  gsap.set(salad, {
    transformOrigin: "50% 50%",
    force3D: true,
    opacity: 0,
    scale: 0.9,
    xPercent: -18,
    yPercent: 12,
    rotation: 52
  });

  if (splash) {
    gsap.set(splash, {
      transformOrigin: "50% 80%",
      force3D: true,
      opacity: 0,
      xPercent: 55,
      rotation: -108
    });
  }

  ScrollTrigger.matchMedia({
    "(min-width: 901px)": () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "bottom 25%",
          scrub: 1.6,
          invalidateOnRefresh: true
        }
      });

      tl.fromTo(
        circle,
        { scale: 0.88, opacity: 0, rotation: -28 },
        { scale: 1, opacity: 1, rotation: 0, ease: "power1.inOut", duration: 0.35 },
        0
      )
        .fromTo(
          salad,
          { xPercent: -18, yPercent: 12, rotation: 52, opacity: 0, scale: 0.9 },
          { xPercent: 0, yPercent: 0, rotation: 34, opacity: 1, scale: 1, ease: "power1.inOut", duration: 0.4 },
          0.05
        );

      if (splash) {
        tl.fromTo(
          splash,
          { xPercent: 55, rotation: -108, opacity: 0 },
          { xPercent: 35, rotation: -88, opacity: 0.85, ease: "power1.inOut", duration: 0.45 },
          0.1
        )
          .to(
            splash,
            { xPercent: 22, rotation: -78, opacity: 1, ease: "none", duration: 0.55 },
            0.45
          );
      }

      tl.to(circle, { rotation: 18, ease: "none", duration: 0.65 }, 0.35)
        .to(salad, { yPercent: 6, rotation: 42, ease: "none", duration: 0.65 }, 0.35);
    },

    "(max-width: 900px)": () => {
      gsap.set(salad, {
        xPercent: -10,
        yPercent: 6,
        rotation: 46
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 88%",
          end: "bottom 20%",
          scrub: 1.2,
          invalidateOnRefresh: true
        }
      });

      tl.fromTo(
        circle,
        { scale: 0.9, opacity: 0, rotation: -20 },
        { scale: 1, opacity: 1, rotation: 0, ease: "power1.inOut", duration: 0.4 },
        0
      )
        .fromTo(
          salad,
          { xPercent: -10, yPercent: 6, rotation: 46, opacity: 0, scale: 0.92 },
          { xPercent: 0, yPercent: 0, rotation: 34, opacity: 1, scale: 1, ease: "power1.inOut", duration: 0.45 },
          0.05
        )
        .to(circle, { rotation: 12, ease: "none", duration: 0.55 }, 0.4)
        .to(salad, { yPercent: 4, rotation: 38, ease: "none", duration: 0.55 }, 0.4);
    }
  });

  ScrollTrigger.refresh();
}
