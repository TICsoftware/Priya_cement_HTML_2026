document.addEventListener("DOMContentLoaded", (event) => {

  // --------------------------------------------
  // GSAP + ScrollTrigger + Lenis Setup
  // --------------------------------------------
  gsap.registerPlugin(ScrollTrigger);
  
  const isMobile = window.matchMedia("(max-width: 992px)").matches;
  
  /** Same scroll root as Lenis default (wrapper: window Ã¢â€ â€™ classes + scroll on documentElement). */
  const scrollRootEl = document.documentElement;
  
  let lenis;
  
  if (!isMobile) {
  
    lenis = new Lenis({
      smoothWheel: true,
      smoothTouch: false,
  
      // PERFECT NO-LAG SETTINGS
      lerp: 0.05,              // fast response, no delay
      wheelMultiplier: 1.02,   // mouse feels natural
      normalizeWheel: true,
      syncTouch: false,
        prevent: (node) => {
        return node.closest('.testimonial-content');
      }
    });
  
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  
    window.lenis = lenis;
  
    // ---- GSAP SYNC ----
    ScrollTrigger.scrollerProxy(scrollRootEl, {
      scrollTop(value) {
        return arguments.length
          ? lenis.scrollTo(value, { immediate: true })
          : lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: scrollRootEl.clientWidth,
          height: scrollRootEl.clientHeight
        };
      }
    });
  
    // ScrollTriggers must use the same element Lenis proxies Ã¢â‚¬â€ otherwise scrub/toggle use native scroll and wonÃ¢â‚¬â„¢t match smooth scroll.
    ScrollTrigger.defaults({ scroller: scrollRootEl });
  
    lenis.on("scroll", ScrollTrigger.update);
    ScrollTrigger.addEventListener("refresh", () => lenis.resize());
    ScrollTrigger.refresh();
  
  } else {
    document.body.classList.add("native-scroll");
    // Mobile: keep true native window/document scroll (no scrollerProxy).
    // Proxying documentElement can interfere with touch scrolling on some mobile browsers.
    ScrollTrigger.defaults({ scroller: window });
    ScrollTrigger.refresh();
  }


  
// --------------------------------------------
// FOOTER YEAR
// --------------------------------------------
document.getElementById("year-foot").innerHTML = (new Date().getFullYear());

// --------------------------------------------
// HEADER
// --------------------------------------------
 const navTemplate = document.getElementById('navSource');
  const sections = navTemplate.content.querySelectorAll('.nav-data');

  function getSection(key){
    return navTemplate.content.querySelector(`.nav-data[data-key="${key}"]`);
  }

  const chevSVG = '<svg viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---------- build desktop nav triggers ---------- */
  const primaryNav = document.getElementById('primaryNav');
  sections.forEach(section=>{
    const el = document.createElement('div');
    el.className = 'nav-item';
    el.dataset.key = section.dataset.key;
    el.innerHTML = `<button class="nav-trigger" aria-expanded="false">${section.dataset.label}${chevSVG}</button>`;
    primaryNav.appendChild(el);
  });

  /* mega panel content is just the matching section's markup, cloned in */
  function fillMegaPanel(key){
    const section = getSection(key);
    if(!section) return;
    megaInner.innerHTML = '';
    section.querySelectorAll('.mega-links, .mega-promo').forEach(node=>{
      megaInner.appendChild(node.cloneNode(true));
    });
  }

  /* ---------- desktop interaction ---------- */
  const header = document.getElementById('siteHeader');
  const megaPanel = document.getElementById('megaPanel');
  const megaInner = document.getElementById('megaInner');
  const megaBackdrop = document.getElementById('megaBackdrop');
  const navPill = document.getElementById('navPill');
  const navItems = Array.from(primaryNav.querySelectorAll('.nav-item'));

  let activeKey = null;
  let closeTimer = null;

  function positionPill(btn){
    if(!btn){ navPill.classList.remove('is-visible'); return; }
    const navRect = primaryNav.getBoundingClientRect();
    const r = btn.getBoundingClientRect();
    navPill.style.width = r.width + 'px';
    navPill.style.transform = `translate(${r.left - navRect.left}px, -50%)`;
    navPill.classList.add('is-visible');
  }

  function openMenu(key){
    clearTimeout(closeTimer);
    if(!getSection(key)) return;
    activeKey = key;

    navItems.forEach(el=>{
      const isMatch = el.dataset.key === key;
      el.classList.toggle('is-active', isMatch);
      if(isMatch) positionPill(el.querySelector('.nav-trigger'));
    });

    fillMegaPanel(key);
    megaPanel.classList.add('is-open');
    megaBackdrop.classList.add('is-visible');

    // measure natural height for smooth transition
    megaPanel.style.height = 'auto';
    const target = megaPanel.scrollHeight;
    megaPanel.style.height = '0px';
    requestAnimationFrame(()=>{
      megaPanel.style.height = target + 'px';
    });
  }

  function closeMenu(){
    activeKey = null;
    navItems.forEach(el=>el.classList.remove('is-active'));
    navPill.classList.remove('is-visible');
    megaPanel.classList.remove('is-open');
    megaBackdrop.classList.remove('is-visible');
    megaPanel.style.height = '0px';
  }

  navItems.forEach(el=>{
    el.addEventListener('mouseenter', ()=> openMenu(el.dataset.key));
    el.querySelector('.nav-trigger').addEventListener('focus', ()=> openMenu(el.dataset.key));
  });
  primaryNav.addEventListener('mouseleave', ()=>{
    closeTimer = setTimeout(closeMenu, 160);
  });
  megaPanel.addEventListener('mouseenter', ()=> clearTimeout(closeTimer));
  megaPanel.addEventListener('mouseleave', ()=>{
    closeTimer = setTimeout(closeMenu, 160);
  });
  megaBackdrop.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeMenu(); });

  window.addEventListener('resize', ()=>{
    if(activeKey){
      const el = navItems.find(n=>n.dataset.key===activeKey);
      positionPill(el ? el.querySelector('.nav-trigger') : null);
    }else{
      navPill.classList.remove('is-visible');
    }
  });

  /* ---------- scroll behavior: shadow, compact, hide-on-scroll-down ---------- */
  let lastY = window.scrollY;
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 4);
    header.classList.toggle('is-compact', y > 80);

    const scrollingDown = y > lastY;
    const pastThreshold = y > 140;
    const menusClosed = !activeKey && !document.getElementById('mobileNav').classList.contains('is-open');

    if(scrollingDown && pastThreshold && menusClosed){
      header.classList.add('is-hidden');
      closeMenu();
    }else if(!scrollingDown){
      header.classList.remove('is-hidden');
    }
    lastY = y;
  }, {passive:true});

  /* ---------- language dropdown ---------- */
  const langWrap = document.getElementById('langWrap');
  const langBtn = document.getElementById('langBtn');
  langBtn.addEventListener('click', (e)=>{
    e.stopPropagation();
    langWrap.classList.toggle('is-open');
  });
  document.addEventListener('click', ()=> langWrap.classList.remove('is-open'));

  /* ---------- cmd-k style search overlay ---------- */
  const searchTrigger = document.getElementById('searchTrigger');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  const searchInputWrap = document.getElementById('searchInputWrap');
  const searchClear = document.getElementById('searchClear');
  const searchModalClose = document.getElementById('searchModalClose');

  function openSearch(){
    searchOverlay.classList.add('is-open');
    searchTrigger.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    setTimeout(()=> searchInput.focus(), 150);
  }

  function closeSearch(){
    searchOverlay.classList.remove('is-open');
    searchTrigger.classList.remove('is-active');
    searchModal.classList.remove('is-focused');
    document.body.style.overflow = '';
    searchInput.value = '';
    searchInputWrap.classList.remove('has-value');
    searchInput.focus();
  }

  searchInput.addEventListener('focus', ()=> searchModal.classList.add('is-focused'));
  searchInput.addEventListener('blur', ()=> searchModal.classList.remove('is-focused'));

  searchTrigger.addEventListener('click', openSearch);
  searchModalClose.addEventListener('click', closeSearch);
  searchClear.addEventListener('click', ()=>{
    searchInput.value = '';
    searchInputWrap.classList.remove('has-value');
    searchInput.focus();
  });
  searchInput.addEventListener('input', ()=>{
    searchInputWrap.classList.toggle('has-value', searchInput.value.length > 0);
  });
  searchOverlay.addEventListener('click', (e)=>{
    if(e.target === searchOverlay) closeSearch();
  });
  document.addEventListener('keydown', (e)=>{
    if((e.metaKey || e.ctrlKey) && e.key.toLowerCase()==='k'){
      e.preventDefault();
      searchOverlay.classList.contains('is-open') ? closeSearch() : openSearch();
    }
    if(!searchOverlay.classList.contains('is-open')) return;
    if(e.key === 'Escape') closeSearch();
  });

  /* ---------- mobile drawer (drill-down) ---------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerBody = document.getElementById('drawerBody');
  const drawerRoot = document.getElementById('drawerRoot');
  const drawerSub = document.getElementById('drawerSub');
  const drawerClose = document.getElementById('drawerClose');

  const backSVG = '<svg viewBox="0 0 16 16" fill="none"><path d="M10 3L4 8l6 5" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function buildDrawerRoot(){
    drawerRoot.innerHTML = '';
    sections.forEach(section=>{
      const row = document.createElement('button');
      row.className = 'drawer-row';
      row.innerHTML = `${section.dataset.label}${chevSVG}`;
      row.addEventListener('click', ()=> openSubmenu(section.dataset.key));
      drawerRoot.appendChild(row);
    });
  }

  function openSubmenu(key){
    const section = getSection(key);
    if(!section) return;

    drawerSub.innerHTML = `
      <div class="drawer-sub-header">
        <button class="drawer-back" aria-label="Back to menu">${backSVG}</button>
        <span class="drawer-sub-title">${section.dataset.label}</span>
      </div>`;

    // same source markup as desktop — links list + promo card, just cloned
    const linksClone = section.querySelector('.mega-links').cloneNode(true);
    linksClone.className = 'drawer-links';
    drawerSub.appendChild(linksClone);
    drawerSub.appendChild(section.querySelector('.mega-promo').cloneNode(true));

    drawerSub.querySelector('.drawer-back').addEventListener('click', closeSubmenu);
    drawerSub.scrollTop = 0;
    drawerBody.classList.add('is-sub');
  }

  function closeSubmenu(){
    drawerBody.classList.remove('is-sub');
  }

  buildDrawerRoot();

  function openDrawer(){
    mobileNav.classList.add('is-open');
    drawerOverlay.classList.add('is-open');
    mobileToggle.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer(){
    mobileNav.classList.remove('is-open');
    drawerOverlay.classList.remove('is-open');
    mobileToggle.classList.remove('is-active');
    document.body.style.overflow = '';
    setTimeout(closeSubmenu, 400); // reset to root only after the drawer is off-screen
  }

  mobileToggle.addEventListener('click', ()=>{
    mobileNav.classList.contains('is-open') ? closeDrawer() : openDrawer();
  });
  drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e=>{
    if(e.key !== 'Escape' || !mobileNav.classList.contains('is-open')) return;
    drawerBody.classList.contains('is-sub') ? closeSubmenu() : closeDrawer();
  });

  // swipe-right: back out of a submenu, or close the drawer from the root
  let touchStartX = 0, touchDeltaX = 0, dragging = false;
  mobileNav.addEventListener('touchstart', e=>{
    touchStartX = e.touches[0].clientX;
    dragging = true;
    mobileNav.style.transition = 'none';
  }, {passive:true});
  mobileNav.addEventListener('touchmove', e=>{
    if(!dragging) return;
    touchDeltaX = Math.max(0, e.touches[0].clientX - touchStartX);
    mobileNav.style.transform = `translateX(${touchDeltaX}px)`;
  }, {passive:true});
  mobileNav.addEventListener('touchend', ()=>{
    dragging = false;
    mobileNav.style.transition = '';
    mobileNav.style.transform = '';
    if(touchDeltaX > 90){
      drawerBody.classList.contains('is-sub') ? closeSubmenu() : closeDrawer();
    }
    touchDeltaX = 0;
  });



  
});