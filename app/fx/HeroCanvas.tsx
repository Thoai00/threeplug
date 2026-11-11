"use client";

/**
 * HeroCanvas — mounts the WebGL hero scene (see heroScene.ts).
 *
 *  · three.js is fetched with a dynamic import() once the browser is idle,
 *    so it never blocks first paint; the CSS gradient behind it is the
 *    fallback while it loads and if WebGL is unavailable.
 *  · The render loop only runs while the hero is on screen and the tab is
 *    visible.
 *  · Under prefers-reduced-motion a single still frame is drawn.
 */

import { useEffect, useRef, useState } from "react";
import type { HeroScene } from "./heroScene";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scene: HeroScene | null = null;
    let disposed = false;
    let inView = true;

    const sync = () => {
      if (!scene) return;
      if (reduce) { scene.renderOnce(); return; }
      if (inView && !document.hidden) scene.start();
      else scene.stop();
    };

    const boot = async () => {
      try {
        const { createHeroScene } = await import("./heroScene");
        if (disposed) return;
        scene = createHeroScene(canvas);
        scene.resize(host.clientWidth, host.clientHeight);
        onScroll();
        sync();
        setOn(true);
      } catch {
        // No WebGL (or the chunk failed): the CSS backdrop stays as the hero art.
      }
    };

    // Safari has no requestIdleCallback; a short timeout does the same job there.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle
      ? window.requestIdleCallback(() => { void boot(); }, { timeout: 1500 })
      : window.setTimeout(() => { void boot(); }, 200);

    const ro = new ResizeObserver(() => {
      scene?.resize(host.clientWidth, host.clientHeight);
      if (reduce) scene?.renderOnce();
    });
    ro.observe(host);

    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { threshold: 0 });
    io.observe(host);

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      scene?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    function onScroll() {
      const h = host!.offsetHeight || 1;
      scene?.setScroll(window.scrollY / h);
    }
    const onVisibility = () => sync();

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      disposed = true;
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      scene?.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={`hero-canvas ${on ? "is-on" : ""}`} aria-hidden="true" />;
}
