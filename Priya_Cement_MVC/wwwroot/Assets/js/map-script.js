document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.map-outer-warapper');
  const states = document.querySelectorAll('.map-state');
  const items = document.querySelectorAll('.map-item');

  // Touch/no-mouse devices get inconsistent synthetic mouseenter events
  // for SVG elements (especially plain <path> state shapes) — rather
  // than chase that, skip hover-driven open/close there entirely and
  // rely solely on the click handlers (step 4), which map reliably to
  // touchend on mobile. Desktop/mouse devices are unaffected.
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

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

  // Tracks whichever location is "sticky" (click-selected, or the
  // default-open one) — the only thing that keeps the red .active fill
  // and the has-active dimming of other states after the mouse moves
  // away. Read/cleared by showInfoCard() so hovering a different pin
  // doesn't leave the old sticky one stuck highlighted underneath it.
  let stickyActiveLocation = null;

  function clearAllActive() {
    states.forEach((s) => s.classList.remove('active'));
    items.forEach((i) => i.classList.remove('active', 'linked-active'));
    wrapper.classList.remove('has-active');
    stickyActiveLocation = null;
  }

  function activateLocation(location) {
    clearAllActive();

    const state = getStateByLocation(location);
    const item = getItemByLocation(location);

    if (state) state.classList.add('active');   // <-- map-state gets "active" class here
    if (item) item.classList.add('linked-active');

    wrapper.classList.add('has-active');
    stickyActiveLocation = location;
  }

  // ---------- Hover/tap info card ----------
  // Card content is static HTML per region (written directly in the
  // .cshtml, tagged data-location="..."). This script only ever shows,
  // hides and positions whichever card matches the hovered pin/state —
  // it never builds or fills in markup.
  const mapInsideWrapper = document.querySelector('.map-inside-wrapper');
  const infoCards = document.querySelectorAll('.map-info-card');
  const svgEl = mapInsideWrapper && mapInsideWrapper.querySelector('svg');
  let hideCardTimer = null;
  let activeInfoCard = null;
  let linkedState = null; // the .map-state currently carrying "hover-linked", kept in sync with the card
  let openItem = null; // the .map-item currently carrying "card-open", kept in sync with the card

  function getInfoCardByLocation(location) {
    return Array.from(infoCards).find(
      (card) => card.getAttribute('data-location') === location
    );
  }

  function positionInfoCard(card, circle) {
    if (!card || !svgEl || !mapInsideWrapper) return;

    const cx = parseFloat(circle.getAttribute('cx'));
    const cy = parseFloat(circle.getAttribute('cy'));
    const svgRect = svgEl.getBoundingClientRect();
    const wrapRect = mapInsideWrapper.getBoundingClientRect();
    const viewBox = svgEl.viewBox.baseVal;
    const scale = svgRect.width / (viewBox.width || 689);

    const pinX = svgRect.left - wrapRect.left + cx * scale;
    const pinY = svgRect.top - wrapRect.top + cy * scale;

    const cardRect = card.getBoundingClientRect();
    const cardWidth = cardRect.width || 240;
    const cardHeight = cardRect.height || 200;
    const gap = 16;

    // Flip horizontally if the card would overflow the wrapper's right edge
    let left = pinX + gap;
    if (left + cardWidth > wrapRect.width) {
      left = pinX - cardWidth - gap;
    }
    left = Math.max(8, left);

    // Prefer showing above the pin; flip below if too close to the top
    let top = pinY - cardHeight - gap;
    if (top < 8) {
      top = pinY + gap;
    }

    card.style.left = left + 'px';
    card.style.top = top + 'px';
  }

  // Single source of truth: .map-state carries "hover-linked" exactly
  // when its linked info card is visible — no matter whether a pin
  // hover, a state hover, or a click is what opened it.
  function linkStateToCard(location) {
    const state = getStateByLocation(location) || null;
    if (linkedState && linkedState !== state) {
      linkedState.classList.remove('hover-linked');
    }
    linkedState = state;
    if (linkedState) linkedState.classList.add('hover-linked');
  }

  function unlinkState() {
    if (!linkedState) return;
    linkedState.classList.remove('hover-linked');
    linkedState = null;
  }

  // Same idea, but on the pin itself: guarantees the dot gets a visibly
  // different fill (see .map-item.card-open .map-hover in map-style.css)
  // whenever its card is open — instead of depending on whichever of
  // :hover / linked-hover / active happened to also be set.
  function markItemOpen(item) {
    if (openItem && openItem !== item) {
      openItem.classList.remove('card-open');
    }
    openItem = item;
    if (openItem) openItem.classList.add('card-open');
  }

  function unmarkItemOpen() {
    if (!openItem) return;
    openItem.classList.remove('card-open');
    openItem = null;
  }

  function showInfoCard(item) {
    const circle = item.querySelector('.map-hover');
    const location = circle && circle.getAttribute('data-location');
    const card = location && getInfoCardByLocation(location);
    if (!card) return;

    // A different location is being shown (hover or click) — drop the
    // old sticky/default-open highlight so it doesn't stay lit up
    // underneath whatever's being previewed now.
    if (stickyActiveLocation && stickyActiveLocation !== location) {
      clearAllActive();
    }

    if (activeInfoCard && activeInfoCard !== card) {
      activeInfoCard.classList.remove('is-visible');
      activeInfoCard.setAttribute('aria-hidden', 'true');
    }

    clearTimeout(hideCardTimer);
    activeInfoCard = card;
    card.classList.add('is-visible');
    card.setAttribute('aria-hidden', 'false');
    linkStateToCard(location);
    markItemOpen(item);
    requestAnimationFrame(() => positionInfoCard(card, circle));
  }

  function scheduleHideInfoCard() {
    clearTimeout(hideCardTimer);
    hideCardTimer = setTimeout(() => {
      if (activeInfoCard) {
        activeInfoCard.classList.remove('is-visible');
        activeInfoCard.setAttribute('aria-hidden', 'true');
        activeInfoCard = null;
      }
      unlinkState();
      unmarkItemOpen();
    }, 150);
  }

  if (infoCards.length) {
    infoCards.forEach((card) => {
      card.addEventListener('mouseenter', () => clearTimeout(hideCardTimer));
      card.addEventListener('mouseleave', scheduleHideInfoCard);
    });

    // Tap outside (mobile) closes the open card
    document.addEventListener('click', (e) => {
      if (!activeInfoCard) return;
      if (
        activeInfoCard.contains(e.target) ||
        e.target.closest('.map-item') ||
        e.target.closest('.map-state')
      ) return;
      activeInfoCard.classList.remove('is-visible');
      activeInfoCard.setAttribute('aria-hidden', 'true');
      activeInfoCard = null;
      unlinkState();
      unmarkItemOpen();
    });

    items.forEach((item) => {
      const circle = item.querySelector('.map-hover');
      const location = circle && circle.getAttribute('data-location');
      if (location && getInfoCardByLocation(location)) {
        item.classList.add('has-info-card');
      }
    });
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
  // (desktop/mouse only — see isTouchDevice note above)
  if (!isTouchDevice) items.forEach((item) => {
    const circle = item.querySelector('.map-hover');
    const location = circle?.getAttribute('data-location');
    if (!location) return;

    item.addEventListener('mouseenter', () => {
      showInfoCard(item); // also links/unlinks the matching .map-state's hover-linked class
    });

    item.addEventListener('mouseleave', () => {
      scheduleHideInfoCard();
    });
  });

  // ---------- 3. State hover -> highlight linked pin/line/label ----------
  // (desktop/mouse only — see isTouchDevice note above)
  if (!isTouchDevice) states.forEach((state) => {
    const location = state.getAttribute('data-location');

    state.addEventListener('mouseenter', () => {
      const item = getItemByLocation(location);
      if (item) {
        item.classList.add('linked-hover');
        showInfoCard(item);
      }
    });

    state.addEventListener('mouseleave', () => {
      const item = getItemByLocation(location);
      if (item) item.classList.remove('linked-hover');
      scheduleHideInfoCard();
    });
  });

  // ---------- 4. Click on state OR pin -> toggle active class for both ----------
  states.forEach((state) => {
    state.addEventListener('click', () => {
      const location = state.getAttribute('data-location');
      const isAlreadyActive = state.classList.contains('active');

      if (isAlreadyActive) {
        clearAllActive();
        scheduleHideInfoCard();
      } else {
        activateLocation(location);
        const item = getItemByLocation(location);
        if (item) showInfoCard(item);
        console.log('Selected:', location);
      }
    });
  });

  items.forEach((item) => {
    const circle = item.querySelector('.map-hover');
    if (!circle) return;

    circle.addEventListener('click', (e) => {
      e.stopPropagation();
      const location = circle.getAttribute('data-location');
      const isAlreadyActive = item.classList.contains('linked-active');

      if (isAlreadyActive) {
        clearAllActive();
        scheduleHideInfoCard();
      } else {
        activateLocation(location);
        showInfoCard(item);
        console.log('Selected:', location);
      }
    });
  });

  // ---------- 5. Default-open pin ----------
  // Telangana starts pre-selected, exactly as if it had been clicked —
  // stays open until the user clicks it again, clicks elsewhere, or
  // hovers a different pin/state.
  const DEFAULT_OPEN_LOCATION = 'Telangana';
  if (DEFAULT_OPEN_LOCATION) {
    const defaultItem = getItemByLocation(DEFAULT_OPEN_LOCATION);
    if (defaultItem) {
      activateLocation(DEFAULT_OPEN_LOCATION);
      showInfoCard(defaultItem);
    }
  }
});