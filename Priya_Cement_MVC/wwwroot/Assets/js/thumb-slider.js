document.addEventListener("DOMContentLoaded", function () {


    // READ MORE READ LESS
    document.querySelectorAll('.merge-imgs').forEach((wrapper) => {
        const cup = wrapper.querySelector('.merge-img--cup');
        const beans = wrapper.querySelector('.merge-img--beans');

        gsap.set(cup, { xPercent: -30, opacity: 0 });
        gsap.set(beans, { xPercent: 30, opacity: 0 });

        // idle float loops — created paused, played once merge finishes
        const floatCup = gsap.to(cup, {
        y: -12,
        duration: 2.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        paused: true
        });

        const floatBeans = gsap.to(beans, {
        y: -16,
        duration: 2.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        paused: true,
        delay: 0.3 // offset so they don't float in perfect sync
        });

        gsap.timeline({
        scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'top 40%',
            toggleActions: 'play none none reverse',
        },
        onComplete: () => {
            floatCup.play();
            floatBeans.play();
        },
        onReverseComplete: () => {
            floatCup.pause(0);
            floatBeans.pause(0);
        }
        })
        .to(cup, { xPercent: 0, opacity: 1, duration: 1, ease: 'power3.out' })
        .to(beans, { xPercent: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '<0.15');
    });

// ================= GALLERY =================
(function initLifeGallery() {
    const mainImage = document.getElementById("lifeMainImage");
    const thumbs = document.querySelectorAll(".bc-life-thumb");
    const track = document.getElementById("lifeThumbTrack");
    const wrapper = document.getElementById("lifeThumbWrapper");
    const prevBtn = document.getElementById("thumbPrev");
    const nextBtn = document.getElementById("thumbNext");
    const copyWrapper = document.getElementById("lifeCopyWrapper");
    if (!mainImage || !thumbs.length) return;

    const total = thumbs.length;

    function updateArrows() {
        const hasOverflow = track.scrollWidth > track.clientWidth + 2;
        wrapper.classList.toggle("has-overflow", hasOverflow);
    }

    function setActive(index) {
        thumbs.forEach(function (thumb) {
            const i = parseInt(thumb.getAttribute("data-frame-index"), 10);

            if (i === index) {
                thumb.classList.add("is-active");
                thumb.style.display = "none";
                thumb.style.order = "";
            } else {
                thumb.classList.remove("is-active");
                thumb.style.display = "";
                const position = ((i - index - 1) + total) % total;
                thumb.style.order = position;
            }
        });

        updateArrows();
    }

    function goToFrame(activeThumb) {
        const index = parseInt(activeThumb.getAttribute("data-frame-index"), 10);
        const src = activeThumb.getAttribute("data-life-image");

        mainImage.style.opacity = "0";
        setTimeout(function () {
            mainImage.setAttribute("src", src);
            mainImage.style.transition = "opacity 420ms ease";
            mainImage.style.opacity = "1";
        }, 180);

        const template = document.getElementById("frameContent-" + index);
        if (template && copyWrapper) {
            copyWrapper.innerHTML = template.innerHTML;
            if (window.reinitReadMore) window.reinitReadMore(); // re-check new content's height
        }

        setActive(index);
    }

    thumbs.forEach(function (thumb) {
        thumb.addEventListener("click", function () {
            goToFrame(thumb);
        });
    });

    if (prevBtn) prevBtn.addEventListener("click", function () {
        track.scrollBy({ left: -160, behavior: "smooth" });
    });
    if (nextBtn) nextBtn.addEventListener("click", function () {
        track.scrollBy({ left: 160, behavior: "smooth" });
    });

    window.addEventListener("resize", updateArrows);

    goToFrame(thumbs[0]); // Frame 1 active on load
})();

// ================= READ MORE / READ LESS =================
var LINES_TO_SHOW = 3;

function initReadMoreToggle(toggle) {
    var wrapper = toggle.closest('.bc-life-copy') || toggle.parentElement;
    var content = wrapper.querySelector('.read-more-content');
    var label = toggle.querySelector('.read-more-text');
    if (!content) return;

    var linesToShow = parseInt(content.dataset.lines, 10) || LINES_TO_SHOW;

    function getCollapsedHeight() {
        var styles = window.getComputedStyle(content);
        var lineHeight = parseFloat(styles.lineHeight);
        if (isNaN(lineHeight)) lineHeight = parseFloat(styles.fontSize) * 1.2;
        return lineHeight * linesToShow;
    }

    function setup() {
        content.style.maxHeight = 'none';
        content.classList.remove('is-collapsed');
        var fullHeight = content.scrollHeight;
        var collapsedHeight = getCollapsedHeight();

        if (fullHeight <= collapsedHeight + 1) {
            toggle.style.display = 'none';
            content.style.maxHeight = 'none';
            content.classList.remove('is-collapsed');
            return null;
        }

        toggle.style.display = '';
        content.style.maxHeight = collapsedHeight + 'px';
        content.classList.add('is-collapsed');
        if (label) label.textContent = 'Read More';
        toggle.classList.remove('active');
        return collapsedHeight;
    }

    var collapsedHeight = setup();
    if (collapsedHeight === null) return; // content fits fully, toggle hidden, done

    // strip old listeners by cloning
    var freshToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(freshToggle, toggle);
    toggle = freshToggle;
    label = toggle.querySelector('.read-more-text');

    toggle.addEventListener('click', function (e) {
        e.preventDefault();
        var isCollapsed = content.classList.contains('is-collapsed');

        if (isCollapsed) {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.classList.remove('is-collapsed');
            if (label) label.textContent = 'Read Less';
            toggle.classList.add('active');
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.offsetHeight; // force reflow
            content.classList.add('is-collapsed');
            content.style.maxHeight = collapsedHeight + 'px';
            if (label) label.textContent = 'Read More';
            toggle.classList.remove('active');
        }
    });

    content.addEventListener('transitionend', function () {
        if (!content.classList.contains('is-collapsed')) {
            content.style.maxHeight = 'none';
        }
    });

    window.addEventListener('resize', function () {
        collapsedHeight = setup();
        if (collapsedHeight === null) return;
        if (content.classList.contains('is-collapsed')) {
            content.style.maxHeight = collapsedHeight + 'px';
        }
    });
}

window.reinitReadMore = function () {
    document.querySelectorAll('.read-more-toggle').forEach(function (toggle) {
        initReadMoreToggle(toggle);
    });
};

document.addEventListener('DOMContentLoaded', function () {
    window.reinitReadMore();
});


});