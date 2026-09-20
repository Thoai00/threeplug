"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useReducedMotion = () =>
  useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED_QUERY).matches, () => false);

// Fires once when the element scrolls into view. Under reduced motion the
// callers drop their transitions, so content simply appears in place.
function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold, rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView, reduced };
}

export function Reveal({ children, delay = 0, y = 36, className, style }: { children: React.ReactNode; delay?: number; y?: number; className?: string; style?: React.CSSProperties }) {
  const { ref, inView, reduced } = useInView<HTMLDivElement>(0.15);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : `translateY(${y}px)`,
        transition: reduced ? "none" : `opacity 0.9s ${EASE} ${delay}s, transform 1.1s ${EASE} ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// Each word (or letter) rises out of its own mask, staggered.
export function RevealWords({ text, as: Tag = "h2", by = "word", stagger = 0.06, delay = 0, className, style }: { text: string; as?: "h1" | "h2" | "p"; by?: "word" | "char"; stagger?: number; delay?: number; className?: string; style?: React.CSSProperties }) {
  const { ref, inView, reduced } = useInView<HTMLHeadingElement>(0.3);
  const parts = by === "char" ? [...text] : text.split(" ");
  return (
    <Tag ref={ref} className={className} style={style} aria-label={text}>
      {parts.map((part, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-top" style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}>
          <span
            className="inline-block"
            style={{
              transform: inView ? "none" : "translateY(110%)",
              transition: reduced ? "none" : `transform 1s ${EASE} ${delay + i * stagger}s`,
            }}
          >
            {part === " " ? " " : part}
            {by === "word" && i < parts.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}

// Media opens from a clipped, zoomed frame to full size.
export function RevealMedia({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const { ref, inView, reduced } = useInView<HTMLDivElement>(0.15);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        clipPath: inView ? "inset(0% 0% 0% 0% round 24px)" : "inset(10% 6% 10% 6% round 24px)",
        transition: reduced ? "none" : `clip-path 1.4s ${EASE}`,
      }}
    >
      <div
        className="h-full w-full"
        style={{ transform: inView ? "scale(1)" : "scale(1.12)", transition: reduced ? "none" : `transform 1.6s ${EASE}` }}
      >
        {children}
      </div>
    </div>
  );
}

// "500+" counts 0 → 500 and keeps the "+" suffix.
export function CountUp({ value, className, style }: { value: string; className?: string; style?: React.CSSProperties }) {
  const { ref, inView, reduced } = useInView<HTMLSpanElement>(0.5);
  const match = value.match(/^(\d+)(.*)$/);
  const numeric = match !== null;
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || !numeric || reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1600);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, target, numeric]);

  return (
    <span ref={ref} className={className} style={style}>
      {numeric ? `${reduced ? target : n}${suffix}` : value}
    </span>
  );
}
