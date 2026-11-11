"use client";

import { createContext, useContext, useEffect, useRef, type RefObject } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

/** Access the single global Lenis instance via a stable ref — e.g. to call
 *  .stop()/.start() around the full-screen menu so the page underneath can't
 *  scroll. Returns null before the instance exists (SSR/first paint) and
 *  under prefers-reduced-motion, where the page uses native scrolling; read
 *  `.current` inside an event handler or effect, not render. */
export function useLenis() {
  return useContext(LenisContext);
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const firstPath = useRef(true);

  useEffect(() => {
    // Smooth scrolling is motion: with reduced motion the browser scrolls natively.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let instance: Lenis | null = null;
    const driveLenis = (time: number) => instance?.raf(time * 1000);

    const mount = () => {
      if (reduce.matches || instance) return;
      instance = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        // Same-page #anchors (nav, CTAs) glide instead of jumping.
        anchors: true,
      });
      lenisRef.current = instance;

      // Standard Lenis + GSAP ScrollTrigger bridge: GSAP's ticker drives
      // Lenis's raf, and ScrollTrigger re-measures on every Lenis scroll
      // event, so scrubbed sections read the smoothed position.
      instance.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(driveLenis);
      gsap.ticker.lagSmoothing(0);
    };
    const unmount = () => {
      if (!instance) return;
      gsap.ticker.remove(driveLenis);
      instance.destroy();
      instance = null;
      lenisRef.current = null;
    };
    const onPreference = () => (reduce.matches ? unmount() : mount());

    mount();
    reduce.addEventListener("change", onPreference);

    // Webfonts change line breaks, which moves every trigger below them.
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

    return () => {
      reduce.removeEventListener("change", onPreference);
      unmount();
    };
  }, []);

  // Route change: start the new page at the top (or at its #hash), then
  // re-measure every trigger against the new document.
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    const raf = requestAnimationFrame(() => {
      const lenis = lenisRef.current;
      lenis?.resize();
      ScrollTrigger.refresh();
      const hash = window.location.hash;
      const target = hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      if (target) {
        if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
        else target.scrollIntoView();
      } else if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}
