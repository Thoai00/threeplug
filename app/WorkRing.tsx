"use client";

/**
 * WorkRing — "See more work" scroll-reactive card ring.
 *
 * 10 gradient tiles sit at rotate(i*36deg) + translateY(-radius) around a
 * centered "See more work" heading link, then counter-rotate by -i*36deg
 * so each tile's own art stays upright in its slot. The whole ring spins
 * as the page scrolls (one scrubbed ScrollTrigger tween on
 * .ring-rotate-wrap, active only while the section is on screen — Lenis,
 * mounted globally in LenisProvider, already gives the scroll its
 * inertia). Hovering the heading shrinks the ring toward center via a
 * SEPARATE parent layer (.ring-scale-wrap, CSS-transitioned) so the
 * continuous scroll rotation and the discrete hover scale never fight
 * over the same transform.
 *
 * The Bidyaloy.academy recording plays in RING_VIDEO_SLOTS (three evenly
 * spaced tiles, not all ten, to avoid ten simultaneous video decodes); the
 * rest still use RING_ART gradients.
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AutoVideo from "./AutoVideo";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const RING_COUNT = 10;
const RING_TURN = 150; // degrees turned while the section crosses the viewport

const RING_ART = [
  "linear-gradient(160deg, #cdeeff, var(--brand-light) 55%, var(--brand-deep))",
  "linear-gradient(160deg, #2a3446, var(--panel))",
  "radial-gradient(120% 120% at 30% 20%, #ffffff, var(--grey) 60%, var(--panel))",
  "linear-gradient(160deg, var(--panel-2), #1d2a3f)",
  "linear-gradient(160deg, var(--brand-light), var(--brand-deep))",
  "radial-gradient(120% 120% at 70% 20%, #ffffff, #9fb4c9 55%, var(--grey))",
  "linear-gradient(160deg, var(--brand-sky), var(--brand-mid))",
  "linear-gradient(160deg, #1d2a3f, var(--panel))",
  "radial-gradient(120% 120% at 30% 80%, var(--brand-sky), var(--brand-mid) 60%, var(--panel))",
  "linear-gradient(160deg, var(--grey), var(--panel-2))",
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
  const sectionRef = useRef<HTMLElement>(null);

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
    const el = rotateRef.current;
    const section = sectionRef.current;
    if (!el || !section) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { rotation: -RING_TURN / 2 }, {
        rotation: RING_TURN / 2,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
    return () => ctx.revert();
  }, [useSimple]);

  if (useSimple) {
    return (
      <section className="relative overflow-hidden border-t border-line py-24 text-center" style={{ background: "var(--bg-soft)" }}>
        <Link href="/work" className="display" style={{ fontSize: "clamp(3rem, 11vw, 4.5rem)", color: "var(--ink)" }}>
          See more<br />work
        </Link>
        <StaticRingGrid />
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative border-t border-line" style={{ minHeight: "100vh", background: "var(--bg-soft)" }}>
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ background: "radial-gradient(45% 45% at 50% 50%, rgba(10,144,216,0.22), transparent 70%)" }} />
        <Link
          href="/work"
          data-cursor="All work"
          className="display relative z-10 select-none text-center"
          style={{
            fontSize: "clamp(3.2rem, 9.5vw, 6.25rem)",
            lineHeight: 0.84,
            color: hovered ? "var(--ink)" : "var(--grey)",
            transition: "color 0.64s var(--ease-flyout)",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
        >
          See more<br />work
        </Link>

        <div className="ring-scale-wrap" style={{ transform: hovered ? "scale(0.82)" : "scale(1)" }} aria-hidden="true">
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
