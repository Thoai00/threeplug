"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MobileNav from "./MobileNav";

/* ─── SCROLL PROGRESS HOOK ─── */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

/* ─── RAIL / MENU ICONS ─── */
function RailGlyph({ name }: { name: "bag" | "building" | "target" | "smiley" | "docs" | "mail" }) {
  const p = { width: 23, height: 23, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "bag":      return <svg {...p}><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>;
    case "building": return <svg {...p}><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" /></svg>;
    case "target":   return <svg {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></svg>;
    case "smiley":   return <svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M8.5 14c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2" /><path d="M9 10h.01M15 10h.01" /></svg>;
    case "docs":     return <svg {...p}><rect x="4" y="4" width="12" height="16" rx="1.2" /><path d="M8 8h4M8 11.5h4M8 15h2" /></svg>;
    case "mail":     return <svg {...p}><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><path d="M4 6.5 12 13l8-6.5" /></svg>;
  }
}

const CHROME_LINKS: { id: string; label: string; icon: "bag" | "building" | "target" | "smiley" | "docs" | "mail" }[] = [
  { id: "work",     label: "Work",     icon: "docs" },
  { id: "process",  label: "Process",  icon: "building" },
  { id: "why",      label: "Why us",   icon: "target" },
  { id: "about",    label: "About us", icon: "smiley" },
  { id: "contact",  label: "Contact",  icon: "mail" },
];

/* ─── TOP BAR: logo + book-a-call pill ─── */
function TopBar({ dark }: { dark: boolean }) {
  return (
    <>
      <Link href="/#top" className="fixed left-4 top-4 z-[998] flex items-center md:left-6 md:top-6">
        <Image src="/logoh.png" alt="Three Plug — Software Solutions" width={377} height={251} priority
          className="h-9 w-auto drop-shadow-[0_2px_10px_rgba(20,18,16,0.12)] md:h-16"
          style={{ filter: dark ? "brightness(0) invert(1)" : "none", transition: "filter 0.4s ease" }} />
      </Link>
      <Link href="/#contact"
        className="fixed right-6 top-6 z-[998] hidden rounded-full px-5 py-3 text-[11px] font-bold uppercase tracking-wide transition-transform hover:scale-105 md:block"
        style={{ background: dark ? "#fbf9ef" : "var(--ink)", color: dark ? "var(--ink)" : "var(--bg)", transition: "background-color 0.4s ease, color 0.4s ease" }}>
        Book a call now
      </Link>
    </>
  );
}

/* ─── SERVICES MEGA-MENU DATA ─── */
export const SERVICE_MEGA = [
  { label: "Website Development", gradient: "linear-gradient(160deg, #cdeeff, var(--brand-light) 55%, var(--brand-deep))" },
  { label: "Web Applications",    gradient: "linear-gradient(160deg, var(--brand-light), var(--brand-deep))" },
  { label: "Mobile Applications", gradient: "linear-gradient(160deg, #0b4a42, #05221d)" },
  { label: "Desktop Software",    gradient: "linear-gradient(160deg, #3a332e, var(--ink))" },
  { label: "ERP Solutions",       gradient: "linear-gradient(160deg, #5a2a0f, #2a1206)" },
  { label: "CRM Solutions",       gradient: "linear-gradient(160deg, #4a1f42, #24101f)" },
  { label: "Digital Marketing",   gradient: "linear-gradient(160deg, #3a2a5e, #1a1230)" },
  { label: "Animation & Motion",  gradient: "linear-gradient(160deg, #5c1d2b, #2b0d14)" },
  { label: "Character Animation", gradient: "linear-gradient(160deg, var(--grey), var(--ink))" },
  { label: "3D Web Experience",   gradient: "radial-gradient(120% 120% at 30% 80%, var(--brand-sky), var(--brand-mid) 60%, var(--ink))" },
  { label: "3D Visualisation",    gradient: "linear-gradient(160deg, #07445c, #03202b)" },
  { label: "DevOps & Cloud",      gradient: "linear-gradient(160deg, #143a2a, #08190f)" },
];

/* ─── LEFT ICON RAIL — dock-style pointer magnetism ─── */
const RAIL_BASE = 68;
const RAIL_PEAK = 92;
const RAIL_SPREAD = 76;
const RAIL_GAP = 14;
const RAIL_RADIUS_RATIO = 0.32;
const RAIL_ICON_PEAK_SCALE = 1.25;
const RAIL_LEFT = 24; // matches left-6

function IconRail({ dark }: { dark: boolean }) {
  const dockRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pillRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(-1);
  const activeIndexRef = useRef(-1);
  const restCenters = useRef<number[]>([]);
  const pointerActive = useRef(false);
  const pointerY = useRef(0);
  const rafId = useRef<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const measure = () => {
      const rect = dockRef.current?.getBoundingClientRect();
      if (!rect) return;
      restCenters.current = CHROME_LINKS.map((_, i) => rect.top + i * (RAIL_BASE + RAIL_GAP) + RAIL_BASE / 2);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const gauss = (dist: number, base: number, peak: number) => base + (peak - base) * Math.exp(-((dist / RAIL_SPREAD) ** 2));

  const applySizes = (distFn: (i: number) => number) => {
    let bestIdx = -1;
    let bestAbs = Infinity;
    CHROME_LINKS.forEach((_, i) => {
      const dist = distFn(i);
      const abs = Math.abs(dist);
      const size = gauss(dist, RAIL_BASE, RAIL_PEAK);
      const tile = tileRefs.current[i];
      if (tile) {
        tile.style.width = `${size}px`;
        tile.style.height = `${size}px`;
        tile.style.borderRadius = `${size * RAIL_RADIUS_RATIO}px`;
      }
      const icon = iconRefs.current[i];
      if (icon) icon.style.transform = `scale(${gauss(dist, 1, RAIL_ICON_PEAK_SCALE)})`;
      if (abs < bestAbs) { bestAbs = abs; bestIdx = i; }
    });
    return bestAbs < RAIL_SPREAD * 1.15 ? bestIdx : -1;
  };

  const resetSizes = () => {
    CHROME_LINKS.forEach((_, i) => {
      const tile = tileRefs.current[i];
      if (tile) { tile.style.width = ""; tile.style.height = ""; tile.style.borderRadius = ""; }
      const icon = iconRefs.current[i];
      if (icon) icon.style.transform = "scale(1)";
    });
  };

  const positionFlyout = (idx: number) => {
    const tile = tileRefs.current[idx];
    if (!tile) return;
    const centerY = tile.getBoundingClientRect().top + tile.getBoundingClientRect().height / 2;
    if (pillRef.current) pillRef.current.style.top = `${centerY}px`;
  };

  const setActive = (idx: number) => {
    if (idx === activeIndexRef.current) {
      if (idx !== -1) positionFlyout(idx);
      return;
    }
    activeIndexRef.current = idx;
    setActiveIndex(idx);
    CHROME_LINKS.forEach((_, i) => tileRefs.current[i]?.classList.toggle("rail-active", i === idx));
    if (idx !== -1) positionFlyout(idx);
  };

  const frame = () => {
    if (pointerActive.current) {
      const idx = applySizes((i) => pointerY.current - restCenters.current[i]);
      setActive(idx);
      rafId.current = requestAnimationFrame(frame);
    } else {
      rafId.current = null;
    }
  };

  const cancelClose = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => {
      dockRef.current?.classList.add("rail-settle");
      resetSizes();
      setActive(-1);
    }, 180);
  };

  const handleDockEnter = () => {
    if (reducedMotion.current) return;
    cancelClose();
    pointerActive.current = true;
    dockRef.current?.classList.remove("rail-settle");
    if (!rafId.current) rafId.current = requestAnimationFrame(frame);
  };
  const handleDockMove = (e: React.PointerEvent) => {
    pointerY.current = e.clientY;
  };
  const handleDockLeave = () => {
    pointerActive.current = false;
    scheduleClose();
  };
  const handleFlyoutEnter = () => cancelClose();
  const handleFlyoutLeave = () => scheduleClose();

  const handleFocus = (i: number) => {
    cancelClose();
    if (pointerActive.current || reducedMotion.current) { setActive(i); return; }
    dockRef.current?.classList.add("rail-settle");
    applySizes((k) => (k - i) * (RAIL_BASE + RAIL_GAP));
    setActive(i);
  };
  const handleBlur = (e: React.FocusEvent) => {
    if (pointerActive.current) return;
    const next = e.relatedTarget as Node | null;
    if (next && pillRef.current?.contains(next)) return;
    dockRef.current?.classList.add("rail-settle");
    resetSizes();
    setActive(-1);
  };

  return (
    <>
    <div className={`fixed left-6 top-1/2 z-[998] hidden -translate-y-1/2 flex-col md:flex ${dark ? "rail-dark" : ""}`}>
      <div
        ref={dockRef}
        className="rail-dock flex flex-col items-center"
        style={{ gap: RAIL_GAP, height: CHROME_LINKS.length * RAIL_BASE + (CHROME_LINKS.length - 1) * RAIL_GAP }}
        onPointerEnter={handleDockEnter}
        onPointerMove={handleDockMove}
        onPointerLeave={handleDockLeave}
      >
        {CHROME_LINKS.map((l, i) => (
          <a
            key={l.id}
            href={l.id === "work" ? "/work" : `/#${l.id}`}
            ref={(el) => { tileRefs.current[i] = el; }}
            onFocus={() => handleFocus(i)}
            onBlur={handleBlur}
            aria-haspopup="true"
            aria-expanded={activeIndex === i}
            className="rail-tile flex flex-shrink-0 items-center justify-center"
          >
            <span ref={(el) => { iconRefs.current[i] = el; }} className="rail-icon-wrap">
              <RailGlyph name={l.icon} />
            </span>
          </a>
        ))}
      </div>
    </div>

      {/* Label pill — follows the hovered tile */}
      <div
        ref={pillRef}
        onPointerEnter={handleFlyoutEnter}
        onPointerLeave={handleFlyoutLeave}
        className="pointer-events-none fixed z-[998] -translate-y-1/2 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wide"
        style={{
          left: RAIL_LEFT + RAIL_PEAK + 14,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 20px rgba(20,18,16,0.12)",
          color: "var(--ink)",
          opacity: activeIndex !== -1 ? 1 : 0,
          transform: `translateY(-50%) translateX(${activeIndex !== -1 ? 0 : -6}px)`,
          transition: "opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)",
          pointerEvents: activeIndex !== -1 ? "auto" : "none",
        }}
      >
        {activeIndex !== -1 ? CHROME_LINKS[activeIndex].label : ""}
      </div>

    </>
  );
}

/* ─── MENU FLYOUT ─── */
function MenuFlyout({ dark }: { dark: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="fixed bottom-6 left-6 z-[999] hidden flex-col items-start gap-2 md:flex"
        style={{ color: dark ? "#fbf9ef" : "var(--ink)", transition: "color 0.4s ease" }}
      >
        <span className="relative block h-[11px] w-[52px] overflow-hidden text-[11px] font-black uppercase tracking-[0.15em]">
          <span
            className="absolute inset-0 transition-all duration-300 ease-out"
            style={{ opacity: open ? 0 : 1, transform: open ? "translateY(-10px)" : "translateY(0)" }}
          >
            Menu
          </span>
          <span
            className="absolute inset-0 transition-all duration-300 ease-out"
            style={{ opacity: open ? 1 : 0, transform: open ? "translateY(0)" : "translateY(10px)" }}
          >
            Close
          </span>
        </span>
        <span className="flex items-center gap-[5px]">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="rounded-full transition-transform duration-300 ease-out"
              style={{
                width: 3.5, height: 3.5, background: "currentColor",
                transitionDelay: `${i * 45}ms`,
                transform: open ? "scale(1.7)" : "scale(1)",
              }}
            />
          ))}
        </span>
      </button>

      <div className="fixed inset-0 z-[996]" style={{ pointerEvents: open ? "auto" : "none" }}>
        <div onClick={() => setOpen(false)} className="absolute inset-0" />
        <div
          className="menu-panel absolute left-6 right-6 top-24 bottom-24 overflow-y-auto rounded-[28px] md:left-[132px] md:right-6 md:top-[104px] md:bottom-7 md:rounded-[36px]"
          style={{
            maxWidth: 620,
            background: "var(--ink)",
            color: "var(--bg)",
            transformOrigin: "left center",
            transform: open ? "translateX(0) scale(1)" : "translateX(-16px) scale(0.97)",
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
            transition: `transform var(--dur-slow) var(--ease-flyout), opacity var(--dur-slow) var(--ease-flyout)`,
            boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
            padding: "52px 52px 40px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <nav className="flex flex-col gap-0.5 font-display font-bold" style={{ fontSize: "clamp(2rem, 4.2vw, 3.4rem)", lineHeight: 1.08 }}>
            {CHROME_LINKS.map((l, i) => (
              <a key={l.id} href={`/#${l.id}`} onClick={() => setOpen(false)}
                className="menu-link"
                style={{
                  transform: open ? "translateY(0)" : "translateY(14px)",
                  opacity: open ? 1 : 0,
                  transition: `transform 0.55s ${open ? i * 0.05 : 0}s var(--ease-out), opacity 0.55s ${open ? i * 0.05 : 0}s var(--ease-out)`,
                }}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="mt-10 flex flex-col gap-2.5 font-mono text-xs uppercase tracking-widest" style={{ color: "rgba(251,249,239,0.4)" }}>
            <a href="#" className="w-fit transition-colors hover:opacity-70">Privacy Policy</a>
            <a href="#" className="w-fit transition-colors hover:opacity-70">Terms of Service</a>
          </div>

          <div className="mt-auto flex gap-2.5 pt-10">
            {["in", "x", "gh", "bh"].map((s) => (
              <a key={s} href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-[10px] font-bold uppercase transition-all hover:scale-110"
                style={{ border: "1px solid rgba(251,249,239,0.18)", color: "rgba(251,249,239,0.6)" }}>
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── RIGHT-EDGE SCROLL PROGRESS LINE ─── */
function ScrollProgressLine() {
  const progress = useScrollProgress();
  return (
    <div className="fixed right-6 top-1/2 z-[998] hidden -translate-y-1/2 xl:block" style={{ height: 170, width: 1 }}>
      <div className="h-full w-full" style={{ background: "rgba(142,130,124,0.35)" }} />
      <div style={{
        position: "absolute", left: "50%", top: `${progress * 100}%`,
        width: 8, height: 8, borderRadius: "50%",
        background: "var(--accent)", boxShadow: "0 0 10px var(--accent)",
        transform: "translate(-50%, -50%)",
        transition: "top 0.05s linear",
      }} />
    </div>
  );
}

/* ─── LIVE CLOCK + LOCATION ─── */
function LiveClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="fixed bottom-6 right-6 z-[998] hidden rounded-full px-4 py-2.5 text-right font-mono text-[10px] uppercase tracking-widest md:block"
      style={{ color: "var(--grey)", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", boxShadow: "0 8px 24px rgba(20,18,16,0.08)" }}>
      Remote-first <span style={{ color: "var(--ink)", fontWeight: 600 }}>{time ?? "--:--"}</span>
    </div>
  );
}

/* ─── DARK-ZONE DETECTION ───
   Sections marked data-theme="dark" flip the fixed chrome to light-on-dark
   while they sit under it: top bar at y=48, rail at mid-screen, menu near the bottom. */
function useDarkZones() {
  const [dark, setDark] = useState({ top: false, mid: false, bottom: false });
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const rects = [...document.querySelectorAll<HTMLElement>('[data-theme="dark"]')].map((el) => el.getBoundingClientRect());
      const at = (y: number) => rects.some((r) => r.top <= y && r.bottom >= y);
      const h = window.innerHeight;
      const next = { top: at(48), mid: at(h / 2), bottom: at(h - 40) };
      setDark((prev) => (prev.top === next.top && prev.mid === next.mid && prev.bottom === next.bottom ? prev : next));
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return dark;
}

/* ─── SITE CHROME — shared by every route ─── */
export default function SiteChrome() {
  const dark = useDarkZones();
  return (
    <>
      <TopBar dark={dark.top} />
      <IconRail dark={dark.mid} />
      <MobileNav dark={dark.top} />
      <MenuFlyout dark={dark.bottom} />
      <ScrollProgressLine />
      <LiveClock />
    </>
  );
}
