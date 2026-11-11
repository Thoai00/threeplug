"use client";

/**
 * Tilt — a card that leans toward the pointer in 3D, with a soft light
 * that follows the pointer across its surface. Both are transforms: the
 * card rotates, the light is a pre-rendered radial disc that is moved,
 * never repainted. Inert on touch devices and under reduced motion.
 *
 * Renders a plain <div>, so it can be the card element itself (children
 * that measure `parentElement`, like CaseLabel, keep working).
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";

type TiltProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Maximum lean in degrees. */
  max?: number;
  /** Shown inside the custom cursor while hovering. */
  cursor?: string;
};

export default function Tilt({ children, max = 5, cursor, className, ...rest }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(el, { transformPerspective: 1100 });
    const rotX = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
    const rotY = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
    const glowX = gsap.quickTo(glow, "x", { duration: 0.35, ease: "power3" });
    const glowY = gsap.quickTo(glow, "y", { duration: 0.35, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      rotY((px - 0.5) * 2 * max);
      rotX((0.5 - py) * 2 * max);
      glowX(e.clientX - r.left);
      glowY(e.clientY - r.top);
    };
    const onLeave = () => { rotX(0); rotY(0); };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf([el, glow]);
    };
  }, [max]);

  return (
    <div ref={ref} className={`tilt ${className ?? ""}`} data-cursor={cursor} {...rest}>
      <div ref={glowRef} className="tilt-glow" aria-hidden="true" />
      {children}
    </div>
  );
}
