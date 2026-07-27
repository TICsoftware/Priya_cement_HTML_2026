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

})