"use client";

import { createContext, useContext, useEffect, useRef, type RefObject } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

/** Access the single global Lenis instance via a stable ref — e.g. to call
 *  .stop()/.start() around a modal/overlay so it can't smooth-scroll the
 *  page underneath. Returns null before the instance exists (SSR/first
 *  paint); read `.current` inside an event handler or effect, not render. */
export function useLenis() {
  return useContext(LenisContext);
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      lerp: 0.1,
      duration: 1.1,
      smoothWheel: true,
    });
    lenisRef.current = instance;

    // Standard Lenis + GSAP ScrollTrigger bridge: let GSAP's own ticker
    // drive Lenis's raf (so anything animated by GSAP reads scroll on the
    // same tick), and tell ScrollTrigger to re-measure on every Lenis
    // scroll event so pinned/scrubbed sections (see ShipDeck.tsx) stay in
    // lockstep with Lenis's smoothed position instead of native scroll.
    instance.on("scroll", ScrollTrigger.update);

    const driveLenis = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(driveLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(driveLenis);
      instance.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}
