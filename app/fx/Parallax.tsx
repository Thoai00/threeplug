"use client";

/**
 * Parallax — drifts its children vertically as the element crosses the
 * viewport (scrubbed by ScrollTrigger, transform only). `speed` is the
 * share of the viewport height travelled: positive moves with the scroll
 * (feels further away), negative against it (feels closer).
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Parallax({
  children, speed = 0.12, className, style,
}: { children?: React.ReactNode; speed?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el,
        { y: () => -window.innerHeight * speed },
        {
          y: () => window.innerHeight * speed,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
        },
      );
    });
    return () => mm.revert();
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform", ...style }}>
      {children}
    </div>
  );
}
