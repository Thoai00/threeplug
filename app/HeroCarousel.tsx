"use client";

/**
 * HeroCarousel — "Small team, big impact" 3D tornado.
 *
 * Layer 0: giant background wordmark ("big" / "impact"), z-0.
 * Layer 1: 8 photo cards positioned on a real 3D cylinder (rotateY(i*45deg)
 *          translateZ(radius) inside a perspective container) — front-facing
 *          cards read large and centered purely from perspective projection,
 *          no manual per-card scale faking is needed. The section pins
 *          (tall wrapper + `position: sticky`, same technique as ShipDeck
 *          and ShowreelPin in app/page.tsx) and scroll progress through that
 *          pinned range drives the ring's rotateY, so the cylinder slowly
 *          spins like a tornado as the user scrolls, continuously sweeping
 *          new faces across the text. z-10.
 * Layer 2: the "Small team," headline, z-20.
 *
 * Site chrome (logo, "Book a call" pill, icon rail, live clock) already renders
 * globally from Home() in app/page.tsx — it is intentionally NOT duplicated here.
 *
 * Color tokens: reuses the site's existing --bg / --ink / --accent custom
 * properties (defined in app/globals.css) plus the card gradient's own
 * #012A5E -> #0A90D8 stops, lifted straight from the logo's own gradient.
 *
 * Team photos: TEAM_IMAGES cycles /public/shanto.png, ara.png, sh.png across
 * the ring's 8 card slots (see `TornadoCard` and `StaticGrid`).
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue, useAnimationFrame } from "framer-motion";

const RING_COUNT = 8;
const STEP_DEG = 360 / RING_COUNT;
// A small per-card tilt so the ring reads as candid photos, not a perfect grid.
const TILT = [-4, 3, -2, 5, -3, 4, -5, 2];
// Per-card vertical stagger (px) — alternates cards up/down so the ring
// doesn't read as a flat, perfectly aligned row.
const OFFSET_Y = [-18, 16, -12, 22, -20, 14, -16, 20];
// Team photos, cycled across the 8 ring slots.
const TEAM_IMAGES = ["/shanto.png", "/ara.png", "/sh.png"];
// Idle auto-spin speed (deg/sec) applied when the user isn't actively scrolling.
const IDLE_SPIN_SPEED = 6;

const LAYOUT_BREAKPOINTS = {
  mobile: { radius: 220, perspective: 900, cardW: 108, cardH: 144 },
  tablet: { radius: 380, perspective: 1200, cardW: 130, cardH: 173 },
  desktop: { radius: 560, perspective: 1500, cardW: 152, cardH: 202 },
};

function TornadoCard({ index, width, height, radius }: { index: number; width: number; height: number; radius: number }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 overflow-hidden rounded-2xl shadow-xl"
      style={{
        width,
        height,
        marginLeft: -width / 2,
        marginTop: -height / 2,
        transform: `rotateY(${index * STEP_DEG}deg) translateZ(${radius}px) translateY(${OFFSET_Y[index % OFFSET_Y.length]}px) rotate(${TILT[index % TILT.length]}deg)`,
        background: "linear-gradient(180deg, #012A5E 0%, #0A90D8 45%, var(--bg) 100%)",
      }}
    >
      <Image
        src={TEAM_IMAGES[index % TEAM_IMAGES.length]}
        alt=""
        fill
        sizes={`${width}px`}
        className="object-cover"
      />
    </div>
  );
}

function StaticGrid() {
  return (
    <div className="mx-auto grid max-w-3xl grid-cols-4 gap-3 px-6">
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <div
          key={i}
          className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg"
          style={{
            background: "linear-gradient(180deg, #012A5E 0%, #0A90D8 45%, var(--bg) 100%)",
            transform: `translateY(${i % 2 === 0 ? -10 : 10}px)`,
          }}
        >
          <Image
            src={TEAM_IMAGES[i % TEAM_IMAGES.length]}
            alt=""
            fill
            sizes="25vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export default function HeroCarousel() {
  const reduceMotion = useReducedMotion();
  const [layout, setLayout] = useState(LAYOUT_BREAKPOINTS.desktop);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 640;
      setLayout(mobile ? LAYOUT_BREAKPOINTS.mobile : window.innerWidth < 1024 ? LAYOUT_BREAKPOINTS.tablet : LAYOUT_BREAKPOINTS.desktop);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const scrollRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  // Auto-spin the ring while the user isn't actively scrolling; scrolling
  // takes over rotation, and idle spin picks back up shortly after it stops.
  const idleRotate = useMotionValue(0);
  const isScrollingRef = useRef(false);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", () => {
      isScrollingRef.current = true;
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    });
    return () => {
      unsubscribe();
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [scrollYProgress]);

  useAnimationFrame((_, delta) => {
    if (reduceMotion || isScrollingRef.current) return;
    idleRotate.set(idleRotate.get() + (delta / 1000) * IDLE_SPIN_SPEED);
  });

  const ringRotate = useTransform([scrollRotate, idleRotate], (values: number[]) => values[0] + values[1]);

  const useSimple = reduceMotion;

  const Heading = (
    <div className="pointer-events-none relative z-20 px-6 text-center">
      <h2 className="font-display font-black tracking-tight" style={{ fontSize: "clamp(3.1rem, 9vw, 6rem)", color: "var(--ink)" }}>
        Small team,
      </h2>
    </div>
  );

  const WordmarkBg = (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 flex select-none flex-col items-center justify-center text-center font-display font-black leading-[0.82]"
      style={{ fontSize: "clamp(6rem, 22vw, 20rem)", color: "#9B9B93" }}
    >
      <span>big</span>
      <span>impact</span>
    </div>
  );

  if (useSimple) {
    return (
      <section className="relative overflow-hidden py-24" style={{ background: "var(--bg)" }}>
        {WordmarkBg}
        <div className="relative z-20 pb-10">{Heading}</div>
        <StaticGrid />
      </section>
    );
  }

  return (
    <section ref={wrapRef} className="relative z-10" style={{ height: "300vh" }}>
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-start overflow-hidden pt-8 sm:pt-10 md:pt-14" style={{ background: "var(--bg)" }}>
        {WordmarkBg}
        {Heading}

        {/* Layer 1 — 3D tornado ring (decorative; hidden from assistive tech) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center" aria-hidden="true" style={{ perspective: layout.perspective }}>
          <motion.div className="relative" style={{ width: 1, height: 1, transformStyle: "preserve-3d", rotateY: ringRotate }}>
            {Array.from({ length: RING_COUNT }, (_, i) => (
              <TornadoCard key={i} index={i} width={layout.cardW} height={layout.cardH} radius={layout.radius} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
