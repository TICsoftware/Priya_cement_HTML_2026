document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    if (typeof gsap.registerPlugin === "function") gsap.registerPlugin(ScrollTrigger);

    /* ---------------------------------------
       Intro lion — scale + stroke draw → fill
    --------------------------------------- */
    function initLionDraw(lionWrap, options = {}) {
      if (!lionWrap) return;
      const lionSvg =
        lionWrap.querySelector(".lion-logo-svg") || lionWrap.querySelector("svg");
      const lionFill = lionSvg && lionSvg.querySelector(".lion-logo-fill");
      if (!lionSvg || !lionFill) return;

      const strokeColor = options.stroke || "#C8C8C8";
      const start = options.start || "top 85%";
      const trigger =
        options.trigger || lionWrap.closest(".page-intro-outer") || lionWrap;

      let lionStroke = lionSvg.querySelector(".lion-logo-stroke");
      if (!lionStroke) {
        lionStroke = lionFill.cloneNode();
        lionStroke.removeAttribute("fill");
        lionStroke.removeAttribute("fill-opacity");
        lionStroke.classList.remove("lion-logo-fill");
        lionStroke.classList.add("lion-logo-stroke");
        lionStroke.setAttribute("fill", "none");
        lionStroke.setAttribute("stroke", strokeColor);
        lionStroke.setAttribute("stroke-width", "1.75");
        lionStroke.setAttribute("stroke-linecap", "round");
        lionStroke.setAttribute("stroke-linejoin", "round");
        lionStroke.setAttribute("vector-effect", "non-scaling-stroke");
        lionSvg.insertBefore(lionStroke, lionFill);
      }

      let pathLen = 0;
      try {
        pathLen = lionStroke.getTotalLength();
      } catch (e) {
        pathLen = 0;
      }
      if (pathLen <= 0) return;

      gsap.set(lionWrap, {
        xPercent: 0,
        yPercent: 0,
        scale: 0.05,
        transformOrigin: "50% 50%",
        force3D: true,
      });
      gsap.set(lionStroke, {
        strokeDasharray: pathLen,
        strokeDashoffset: pathLen,
        autoAlpha: 1,
      });
      gsap.set(lionFill, { autoAlpha: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger,
            start,
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        })
        .to(
          lionWrap,
          {
            scale: 1,
            duration: 1.35,
            ease: "power2.out",
            force3D: true,
          },
          0
        )
        .to(
          lionStroke,
          {
            strokeDashoffset: 0,
            duration: 1.35,
            ease: "power2.inOut",
          },
          0
        )
        .to(lionFill, { autoAlpha: 1, duration: 0.55, ease: "power2.out" }, "-=0.3")
        .to(lionStroke, { autoAlpha: 0, duration: 0.4, ease: "power1.out" }, "-=0.35");
    }

    initLionDraw(document.querySelector(".page-intro-outer .lion-logo-wrap"), {
      stroke: "#C8C8C8",
      start: "top 85%",
    });

    /* ---------------------------------------
       Verified media — home-style video settle
       (panel-scoped: no pin / no full-bleed)
    --------------------------------------- */
    const verifySection = document.querySelector(".sustain-verify-section");
    if (verifySection) {
      const media = verifySection.querySelector("[data-sustain-verify-media]");
      const videoWrap = verifySection.querySelector(".sustain-verify-video-wrap");
      const video = verifySection.querySelector(".sustain-verify-video");
      const videoScrim = verifySection.querySelector(".sustain-verify-video-overlay");
      const overlay = verifySection.querySelector(".sustain-verify-overlay");
      const title = verifySection.querySelector("[data-sustain-verify-title]");
      const certTiles = gsap.utils.toArray(
        verifySection.querySelectorAll(".sustain-cert-tile")
      );
      const cta = verifySection.querySelector("[data-sustain-verify-cta]");
      const ctaLink = cta && cta.querySelector(".site-link");

      const playVideo = () => {
        if (!video) return;
        const p = video.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      };

      if (media && videoWrap) {
        const mmVerify = gsap.matchMedia();

        const setupVerifySettle = ({ startScale, growDuration, kenScale }) => {
          media.classList.add("is-verify-anim");

          const copyEls = [videoScrim, title].filter(Boolean);

          gsap.set(videoWrap, {
            scale: startScale,
            x: 0,
            y: 0,
            autoAlpha: 1,
            transformOrigin: "50% 50%",
            force3D: true,
          });

          if (overlay) gsap.set(overlay, { autoAlpha: 1, y: 0 });
          if (copyEls.length) gsap.set(copyEls, { autoAlpha: 0 });
          if (certTiles.length) gsap.set(certTiles, { autoAlpha: 0, y: 28 });

          if (video) {
            gsap.set(video, {
              scale: 1,
              xPercent: 0,
              yPercent: 0,
              transformOrigin: "50% 45%",
              force3D: true,
            });
          }

          const kenBurns = video
            ? gsap.to(video, {
                scale: kenScale,
                xPercent: -2,
                yPercent: 1.25,
                duration: 16,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                paused: true,
                force3D: true,
              })
            : null;

          const tl = gsap.timeline({
            defaults: { force3D: true },
            scrollTrigger: {
              trigger: media,
              start: "top 75%",
              toggleActions: "restart none none reverse",
              invalidateOnRefresh: true,
              onEnter: () => {
                if (copyEls.length) gsap.set(copyEls, { autoAlpha: 0 });
                if (certTiles.length) gsap.set(certTiles, { autoAlpha: 0, y: 28 });
                playVideo();
                if (kenBurns) kenBurns.play();
              },
              onEnterBack: () => {
                playVideo();
                if (kenBurns) kenBurns.play();
              },
              onLeave: () => {
                if (kenBurns) kenBurns.pause();
              },
              onLeaveBack: () => {
                if (copyEls.length) gsap.set(copyEls, { autoAlpha: 0 });
                if (certTiles.length) gsap.set(certTiles, { autoAlpha: 0, y: 28 });
                if (kenBurns) {
                  kenBurns.pause();
                  kenBurns.progress(0);
                }
                if (video) gsap.set(video, { scale: 1, xPercent: 0, yPercent: 0 });
              },
            },
          });

          tl.to(
            videoWrap,
            {
              scale: 1,
              duration: growDuration,
              ease: "power2.inOut",
            },
            0
          );

          if (copyEls.length) {
            tl.to(
              copyEls,
              {
                autoAlpha: 1,
                duration: 0.65,
                ease: "power2.out",
              },
              growDuration * 0.9
            );
          }

          if (certTiles.length) {
            tl.to(
              certTiles,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out",
                stagger: 0.07,
              },
              growDuration * 0.9 + 0.1
            );
          }

          return () => {
            media.classList.remove("is-verify-anim");
            if (kenBurns) kenBurns.kill();
            gsap.set(
              [videoWrap, video, ...copyEls, ...certTiles].filter(Boolean),
              { clearProps: "transform,opacity,visibility" }
            );
          };
        };

        mmVerify.add("(min-width: 1024px)", () =>
          setupVerifySettle({
            startScale: 0.55,
            growDuration: 1.35,
            kenScale: 1.08,
          })
        );

        mmVerify.add("(max-width: 1023px)", () =>
          setupVerifySettle({
            startScale: 0.72,
            growDuration: 1.1,
            kenScale: 1.1,
          })
        );
      }

      if (ctaLink) {
        gsap.from(ctaLink, {
          y: 20,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cta,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }

    /* ---------------------------------------
       Manufactures responsibly — tabs
    --------------------------------------- */
    initSustainRespTabs();
  } else {
    initSustainRespTabs();
  }

  function initSustainRespTabs() {
    const section = document.querySelector(".sustain-resp-section");
    if (!section) return;

    const tabList = section.querySelector(".sustain-resp-tabs");
    const tabWrap = section.querySelector(".sustain-resp-tabs-wrap");
    const pill = section.querySelector("[data-sustain-tab-pill]");
    const tabs = Array.from(section.querySelectorAll("[data-sustain-tab]"));
    const panels = Array.from(section.querySelectorAll("[data-sustain-panel]"));
    if (!tabs.length || !panels.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animating = false;

    const updateTabFades = () => {
      if (!tabList || !tabWrap) return;
      const maxScroll = tabList.scrollWidth - tabList.clientWidth;
      const canScroll = maxScroll > 2;
      const atStart = tabList.scrollLeft <= 2;
      const atEnd = tabList.scrollLeft >= maxScroll - 2;
      tabWrap.classList.toggle("is-fade-left", canScroll && !atStart);
      tabWrap.classList.toggle("is-fade-right", canScroll && !atEnd);
    };

    const getPanel = (id) =>
      panels.find((panel) => panel.getAttribute("data-sustain-panel") === id);

    const getTab = (id) =>
      tabs.find((tab) => tab.getAttribute("data-sustain-tab") === id);

    const movePill = (el, animate = true) => {
      if (!el || !pill) return;
      const to = {
        x: el.offsetLeft,
        y: el.offsetTop,
        width: el.offsetWidth,
        height: el.offsetHeight,
      };

      if (typeof gsap === "undefined") {
        pill.style.transform = `translate(${to.x}px, ${to.y}px)`;
        pill.style.width = `${to.width}px`;
        pill.style.height = `${to.height}px`;
        return;
      }

      gsap.to(pill, {
        ...to,
        duration: animate && !reduceMotion ? 0.45 : 0,
        ease: "power3.out",
        overwrite: true,
      });
    };

    const playPanelCounters = (panel) => {
      if (!panel || typeof window.PriyaOdometer === "undefined") return;
      window.PriyaOdometer.reset(panel);
      // Double rAF so font-size clamp is computed before height lock
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.PriyaOdometer.play(panel, { animate: !reduceMotion });
        });
      });
    };

    const setTabState = (activeId, { animatePill = true } = {}) => {
      tabs.forEach((tab) => {
        const isActive = tab.getAttribute("data-sustain-tab") === activeId;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", isActive ? "true" : "false");
        tab.tabIndex = isActive ? 0 : -1;
        if (isActive) {
          movePill(tab, animatePill);
          if (tabList && tabList.scrollWidth > tabList.clientWidth) {
            tabList.scrollTo({
              left: Math.max(tab.offsetLeft - 16, 0),
              behavior: animatePill && !reduceMotion ? "smooth" : "auto",
            });
          }
          requestAnimationFrame(updateTabFades);
        }
      });
    };

    const showPanel = (nextId, { animate } = { animate: true }) => {
      const next = getPanel(nextId);
      const current = panels.find((panel) => panel.classList.contains("is-active"));
      if (!next || (current && current === next) || animating) return;

      setTabState(nextId, { animatePill: animate });

      const finish = () => {
        panels.forEach((panel) => {
          const active = panel === next;
          panel.classList.toggle("is-active", active);
          if (active) panel.removeAttribute("hidden");
          else panel.setAttribute("hidden", "");
          if (typeof gsap !== "undefined") {
            gsap.set(panel, { clearProps: "opacity,visibility,transform" });
          }
        });
        animating = false;
        playPanelCounters(next);
      };

      if (
        !animate ||
        reduceMotion ||
        typeof gsap === "undefined" ||
        !current
      ) {
        finish();
        return;
      }

      animating = true;
      const media = next.querySelector(".sustain-resp-media");
      const copy = next.querySelector(".sustain-resp-copy");

      gsap
        .timeline({
          defaults: { ease: "power2.out" },
          onComplete: finish,
        })
        .to(current, { autoAlpha: 0, y: 12, duration: 0.28 }, 0)
        .add(() => {
          current.classList.remove("is-active");
          current.setAttribute("hidden", "");
          next.classList.add("is-active");
          next.removeAttribute("hidden");
          gsap.set(next, { autoAlpha: 0, y: 16 });
          if (media) gsap.set(media, { autoAlpha: 0, y: 18 });
          if (copy) gsap.set(copy, { autoAlpha: 0, y: 18 });
        })
        .to(next, { autoAlpha: 1, y: 0, duration: 0.35 }, "+=0.01")
        .to(
          media || next,
          { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" },
          "-=0.2"
        )
        .to(
          copy || next,
          { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" },
          "-=0.35"
        );
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        showPanel(tab.getAttribute("data-sustain-tab"), { animate: true });
      });

      tab.addEventListener("keydown", (event) => {
        const index = tabs.indexOf(tab);
        let nextIndex = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = tabs.length - 1;
        } else {
          return;
        }
        event.preventDefault();
        tabs[nextIndex].focus();
        showPanel(tabs[nextIndex].getAttribute("data-sustain-tab"), {
          animate: true,
        });
      });
    });

    // Place pill on the default active tab (no slide on first paint)
    const initial =
      tabs.find((tab) => tab.classList.contains("is-active")) || tabs[0];
    requestAnimationFrame(() => {
      movePill(initial, false);
      updateTabFades();
    });

    if (tabList) {
      tabList.addEventListener("scroll", updateTabFades, { passive: true });
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const active =
          tabs.find((tab) => tab.getAttribute("aria-selected") === "true") ||
          initial;
        movePill(active, false);
        updateTabFades();
      }, 120);
    });

    // Entrance when section enters viewport
    if (
      !reduceMotion &&
      typeof gsap !== "undefined" &&
      typeof ScrollTrigger !== "undefined"
    ) {
      const title = section.querySelector(".sustain-resp-title");
      const tabBar = section.querySelector(".sustain-resp-tabs-wrap");
      const activePanel = section.querySelector(".sustain-resp-panel.is-active");
      const media = activePanel && activePanel.querySelector(".sustain-resp-media");
      const copy = activePanel && activePanel.querySelector(".sustain-resp-copy");

      const entranceEls = [title, tabBar, media, copy].filter(Boolean);
      if (entranceEls.length) {
        gsap.set(entranceEls, { autoAlpha: 0, y: 28 });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          })
          .to(title, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out" }, 0)
          .to(tabBar, { autoAlpha: 1, y: 0, duration: 0.65, ease: "power3.out" }, 0.12)
          .to(media, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.22)
          .to(copy, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.32)
          .add(() => {
            movePill(
              getTab(
                (
                  tabs.find((t) => t.getAttribute("aria-selected") === "true") ||
                  initial
                ).getAttribute("data-sustain-tab")
              ),
              false
            );
            playPanelCounters(activePanel);
          });
      }
    } else {
      // No GSAP entrance — still run counters when the section is in view
      const activePanel = section.querySelector(".sustain-resp-panel.is-active");
      if (activePanel && "IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                playPanelCounters(activePanel);
                io.disconnect();
              }
            });
          },
          { threshold: 0.35 }
        );
        io.observe(section);
      }
    }
  }
});
