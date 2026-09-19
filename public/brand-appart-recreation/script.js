/* ─────────────────────────────────────────────
   LENIS — smooth, inertial scroll
───────────────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

let scrollY = window.scrollY;
lenis.on("scroll", ({ scroll }) => {
  scrollY = scroll;
});

/* ─────────────────────────────────────────────
   SECTION 1 — ring rotation + hover scale
───────────────────────────────────────────── */
const ringHeading = document.getElementById("ringHeading");
const ringScaleWrap = document.getElementById("ringScaleWrap");
const ringRotateWrap = document.getElementById("ringRotateWrap");

const RING_SPEED = 0.06; // deg per px scrolled

function updateRing() {
  const deg = scrollY * RING_SPEED;
  // Instant, per-frame write — no CSS transition on this layer, so it
  // tracks Lenis's already-smoothed scroll value 1:1 with zero extra lag.
  ringRotateWrap.style.transform = `rotate(${deg}deg)`;
}

ringHeading.addEventListener("mouseenter", () => {
  ringScaleWrap.classList.add("is-shrunk");
});
ringHeading.addEventListener("mouseleave", () => {
  ringScaleWrap.classList.remove("is-shrunk");
});

/* ─────────────────────────────────────────────
   SECTION 2 — fanned testimonial cards
───────────────────────────────────────────── */
const fanSection = document.getElementById("fanSection");
const fanCards = Array.from(document.querySelectorAll(".fan-card"));

// Resting "hand of cards" arc — rotation -9deg..+3.5deg, with a small
// x pull-together (creates the overlap) and a small y arc lift.
const BASE_FAN = [
  { rot: -9,   x: 168, y: 24 },
  { rot: -4.5, x: 84,  y: 10 },
  { rot: 0,    x: 0,   y: 0  },
  { rot: 2,    x: -84, y: 10 },
  { rot: 3.5,  x: -168,y: 24 },
];

let hoveredIndex = -1;

function fanScaleFactor() {
  // Shrink the pull-together distance on narrow viewports so cards
  // don't overflow the row.
  return window.innerWidth < 900 ? 0.55 : 1;
}

function restState(i) {
  const b = BASE_FAN[i];
  const f = fanScaleFactor();
  return { rot: b.rot, x: b.x * f, y: b.y * f, scale: 1, z: 10 - Math.abs(2 - i) };
}

function hoverState(i, hovered) {
  const b = BASE_FAN[i];
  const f = fanScaleFactor();
  if (i === hovered) {
    return { rot: 0, x: b.x * f, y: -30, scale: 1.06, z: 50 };
  }
  const dir = i < hovered ? -1 : 1;
  return { rot: b.rot, x: b.x * f + dir * 70 * f, y: b.y * f, scale: 1, z: 10 - Math.abs(2 - i) };
}

function applyFanState(i, state) {
  const card = fanCards[i];
  card.style.zIndex = state.z;
  card.style.transform =
    `translateX(${state.x}px) translateY(${state.y}px) rotate(${state.rot}deg) scale(${state.scale})`;
}

function setFanRest() {
  fanCards.forEach((_, i) => applyFanState(i, restState(i)));
}

fanCards.forEach((card, i) => {
  card.addEventListener("mouseenter", () => {
    hoveredIndex = i;
    fanCards.forEach((_, j) => applyFanState(j, hoverState(j, i)));
  });
  card.addEventListener("mouseleave", () => {
    hoveredIndex = -1;
    setFanRest();
  });
});

setFanRest();
window.addEventListener("resize", () => {
  if (hoveredIndex === -1) setFanRest();
});

// Scroll-driven wobble — lives on the INNER .fan-card__scroll layer so it
// never fights the hover transform's CSS transition on the outer .fan-card.
function updateFanWobble() {
  const rect = fanSection.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  const progress = 1 - Math.min(1, Math.max(0, rect.top / vh));

  fanCards.forEach((card, i) => {
    const scrollLayer = card.querySelector(".fan-card__scroll");
    const wobbleRot = Math.sin(progress * Math.PI * 2 + i * 0.9) * 1.4;
    const wobbleY = Math.cos(progress * Math.PI * 2 + i * 0.9) * 4;
    scrollLayer.style.transform = `rotate(${wobbleRot}deg) translateY(${wobbleY}px)`;
  });
}

/* ─────────────────────────────────────────────
   SHARED rAF LOOP — drives Lenis + both sections
───────────────────────────────────────────── */
function raf(time) {
  lenis.raf(time);
  updateRing();
  updateFanWobble();
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
