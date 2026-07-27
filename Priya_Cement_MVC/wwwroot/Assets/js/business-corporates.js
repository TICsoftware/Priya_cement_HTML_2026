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