"use client";

/**
 * Intro — the page-load curtain.
 *
 * First visit of a session: a counter runs 0 → 100 over the brand mark,
 * the curtain lifts, and `data-ready` lands on <html>, which is what the
 * hero's `.gate` styles wait for before staggering in. Later navigations
 * and reloads in the same session skip straight to ready (an inline script
 * in the root layout sets the flags before first paint, so there is no
 * flash of curtain).
 *
 * Failsafes: CSS hides the curtain by itself after 7s, hides it outright
 * under prefers-reduced-motion, and a <noscript> rule reveals everything.
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "../LenisProvider";

const markReady = () => {
  document.documentElement.dataset.ready = "1";
  try { sessionStorage.setItem("tp-intro", "1"); } catch { /* private mode */ }
};

export default function Intro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const root = rootRef.current;
    const count = countRef.current;
    const bar = barRef.current;
    const seen = document.documentElement.dataset.intro === "seen";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduce || !root || !count || !bar) {
      markReady();
      const t = setTimeout(() => setGone(true), 0);
      return () => clearTimeout(t);
    }

    const state = { n: 0 };
    // Read the ref at call time: Lenis mounts after this effect has run.
    const resumeScroll = () => lenis?.current?.start();
    const tl = gsap.timeline({
      onComplete: () => {
        resumeScroll();
        ScrollTrigger.refresh();
        setGone(true);
      },
    });
    // Lenis is created in a parent effect, i.e. after this one — so lock
    // scrolling from inside the timeline rather than synchronously here.
    tl.add(() => lenis?.current?.stop(), 0.02);
    tl.to(state, {
      n: 100,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => { count.textContent = String(Math.round(state.n)).padStart(3, "0"); },
    })
      .to(bar, { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0)
      .add(() => {
        root.classList.add("is-done");
        markReady();
      }, "+=0.15")
      // hold the timeline open until the CSS curtain transition has finished
      .to({}, { duration: 1.1 });

    return () => {
      tl.kill();
      resumeScroll();
    };
  }, [lenis]);

  if (gone) return null;

  return (
    <div ref={rootRef} className="intro" aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="eyebrow"><span className="live-dot" />Three Plug</span>
        <span className="eyebrow">Software Solutions</span>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <Image
          src="/logo.png"
          alt=""
          width={500}
          height={500}
          priority
          className="h-28 w-28 object-contain md:h-40 md:w-40"
          style={{ filter: "brightness(0) invert(1)", animation: "floatY 3s ease-in-out infinite" }}
        />
      </div>

      <div>
        <div className="flex items-end justify-between">
          <span className="eyebrow">Loading experience</span>
          <span ref={countRef} className="display tabular-nums" style={{ fontSize: "clamp(4rem, 14vw, 11rem)", lineHeight: 0.8 }}>
            000
          </span>
        </div>
        <div className="mt-5 h-px w-full" style={{ background: "var(--line)" }}>
          <div ref={barRef} className="intro-bar h-full w-full" style={{ background: "var(--accent-hi)" }} />
        </div>
      </div>
    </div>
  );
}
