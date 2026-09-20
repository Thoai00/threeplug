"use client";

/**
 * WorkRing — "See more work" scroll-reactive card ring.
 *
 * 10 gradient tiles sit at rotate(i*36deg) + translateY(-radius) around a
 * centered "See more work" heading link, then counter-rotate by -i*36deg
 * so each tile's own art stays upright in its slot. The whole ring spins
 * as the page scrolls (rotation is written to .ring-rotate-wrap every
 * frame, no CSS transition on that layer, so it tracks scroll 1:1 — Lenis,
 * mounted globally in LenisProvider, already gives window.scrollY its
 * inertia). Hovering the heading shrinks the ring toward center via a
 * SEPARATE parent layer (.ring-scale-wrap, CSS-transitioned) so the
 * continuous scroll rotation and the discrete hover scale never fight
 * over the same transform.
 *
 * The Bidyaloy.academy recording plays in RING_VIDEO_SLOTS (three evenly
 * spaced tiles, not all ten, to avoid ten simultaneous video decodes); the
 * rest still use RING_ART gradients.
 */

import { useEffect, useRef, useState } from "react";
import AutoVideo from "./AutoVideo";

const RING_COUNT = 10;
const RING_SPEED = 0.06; // deg rotated per px scrolled

const RING_ART = [
  "linear-gradient(160deg, #cdeeff, var(--brand-light) 55%, var(--brand-deep))",
  "linear-gradient(160deg, var(--grey), #3a332e)",
  "radial-gradient(120% 120% at 30% 20%, #ffffff, var(--grey) 60%, var(--ink))",
  "linear-gradient(160deg, var(--ink), #3a332e)",
  "linear-gradient(160deg, var(--brand-light), var(--brand-deep))",
  "radial-gradient(120% 120% at 70% 20%, #ffffff, var(--low) 55%, var(--grey))",
  "linear-gradient(160deg, #ffffff, var(--bg-d))",
  "linear-gradient(160deg, #3a332e, var(--ink))",
  "radial-gradient(120% 120% at 30% 80%, var(--brand-sky), var(--brand-mid) 60%, var(--ink))",
  "linear-gradient(160deg, var(--grey), var(--ink))",
];

const RING_VIDEO = { src: "/bidyaloy/bidyaloy.mp4", poster: "/bidyaloy/bidyaloy-poster.jpg" };
const RING_VIDEO_SLOTS = new Set([0, 3, 7]);

function RingCard({ index }: { index: number }) {
  return (
    <div className="ring-card" style={{ "--i": index } as React.CSSProperties}>
      <div className="ring-card__inner" style={{ "--i": index } as React.CSSProperties}>
        <div className="ring-art" style={{ background: RING_ART[index % RING_ART.length] }}>
          {RING_VIDEO_SLOTS.has(index) && (
            <AutoVideo src={RING_VIDEO.src} poster={RING_VIDEO.poster} className="absolute inset-0 h-full w-full object-cover" />
          )}
        </div>
      </div>
    </div>
  );
}

function StaticRingGrid() {
  return (
    <div className="mx-auto grid max-w-3xl grid-cols-4 gap-3 px-6 py-12 sm:grid-cols-5">
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg"
          style={{ background: RING_ART[i % RING_ART.length] }}>
          {RING_VIDEO_SLOTS.has(i) && (
            <AutoVideo src={RING_VIDEO.src} poster={RING_VIDEO.poster} className="absolute inset-0 h-full w-full object-cover" />
          )}
        </div>
      ))}
    </div>
  );
}

export default function WorkRing() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hovered, setHovered] = useState(false);
  const rotateRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const useSimple = reduceMotion;

  useEffect(() => {
    if (useSimple) return;
    const onScroll = () => { scrollYRef.current = window.scrollY; };
    const tick = () => {
      const el = rotateRef.current;
      if (el) el.style.transform = `rotate(${scrollYRef.current * RING_SPEED}deg)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [useSimple]);

  if (useSimple) {
    return (
      <section data-theme="dark" className="relative overflow-hidden py-24 text-center" style={{ background: "var(--ink)" }}>
        <a href="#work" className="font-display font-black leading-[0.85] tracking-tight" style={{ fontSize: "clamp(3rem, 11vw, 4.5rem)", color: "var(--grey)" }}>
          See more<br />work
        </a>
        <StaticRingGrid />
      </section>
    );
  }

  return (
    <section data-theme="dark" className="relative" style={{ minHeight: "100vh", background: "var(--ink)", overflow: "visible" }}>
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        <a
          href="#work"
          className="relative z-10 select-none text-center font-display font-black leading-[0.8] tracking-tight"
          style={{
            fontSize: "clamp(3.2rem, 9.5vw, 5.75rem)",
            color: hovered ? "var(--bg)" : "var(--grey)",
            transition: "color 0.64s var(--ease-flyout)",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          See more<br />work
        </a>

        <div className="ring-scale-wrap" style={{ transform: hovered ? "scale(0.8)" : "scale(1)" }} aria-hidden="true">
          <div ref={rotateRef} className="ring-rotate-wrap">
            {Array.from({ length: RING_COUNT }, (_, i) => (
              <RingCard key={i} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
