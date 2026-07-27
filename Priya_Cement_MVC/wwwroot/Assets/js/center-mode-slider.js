
(function () {
    function initCenterModeSlider() {
        if (typeof Swiper === "undefined") return;

        const sliderRoot = document.querySelector(".edgeSwiper");
        if (!sliderRoot) return;

        const qsa = (selector, scope = document) => [
            ...scope.querySelectorAll(selector),
        ];
        const qs = (selector, scope = document) => scope.querySelector(selector);
        const navContainer = qs(".edge-nav-arrows");
        const prevControl = navContainer
            ? qs(".edge-swiper-prev", navContainer)
            : null;
        const nextControl = navContainer
            ? qs(".edge-swiper-next", navContainer)
            : null;

        const edgeSwiper = new Swiper(".edgeSwiper", {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            centeredSlides: true,
            breakpoints: {
                290: { slidesPerView: 1.1, centeredSlides: true, spaceBetween: 2 },
                768: { slidesPerView: 2.6, centeredSlides: true, spaceBetween: 30 },
            },
        });

        // Hide per-card arrow controls; keep only .edge-nav-arrows controls.
        qsa(".edgeArrow", sliderRoot).forEach((item) =>
            item.classList.add("hidden"),
        );

        prevControl?.addEventListener("click", () => edgeSwiper.slidePrev());
        nextControl?.addEventListener("click", () => edgeSwiper.slideNext());
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCenterModeSlider, {
            once: true,
        });
    } else {
        initCenterModeSlider();
    }
})();


