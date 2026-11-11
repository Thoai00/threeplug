"use client";

/**
 * Magnetic — wraps a button or link so it leans toward the pointer and
 * springs back when the pointer leaves. Transform-only; inert on touch
 * devices and under prefers-reduced-motion.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Magnetic({
  children, strength = 0.32, className,
}: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.45, ease: "power3.out", overwrite: true });
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.38)", overwrite: true });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  return (
    <span ref={ref} className={`inline-block ${className ?? ""}`} style={{ willChange: "transform" }}>
      {children}
    </span>
  );
}
