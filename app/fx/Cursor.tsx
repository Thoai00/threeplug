"use client";

/**
 * Cursor — a ring that trails the pointer and a dot that sits on it.
 *
 * The ring reacts to what is underneath:
 *   · links / buttons            → grows and tints
 *   · [data-cursor="Label"]      → becomes a filled disc showing that label
 * It is an addition to the native cursor, not a replacement, so nothing is
 * lost if it fails to mount. Mounted once in the root layout; skipped on
 * touch devices and under prefers-reduced-motion.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary, label';

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot || !label) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2" });

    let shown = false;
    const show = (on: boolean) => {
      if (shown === on) return;
      shown = on;
      gsap.to([ring, dot], { opacity: on ? 1 : 0, duration: 0.3, overwrite: "auto" });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        // First sighting: jump there instead of sweeping in from the corner.
        gsap.set([ring, dot], { x: e.clientX, y: e.clientY });
      }
      show(true);
      ringX(e.clientX); ringY(e.clientY);
      dotX(e.clientX); dotY(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest) return;
      const labelled = target.closest<HTMLElement>("[data-cursor]");
      const text = labelled?.dataset.cursor;
      if (text) label.textContent = text;
      ring.classList.toggle("is-label", Boolean(text));
      ring.classList.toggle("is-link", !text && Boolean(target.closest(INTERACTIVE)));
    };

    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");
    const onLeave = () => show(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf([ring, dot]);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor" aria-hidden="true">
        <div className="cursor-ring" />
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
