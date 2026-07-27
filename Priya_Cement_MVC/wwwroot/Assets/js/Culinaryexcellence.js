// Intro Animation
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


// Why central kitchen matter 
document.addEventListener("DOMContentLoaded", function () {
// ==================== BUSINESS & CORPORATES PAGE ====================
// Plate roation animation
gsap.to(".bc-plate-img", {
    rotation: -120,
    scale: 1.05,
    y: -20,
    ease: "none",
    scrollTrigger: {
        trigger: ".bc-experience-section",
        start: "top 85%",
        end: "bottom 15%",
        scrub: 2
    }
});

gsap.to(".bc-plate-wrap", {
    ease: "none",
    keyframes: {
        "0%":   { "--rot": "-120deg",    "--scale": 1,    "--y": "0px" },
        "50%":  { "--rot": "0deg", "--scale": 1, "--y": "0px" },
        "100%": { "--rot": "0deg",    "--scale": 1,    "--y": "0px" }
    },
    scrollTrigger: {
        trigger: ".bc-experience-section",
        start: "top 85%",
        end: "bottom 15%",
        scrub: 2
    }
});


// half circle bg animation

document.querySelectorAll('.bc-experience-section').forEach((wrapper) => {
    const deco = wrapper.querySelector('.bc-deco');
    const plateMini = wrapper.querySelector('.bc-plate-mini');

    gsap.to(deco, {
        y: -12,
        rotate: '+=5',
        duration: 2.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
    });

    gsap.to(plateMini, {
        y: -10,
        rotate: '-=6',
        duration: 3.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 0.25
    });
});


// curve — topY must be >= maxCurve so the upward arc stays inside the viewBox
function buildPath(W, H, curveAmount, topY) {
  if (curveAmount <= 0) {
    return "M0," + topY + " L" + W + "," + topY +
           " L" + W + "," + H + " L0," + H + " Z";
  }

  var halfW = W / 2;
  var s = curveAmount;
  var r = (halfW * halfW + s * s) / (2 * s); // radius from chord + sagitta

  // sweep-flag 1 keeps the original upward mound (peak toward y=0)
  return (
    "M0," + topY +
    " A" + r + "," + r + " 0 0,1 " + W + "," + topY +
    " L" + W + "," + H +
    " L0," + H +
    " Z"
  );
}

function setupCurveReveal(path, maxCurve) {
  var W = 1000, H = 400;
  // Chord sits at maxCurve (+ pad) so the peak lands just inside y=0, never clipped
  var topY = Math.ceil(maxCurve) + 4;
  var state = { curve: 0 };

  function render() {
    path.setAttribute("d", buildPath(W, H, state.curve, topY));
  }
  render();

  var tween = gsap.to(state, {
    curve: maxCurve,
    ease: "power2.inOut",
    duration: 1,
    paused: true,
    onUpdate: render
  });

  var wrap = path.closest(".curveshape-wrap");
  if (!wrap) {
    console.warn("setupCurveReveal: no .curveshape-wrap ancestor found", path);
    return;
  }

  ScrollTrigger.create({
    trigger: wrap,
    start: "top 80%",
    end: "bottom 20%",
    onEnter: function () { tween.play(); },
    onLeave: function () { tween.reverse(); },
    onEnterBack: function () { tween.play(); },
    onLeaveBack: function () { tween.reverse(); }
  });
}

document.querySelectorAll(".curvePath").forEach(function (path) {
  var maxCurve = parseFloat(path.dataset.maxCurve) || 140;
  setupCurveReveal(path, maxCurve);
});



document.querySelectorAll('.outer-polaroids-icons').forEach((wrapper) => {
    const left = wrapper.querySelector('.bc-polaroid--left');
    const right = wrapper.querySelector('.bc-polaroid--right');
    const chili = wrapper.querySelector('.bc-dining-deco--chili');
    const basil = wrapper.querySelector('.bc-dining-deco--basil');

    // starting positions
    gsap.set(left, { xPercent: -30, opacity: 0, rotate: -6 });
    gsap.set(right, { xPercent: 30, opacity: 0, rotate: 6 });
    gsap.set(chili, { y: -20, opacity: 0, rotate: -15 });
    gsap.set(basil, { y: -20, opacity: 0, rotate: 15 });

    // idle float loops — created paused, played once merge finishes
    const floatLeft = gsap.to(left, {
        y: -10,
        duration: 2.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        paused: true
    });

    const floatRight = gsap.to(right, {
        y: -14,
        duration: 2.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        paused: true,
        delay: 0.3
    });

    const floatChili = gsap.to(chili, {
        y: -8,
        rotate: '+=6',
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        paused: true
    });

    const floatBasil = gsap.to(basil, {
        y: -8,
        rotate: '-=6',
        duration: 3.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        paused: true,
        delay: 0.2
    });

    gsap.timeline({
        scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'top 40%',
            toggleActions: 'play none none reverse',
        },
        onComplete: () => {
            floatLeft.play();
            floatRight.play();
            floatChili.play();
            floatBasil.play();
        },
        onReverseComplete: () => {
            floatLeft.pause(0);
            floatRight.pause(0);
            floatChili.pause(0);
            floatBasil.pause(0);
        }
    })
    .to(left, { xPercent: 0, opacity: 1, rotate: -3, duration: 1, ease: 'power3.out' })
    .to(right, { xPercent: 0, opacity: 1, rotate: 3, duration: 1, ease: 'power3.out' }, '<0.15')
    .to(chili, { y: 0, opacity: 1, rotate: 0, duration: 0.8, ease: 'power2.out' }, '<0.1')
    .to(basil, { y: 0, opacity: 1, rotate: 0, duration: 0.8, ease: 'power2.out' }, '<0.1');
});



});



// Counter js
document.addEventListener("DOMContentLoaded", () => {


   

/* ---------------------------------------------
   ODOMETER ANIMATION FOR COUNTERS
--------------------------------------------- */
const BASE_ROLLS = 2;              // minimum full 0-9 cycles per digit
const EXTRA_ROLLS_PER_POS = 1;     // extra cycles added towards leftmost digits
const BASE_DURATION = 900;         // ms for rightmost digit
const DURATION_PER_ROLL = 220;     // ms per full 10-digit roll

/* ---------------------------------------------
   FORMAT NUMBER WITH COMMAS
--------------------------------------------- */
function formatNumberString(nStr) {
  const num = Number(nStr);
  if (isNaN(num)) return "0";

  const abs = Math.abs(num);
  const [intPartRaw, decPartRaw] = abs.toString().split(".");

  // format integer with commas
  const intPart = intPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // no decimals Ã¢â€ â€™ return integer only
  if (!decPartRaw) return intPart;

  // trim trailing zeros in decimal
  const decPart = decPartRaw.replace(/0+$/, "");

  // all decimals were zero (e.g. .00)
  if (!decPart) return intPart;

  return `${intPart}.${decPart}`;
}

/* ---------------------------------------------
   BUILD ODOMETER DOM
--------------------------------------------- */
function buildOdometer(counterEl) {
  const rawTarget = counterEl.getAttribute("data-target") || "0";
  const suffix = counterEl.getAttribute("data-suffix") || "";
  const targetStr = formatNumberString(rawTarget);

  counterEl.textContent = "";

  const odometer = document.createElement("span");
  odometer.className = "counter-odometer";

  const chars = targetStr.split("");

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    /* -------- COMMA (STATIC) -------- */
    if (char === "," || char === ".") {
  const staticChar = document.createElement("span");
  staticChar.className = "odometer-separator";
  staticChar.textContent = char;
  odometer.appendChild(staticChar);
  continue;
}

    /* -------- DIGIT (ANIMATED) -------- */
    const digit = parseInt(char, 10);

    const slot = document.createElement("span");
    slot.className = "odometer-digit";

    const column = document.createElement("span");
    column.className = "odometer-column";

    // count numeric digits only (ignore commas)
    const numericIndex =
       chars.slice(i).filter(c => c !== "," && c !== ".").length - 1;

    const rolls = BASE_ROLLS + numericIndex * EXTRA_ROLLS_PER_POS;

    for (let r = 0; r <= rolls; r++) {
      for (let d = 0; d < 10; d++) {
        const line = document.createElement("span");
        line.className = "odometer-digit-line";
        line.textContent = d;
        column.appendChild(line);
      }
    }

    slot.appendChild(column);
    odometer.appendChild(slot);

    slot._finalIndex = rolls * 10 + digit;
    slot._rolls = rolls;
  }

  /* -------- SUFFIX (STATIC) -------- */
  if (suffix) {
    const suf = document.createElement("span");
    suf.className = "counter-suffix";
    suf.textContent = suffix;
    odometer.appendChild(suf);
  }

  counterEl.appendChild(odometer);

  return Array.from(odometer.querySelectorAll(".odometer-digit"));
}

/* ---------------------------------------------
   ANIMATE DIGITS
--------------------------------------------- */
function animateOdometerSlots(slots) {
  if (!slots.length) return;

  const firstLine = slots[0].querySelector(".odometer-digit-line");
  const digitHeight = firstLine
    ? firstLine.getBoundingClientRect().height
    : 0;

  slots.forEach((slot, idx) => {
    const column = slot.querySelector(".odometer-column");
    const finalIndex = slot._finalIndex;

    const duration =
      BASE_DURATION + slot._rolls * DURATION_PER_ROLL;

    const totalSlots = slots.length;
    const staggerFactor = 0.08;
    const delay = Math.round(
      duration * staggerFactor * (totalSlots - idx - 1)
    );

    column.style.transition = `transform ${duration}ms cubic-bezier(.22,.9,.35,1) ${delay}ms`;
    column.style.transform = "translateY(0px)";

    const offset = finalIndex * digitHeight;

    setTimeout(() => {
      column.style.transform = `translateY(-${offset}px)`;
    }, 20);
  });
}

/* ---------------------------------------------
   INIT WITH INTERSECTION OBSERVER
--------------------------------------------- */
const counters = document.querySelectorAll(".counter");
const stateMap = new WeakMap();

if (counters.length) {
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        if (stateMap.get(el)) {
          obs.unobserve(el);
          return;
        }

        const slots = buildOdometer(el);
        void el.offsetHeight; // force reflow
        animateOdometerSlots(slots);

        stateMap.set(el, true);
        obs.unobserve(el);
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach(c => io.observe(c));
}

});


document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.map-outer-warapper');
  const states = document.querySelectorAll('.map-state');
  const items = document.querySelectorAll('.map-item');

  // ---------- Helpers ----------
  function getItemByLocation(location) {
    return Array.from(items).find(
      (item) => item.querySelector('.map-hover')?.getAttribute('data-location') === location
    );
  }

  function getStateByLocation(location) {
    return Array.from(states).find(
      (state) => state.getAttribute('data-location') === location
    );
  }

  function clearAllActive() {
    states.forEach((s) => s.classList.remove('active'));
    items.forEach((i) => i.classList.remove('active', 'linked-active'));
    wrapper.classList.remove('has-active');
  }

  function activateLocation(location) {
    clearAllActive();

    const state = getStateByLocation(location);
    const item = getItemByLocation(location);

    if (state) state.classList.add('active');   // <-- map-state gets "active" class here
    if (item) item.classList.add('linked-active');

    wrapper.classList.add('has-active');
  }

  // ---------- 1. Position line + label for every map-item ----------
items.forEach((item) => {
  const circle = item.querySelector('.map-hover');
  const line = item.querySelector('.map-line');
  const labelGroup = item.querySelector('.map-label-group');
  const labelBg = item.querySelector('.map-label-bg');
  const labelText = item.querySelector('.map-label');

  if (!circle || !line || !labelGroup || !labelBg || !labelText) return;

  const cx = parseFloat(circle.getAttribute('cx'));
  const cy = parseFloat(circle.getAttribute('cy'));
  const lx = parseFloat(item.getAttribute('data-lx')) || cx;
  const ly = parseFloat(item.getAttribute('data-ly')) || cy - 40;

  const textLength = labelText.getComputedTextLength();
  const paddingX = 16;
  const minWidth = 40;
  const labelHeight = parseFloat(labelBg.getAttribute('height')) || 25;
  const labelWidth = Math.max(textLength + paddingX, minWidth);

  line.setAttribute('d', `M${cx},${cy} L${lx},${ly}`);

  // NEW: decide which side the label falls on, and anchor the box accordingly
  const isRightSide = lx >= cx;
  const boxX = isRightSide ? lx : lx - labelWidth;

  labelGroup.setAttribute(
    'transform',
    `translate(${boxX}, ${ly - labelHeight / 2})`
  );
  labelBg.setAttribute('x', 0);
  labelBg.setAttribute('y', 0);
  labelBg.setAttribute('width', labelWidth);
  labelBg.setAttribute('height', labelHeight);
  labelText.setAttribute('x', labelWidth / 2);
  labelText.setAttribute('y', labelHeight / 2);
});

  // ---------- 2. Pin hover -> highlight linked state ----------
  items.forEach((item) => {
    const circle = item.querySelector('.map-hover');
    const location = circle?.getAttribute('data-location');
    if (!location) return;

    item.addEventListener('mouseenter', () => {
      const state = getStateByLocation(location);
      if (state) state.classList.add('hover-linked');
    });

    item.addEventListener('mouseleave', () => {
      const state = getStateByLocation(location);
      if (state) state.classList.remove('hover-linked');
    });
  });

  // ---------- 3. State hover -> highlight linked pin/line/label ----------
  states.forEach((state) => {
    const location = state.getAttribute('data-location');

    state.addEventListener('mouseenter', () => {
      const item = getItemByLocation(location);
      if (item) item.classList.add('linked-hover');
    });

    state.addEventListener('mouseleave', () => {
      const item = getItemByLocation(location);
      if (item) item.classList.remove('linked-hover');
    });
  });

  // ---------- 4. Click on state OR pin -> toggle active class for both ----------
  states.forEach((state) => {
    state.addEventListener('click', () => {
      const location = state.getAttribute('data-location');
      const isAlreadyActive = state.classList.contains('active');

      if (isAlreadyActive) {
        clearAllActive();
      } else {
        activateLocation(location);
        console.log('Selected:', location);
      }
    });
  });

  items.forEach((item) => {
    const circle = item.querySelector('.map-hover');
    if (!circle) return;

    circle.addEventListener('click', () => {
      const location = circle.getAttribute('data-location');
      const isAlreadyActive = item.classList.contains('linked-active');

      if (isAlreadyActive) {
        clearAllActive();
      } else {
        activateLocation(location);
        console.log('Selected:', location);
      }
    });
  });
});


// want to explore more with nekta
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


//----------------- Build to aviation standard js ---------------------------------//
document.addEventListener('DOMContentLoaded', () => {

   const section = document.querySelector('.av-section');
   if (!section) return;

   const image = section.querySelector('[data-av-image]');
   const items = gsap.utils.toArray('[data-av-item]', section);
   const prevBtn = section.querySelector('[data-av-prev]');
   const nextBtn = section.querySelector('[data-av-next]');

   let activeIndex = 0;

   function setActive(index, { animate = true } = {}) {

      // Wrap around
      const total = items.length;
      activeIndex = (index + total) % total;

      // Active class
      items.forEach((item, i) => {
         item.classList.toggle('active', i === activeIndex);
      });

      const newSrc = items[activeIndex].dataset.image;

      if (!newSrc || newSrc === image.getAttribute('src')) return;

      if (!animate) {
         image.src = newSrc;
         return;
      }

      gsap.to(image, {
         opacity: 0,
         duration: 0.3,
         ease: "power2.out",
         onComplete: () => {

            image.src = newSrc;

            const showImage = () => {
               gsap.to(image, {
                  opacity: 1,
                  duration: 0.3,
                  ease: "power2.out"
               });

               image.removeEventListener("load", showImage);
            };

            if (image.complete) {
               showImage();
            } else {
               image.addEventListener("load", showImage);
            }
         }
      });
   }

   // Hover + Click
   items.forEach((item, index) => {

      item.addEventListener('mouseenter', () => {
         setActive(index);
      });

      item.addEventListener('click', () => {
         setActive(index);
      });

   });

   // Previous
   if (prevBtn) {
      prevBtn.addEventListener('click', () => {
         setActive(activeIndex - 1);
      });
   }

   // Next
   if (nextBtn) {
      nextBtn.addEventListener('click', () => {
         setActive(activeIndex + 1);
      });
   }

   // Initial active state
   setActive(0, { animate: false });

});