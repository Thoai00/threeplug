"use client";

// Scroll-reveal primitives shared by every page. Each one only toggles an
// `is-in` class the first time it scrolls into view; the motion itself is
// CSS in globals.css (transform + opacity only), which is also where
// prefers-reduced-motion and the no-script fallback switch it all off.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useReducedMotion = () =>
  useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED_QUERY).matches, () => false);

// Fires once when the element scrolls into view.
function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold, rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(" ");

/** Fades up into place. */
export function Reveal({ children, delay = 0, y = 36, className, style }: { children: React.ReactNode; delay?: number; y?: number; className?: string; style?: React.CSSProperties }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <div
      ref={ref}
      className={cx("rv", inView && "is-in", className)}
      style={{ ...style, "--rv-d": `${delay}s`, "--rv-y": `${y}px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

type TextTag = "h1" | "h2" | "h3" | "p" | "div";

/** Split text: each word (or letter) rises out of its own mask, staggered. */
export function RevealWords({ text, as: Tag = "h2", by = "word", stagger = 0.06, delay = 0, className, style }: { text: string; as?: TextTag; by?: "word" | "char"; stagger?: number; delay?: number; className?: string; style?: React.CSSProperties }) {
  const { ref, inView } = useInView<HTMLHeadingElement>(0.3);
  const parts = by === "char" ? [...text] : text.split(" ");
  return (
    <Tag ref={ref as React.Ref<never>} className={cx("sp", inView && "is-in", className)} style={style} aria-label={text}>
      {parts.map((part, i) => (
        <span key={i} aria-hidden="true" className="mask">
          <span className="mask-in" style={{ transitionDelay: `${delay + i * stagger}s` }}>
            {/* non-breaking: a plain trailing space collapses at the edge of an inline-block */}
            {part === " " ? "\u00A0" : part}
            {by === "word" && i < parts.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Split lines: each line rises out of its own mask. Lines can hold markup
 *  (a muted second line, an inline icon), which RevealWords cannot. */
export function RevealLines({ lines, as: Tag = "h2", stagger = 0.1, delay = 0, className, style }: { lines: React.ReactNode[]; as?: TextTag; stagger?: number; delay?: number; className?: string; style?: React.CSSProperties }) {
  const { ref, inView } = useInView<HTMLHeadingElement>(0.3);
  return (
    <Tag ref={ref as React.Ref<never>} className={cx("sp", inView && "is-in", className)} style={style}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span className="mask-in" style={{ transitionDelay: `${delay + i * stagger}s` }}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Media is uncovered from the bottom while it settles from a zoom —
 *  two counter-moving transforms rather than an animated clip-path. */
export function RevealMedia({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <div ref={ref} className={cx("mr", inView && "is-in", className)} style={style}>
      <div className="mr-a">
        <div className="mr-b">{children}</div>
      </div>
    </div>
  );
}

/** "500+" counts 0 → 500 and keeps the "+" suffix. */
export function CountUp({ value, className, style }: { value: string; className?: string; style?: React.CSSProperties }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5);
  const reduced = useReducedMotion();
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
    <span ref={ref} className={cx("tabular-nums", className)} style={style}>
      {numeric ? `${reduced ? target : n}${suffix}` : value}
    </span>
  );
}
