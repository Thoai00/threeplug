"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import HeroCarousel from "./HeroCarousel";
import ShipDeck from "./ShipDeck";
import WorkRing from "./WorkRing";
import MobileNav from "./MobileNav";

/* ─── DATA ─── */
const WORK = [
  {
    tag: "EdTech · SaaS", year: "2025",
    title: "Bidyaloy.academy — School Management & LMS",
    desc: "A subscription-based school management platform with dedicated teacher, student, and guardian panels — handling attendance, results, and full academic administration end-to-end.",
    color: "from-[#0a90d8]/30 to-[#012a5e]/60",
  },
  {
    tag: "Web Design", year: "2025",
    title: "Mir Heating & Plumbing — Business Website",
    desc: "A clean, conversion-focused website for a heating and plumbing service business, built to turn visitors into booked jobs.",
    color: "from-[#00c0ff]/25 to-[#01204a]/60",
  },
  {
    tag: "Mobile App", year: "2025",
    title: "Bidyaloy.academy — iOS & Android App",
    desc: "The mobile companion to the Bidyaloy.academy platform, putting attendance, results, and guardian communication in every parent and teacher's pocket.",
    color: "from-[#40d8ff]/20 to-[#011830]/60",
  },
  {
    tag: "Web Design", year: "2025",
    title: "PressCustoms Consulting — Business Website",
    desc: "A professional website for a customs consulting firm, presenting their services and expertise to prospective clients.",
    color: "from-[#0a90d8]/25 to-[#011830]/60",
  },
  {
    tag: "Mobile App", year: "2025",
    title: "Health & Wellness App — iOS & Android",
    desc: "A cross-platform health and wellness app for iOS and Android, helping users track and manage their day-to-day health.",
    color: "from-[#00c0ff]/20 to-[#012a5e]/60",
  },
];

const TESTIMONIALS = [
  {
    quote: "Three Plug automated processes we thought were impossible to automate. The ROI was visible within the first month.",
    name: "James Okoye", role: "COO, Meridian Logistics",
  },
  {
    quote: "The 3D product animations they built for our launch campaign outperformed every other creative by 4×. Genuinely stunning work.",
    name: "Priya Sharma", role: "CMO, Luminary Health",
  },
  {
    quote: "They rebuilt our entire marketing stack from the ground up. Organic traffic up 280% in six months. These people know what they're doing.",
    name: "Daniel Müller", role: "Founder, NordRetail",
  },
  {
    quote: "The team plugged straight into our roadmap and shipped faster than our own engineers expected. No hand-holding needed.",
    name: "Elena Frost", role: "Head of Product, AutoFlow",
  },
  {
    quote: "From kickoff to launch in under eight weeks, and every deliverable exceeded the brief. We've never worked with a faster studio.",
    name: "Marcus Webb", role: "Founder, ArchViz Studio",
  },
];

const INDUSTRIES = [
  "Manufacturing", "Garments & Textiles", "Retail & E-commerce",
  "Education", "Healthcare", "Real Estate",
  "Logistics", "Hospitality", "Professional Services",
];

/* ─── ACCENT SYSTEM — every tone drawn from the logo's own blue gradient ─── */
const ACCENT = "#0a90d8";
const HOT    = "#00c0ff";

/* ─── HOOKS ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis] as const;
}

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

/* ─── PARALLAX HOOK ─── */
function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const offset = -rect.top * speed;
      el.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return ref;
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
  { id: "services", label: "Services", icon: "bag" },
  { id: "process",  label: "Process",  icon: "building" },
  { id: "why",      label: "Why us",   icon: "target" },
  { id: "about",    label: "About us", icon: "smiley" },
  { id: "work",     label: "Work",     icon: "docs" },
  { id: "contact",  label: "Contact",  icon: "mail" },
];

/* ─── TOP BAR: logo + book-a-call pill ─── */
function TopBar() {
  return (
    <>
      <a href="#top" className="fixed top-6 left-6 z-[998] flex items-center">
        <Image src="/logoh.png" alt="Three Plug — Software Solutions" width={377} height={251} priority className="h-16 w-auto drop-shadow-[0_2px_10px_rgba(20,18,16,0.12)]" />
      </a>
      <a href="#contact"
        className="fixed top-6 right-6 z-[998] rounded-full px-5 py-3 text-[11px] font-bold uppercase tracking-wide transition-transform hover:scale-105"
        style={{ background: "var(--ink)", color: "var(--bg)" }}>
        Book a call now
      </a>
    </>
  );
}

/* ─── SERVICES MEGA-MENU DATA ─── */
const SERVICE_MEGA = [
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
const SERVICES_INDEX = CHROME_LINKS.findIndex((l) => l.id === "services");

function IconRail() {
  const dockRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pillRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

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
    if (idx === SERVICES_INDEX) {
      if (drawerRef.current) drawerRef.current.style.top = `${Math.max(16, Math.min(centerY - 341, window.innerHeight - 698))}px`;
    } else if (pillRef.current) {
      pillRef.current.style.top = `${centerY}px`;
    }
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
    if (next && (drawerRef.current?.contains(next) || pillRef.current?.contains(next))) return;
    dockRef.current?.classList.add("rail-settle");
    resetSizes();
    setActive(-1);
  };

  return (
    <>
    <div className="fixed left-6 top-1/2 z-[998] hidden -translate-y-1/2 flex-col md:flex">
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
            href={`#${l.id}`}
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

      {/* Label pill — follows any non-Services tile */}
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
          opacity: activeIndex !== -1 && activeIndex !== SERVICES_INDEX ? 1 : 0,
          transform: `translateY(-50%) translateX(${activeIndex !== -1 && activeIndex !== SERVICES_INDEX ? 0 : -6}px)`,
          transition: "opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)",
          pointerEvents: activeIndex !== -1 && activeIndex !== SERVICES_INDEX ? "auto" : "none",
        }}
      >
        {activeIndex !== -1 && activeIndex !== SERVICES_INDEX ? CHROME_LINKS[activeIndex].label : ""}
      </div>

      {/* Services mega-panel — follows the Services tile. Frosted-glass panel
          over a photo-card grid, bottom-left overlaid title, matching the
          Brand Appart reference. */}
      <div
        ref={drawerRef}
        onPointerEnter={handleFlyoutEnter}
        onPointerLeave={handleFlyoutLeave}
        className="fixed z-[998] w-[560px] rounded-3xl p-6"
        style={{
          left: RAIL_LEFT + RAIL_PEAK + 14,
          background: "rgba(142,130,124,0.72)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          color: "var(--bg)",
          opacity: activeIndex === SERVICES_INDEX ? 1 : 0,
          transform: activeIndex === SERVICES_INDEX ? "scale(1)" : "scale(0.97) translateX(-8px)",
          transformOrigin: "left center",
          pointerEvents: activeIndex === SERVICES_INDEX ? "auto" : "none",
          transition: `opacity var(--dur-slow) var(--ease-flyout), transform var(--dur-slow) var(--ease-flyout)`,
          boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div className="mb-5 text-center font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: "rgba(251,249,239,0.75)" }}>
          Services
        </div>
        <div className="grid grid-cols-3 gap-3">
          {SERVICE_MEGA.map((s, i) => {
            const open = activeIndex === SERVICES_INDEX;
            return (
              <a key={s.label} href="#services"
                className="relative overflow-hidden rounded-2xl hover:scale-[1.03]"
                style={{
                  aspectRatio: "6 / 5",
                  background: s.gradient,
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(6px)",
                  transition: `opacity 0.35s ${open ? i * 30 : 0}ms, transform 0.35s ${open ? i * 30 : 0}ms`,
                }}>
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent 55%)" }} />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-[10.5px] font-bold uppercase leading-tight tracking-wide text-white">{s.label}</div>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ─── MENU FLYOUT ─── */
function MenuFlyout() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="fixed bottom-6 left-6 z-[999] flex flex-col items-start gap-2"
        style={{ color: "var(--ink)" }}
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
              <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)}
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
    <div className="fixed bottom-6 right-6 z-[998] hidden rounded-full px-4 py-2.5 text-right font-mono text-[10px] uppercase tracking-widest sm:block"
      style={{ color: "var(--grey)", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", boxShadow: "0 8px 24px rgba(20,18,16,0.08)" }}>
      Remote-first <span style={{ color: "var(--ink)", fontWeight: 600 }}>{time ?? "--:--"}</span>
    </div>
  );
}

/* ─── SECTION DIVIDER — animated data stream ─── */
function StreamDivider({ color1 = "#0a90d8", color2 = "#40d8ff" }: { color1?: string; color2?: string }) {
  const [ref, vis] = useReveal(0.3);
  return (
    <div ref={ref} className="relative mx-auto my-4 max-w-7xl px-6 overflow-hidden" style={{ height: 2 }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(90deg, transparent, ${color1}, ${color2}, ${color1}, transparent)`,
        opacity: vis ? 1 : 0,
        transform: vis ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        transition: "opacity 0.6s, transform 1.2s cubic-bezier(0.22,1,0.36,1)",
        borderRadius: 4,
        boxShadow: `0 0 16px ${color1}88`,
      }} />
      {/* Moving light dot */}
      {vis && (
        <div style={{
          position: "absolute", top: "50%", width: 6, height: 6,
          borderRadius: "50%", background: color2,
          boxShadow: `0 0 12px ${color2}`,
          transform: "translateY(-50%)",
          animation: "slideRight 2s ease-in-out infinite",
        }} />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="relative min-h-screen text-[#141210] antialiased" style={{ background: "transparent" }}>
      <TopBar />
      <IconRail />
      <MobileNav />
      <MenuFlyout />
      <ScrollProgressLine />
      <LiveClock />

      {/* Subtle grid overlay */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{
        backgroundImage:
          "linear-gradient(rgba(20,18,16,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(20,18,16,0.03) 1px,transparent 1px)",
        backgroundSize: "72px 72px",
        maskImage: "radial-gradient(ellipse 90% 90% at 50% 40%,black,transparent)",
      }} />

      {/* Global keyframes */}
      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes floatY  { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-16px) } }
        @keyframes scanDown { 0% { top: -20% } 100% { top: 100% } }
        @keyframes borderPulse { 0%,100% { opacity:0.4 } 50% { opacity:1 } }
        @keyframes lineGrow { from { transform: scaleX(0) } to { transform: scaleX(1) } }
        @keyframes slideRight { 0% { left: 0% } 100% { left: 100% } }
        @keyframes fadeUp { from { opacity:0; transform: translateY(40px) } to { opacity:1; transform: translateY(0) } }
        @keyframes glowPulse { 0%,100% { box-shadow: 0 0 20px rgba(10,144,216,0.3) } 50% { box-shadow: 0 0 48px rgba(10,144,216,0.8) } }
        @keyframes counterUp { from { opacity:0; transform: translateY(20px) } to { opacity:1; transform: translateY(0) } }
        :root { --brand: #0a90d8; --brand-light: #40d8ff; }
      `}</style>

      <Hero />
      <ShowreelPin />
      <FeaturedWork />
      <ShipDeck />
      <StreamDivider color1="#00c0ff" color2="#0a90d8" />
      <WorkRing />
      <StreamDivider color1="#0a90d8" color2="#00c0ff" />
      <HeroCarousel />
      <StreamDivider color1="#0a90d8" color2="#00c0ff" />
      <Testimonials />
      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   HERO  — with parallax layers + typewriter
───────────────────────────────────────────────────── */
function Hero() {
  const parallaxBg = useParallax(0.25);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const clientNames = ["MERIDIAN", "LUMINARY", "NORDRETAIL", "AUTOFLOW", "GROWTHOS", "ARCHVIZ"];
  const marqueeRow = [...clientNames, ...clientNames];

  return (
    <section id="top" className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-24 pb-16">
      {/* Parallax background glow layer */}
      <div ref={parallaxBg} className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse 70% 60% at 50% 20%, rgba(10,144,216,0.08), transparent 70%)",
        willChange: "transform",
      }} />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center">
        <h1
          className="font-display font-black leading-[0.95] tracking-tight"
          style={{
            fontSize: "clamp(2.6rem, 6.5vw, 6rem)",
            color: "#141210",
            animation: mounted ? "fadeUp 1s 0.15s both" : "none",
          }}>
          We build
          <br />
          the
          <span className="mx-2 inline-flex h-[0.62em] w-[0.62em] items-center justify-center rounded-full align-middle md:mx-3"
            style={{ background: "linear-gradient(135deg, var(--brand-light), var(--brand-deep))" }}>
            <svg width="58%" height="58%" viewBox="0 0 24 24" fill="none" stroke="#f4efe4" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 2v4M15 2v4M7 8h10l-1 5a4 4 0 0 1-4 4h0a4 4 0 0 1-4-4L7 8Z" />
              <path d="M12 17v5" />
            </svg>
          </span>
          tailored solution
          <br />
          you desire
        </h1>

        <div className="mt-14 overflow-hidden" style={{ animation: mounted ? "fadeUp 1s 0.35s both" : "none" }}>
          <div className="flex w-max animate-[marquee_28s_linear_infinite] items-center gap-16">
            {marqueeRow.map((name, i) => (
              <span key={i} className="text-sm font-bold uppercase tracking-wider" style={{ color: "rgba(20,18,16,0.32)" }}>
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-8"
          style={{ animation: mounted ? "fadeUp 1s 0.5s both" : "none" }}>
          <p className="max-w-lg text-lg leading-relaxed" style={{ color: "rgba(20,18,16,0.6)" }}>
            We help funded startups ship automation systems, growth marketing engines,
            and investor-proof software.
          </p>

          <a href="#contact" className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-70"
            style={{ color: "#141210" }}>
            Book an intro call
            <span className="flex items-center -space-x-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-black"
                style={{ background: "linear-gradient(135deg,#0a90d8,#40d8ff)", color: "#03070e", border: "2px solid #f4efe4" }}>
                TP
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:translate-x-1"
                style={{ background: "#141210", color: "#f4efe4" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 19 19 5M9 5h10v10" />
                </svg>
              </span>
            </span>
          </a>
        </div>
      </div>

    </section>
  );
}

/* ─────────────────────────────────────────────────────
   SHOWREEL — pinned scroll-scrubbed zoom through featured work
───────────────────────────────────────────────────── */
function ShowreelPin() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [useSimple, setUseSimple] = useState(false);

  useEffect(() => {
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setUseSimple(reduceMq.matches);
    update();
    reduceMq.addEventListener("change", update);
    return () => reduceMq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (useSimple) return;
    let ticking = false;

    const update = () => {
      ticking = false;
      const wrap = wrapRef.current;
      const card = cardRef.current;
      if (!wrap || !card) return;

      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;

      const vw = window.innerWidth;
      const startW = vw < 640 ? vw * 0.88 : Math.min(vw * 0.74, 1180);
      const startH = vh * 0.46;
      card.style.width = `${startW + p * (vw - startW)}px`;
      card.style.height = `${startH + p * (vh - startH)}px`;
      card.style.borderRadius = `${28 * (1 - p)}px`;

      const seg = Math.min(WORK.length - 1, Math.floor(p * WORK.length));
      if (seg !== activeIndexRef.current) {
        activeIndexRef.current = seg;
        setActiveIndex(seg);
      }
    };

    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [useSimple]);

  if (useSimple) {
    return (
      <section className="relative z-10 flex flex-col gap-4 px-6 py-16 md:pl-24">
        {WORK.map((w) => (
          <div key={w.title} className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${w.color} bg-[#141210] p-8`} style={{ minHeight: 220 }}>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "rgba(251,249,239,0.55)" }}>{w.tag} — {w.year}</div>
            <div className="mt-2 max-w-md font-display text-xl font-bold text-white">{w.title}</div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section ref={wrapRef} className="relative z-10" style={{ height: "380vh" }}>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <div ref={cardRef} className="relative overflow-hidden bg-[#141210] shadow-2xl" style={{ width: "74vw", height: "46vh", borderRadius: 28 }}>
          {WORK.map((w, i) => (
            <div key={w.title}
              className={`absolute inset-0 flex items-end bg-gradient-to-br ${w.color} p-10 md:p-14 transition-opacity duration-700 ease-out`}
              style={{ opacity: activeIndex === i ? 1 : 0 }}
            >
              {/* Placeholder frame — swap this gradient block for a <video> element per project */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "rgba(251,249,239,0.14)", backdropFilter: "blur(6px)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(251,249,239,0.85)"><path d="M8 5v14l11-7z" /></svg>
                </span>
              </div>
              <div className="relative">
                <div className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "rgba(251,249,239,0.55)" }}>{w.tag} — {w.year}</div>
                <div className="mt-2 max-w-lg font-display font-bold text-white" style={{ fontSize: "clamp(1.5rem,3vw,2.75rem)" }}>{w.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   FEATURED WORK — centered intro + scroll cue, alternating full/split case-study feed
───────────────────────────────────────────────────── */
function PhoneGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8Z" />
    </svg>
  );
}

function FeaturedWork() {
  const wrapRef = useRef<HTMLElement>(null);
  const [dockVisible, setDockVisible] = useState(false);
  const [introRef, introVis] = useReveal(0.3);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setDockVisible(e.isIntersecting), { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="work" ref={wrapRef} className="relative z-10 overflow-hidden py-28">
      <div
        ref={introRef}
        className="mx-auto max-w-3xl px-6 text-center"
        style={{
          opacity: introVis ? 1 : 0,
          transform: introVis ? "none" : "translateY(24px)",
          transition: "opacity 0.8s, transform 0.8s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <SectionLabel number="01" label="Featured work" center />
        <h2 className="font-display font-black leading-[0.9] tracking-tight" style={{ fontSize: "clamp(3rem,9vw,7rem)" }}>
          Featured<br /><span style={{ color: "var(--grey)" }}>work</span>
        </h2>
        <div className="mx-auto my-8 flex h-9 w-9 items-center justify-center rounded-full" style={{ border: "1px solid rgba(20,18,16,0.15)", animation: "floatY 2.4s ease-in-out infinite" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(20,18,16,0.5)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v16M6 14l6 6 6-6" /></svg>
        </div>
        <p className="mx-auto max-w-lg text-base leading-relaxed" style={{ color: "rgba(20,18,16,0.5)" }}>
          Every build here earns its keep — measured in hours saved, revenue moved, and deals closed, not just how it looks in a screenshot.
        </p>
      </div>

      <div className="mx-auto mt-20 max-w-7xl px-6 md:pl-24">
        <div className="flex flex-col gap-5">
          <FullWorkCard work={WORK[0]} tag="EdTech · SaaS" />
          <div className="grid gap-5 md:grid-cols-2">
            <IllustratedWorkCard title="Mir Heating & Plumbing" subtitle="Business website" hues={["#0a90d8", "#40d8ff", "#012a5e"]} />
            <WordmarkWorkCard title="Bidyaloy.academy" tag="Mobile App · iOS & Android" bg="linear-gradient(160deg, #0b2e5c, #011830)" />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <IllustratedWorkCard title="PressCustoms Consulting" subtitle="Business website" hues={["#40d8ff", "#7dd6ff", "#0a2a54"]} bg="linear-gradient(160deg, #eef6fc, #dbe9f5)" />
            <WordmarkWorkCard title="Health & Wellness App" tag="Mobile App · iOS & Android" bg="linear-gradient(160deg, #0b4a42, #05221d)" />
          </div>
        </div>
      </div>

      {/* Section-local floating CTA — visible only while this section is in view */}
      <div
        className="fixed bottom-6 left-1/2 z-[997] flex -translate-x-1/2 items-center gap-2 rounded-full"
        style={{
          background: "rgba(108,102,96,0.55)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 4px 32px rgba(0,0,0,0.16)",
          padding: 5,
          opacity: dockVisible ? 1 : 0,
          transform: `translate(-50%, ${dockVisible ? 0 : 12}px)`,
          pointerEvents: dockVisible ? "auto" : "none",
          transition: "opacity var(--dur-slow) var(--ease-flyout), transform var(--dur-slow) var(--ease-flyout)",
        }}
      >
        <a href="#contact" className="flex items-center gap-2">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-black"
            style={{ background: "linear-gradient(135deg,#0a90d8,#40d8ff)", color: "#03070e" }}>
            TP
          </span>
          <span className="whitespace-nowrap pr-1 text-xs font-bold" style={{ color: "var(--bg)" }}>
            Book a free discovery call
          </span>
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "var(--accent)", color: "#03070e" }}>
            <PhoneGlyph />
          </span>
        </a>
      </div>
    </section>
  );
}

function FullWorkCard({ work: w, tag }: { work: typeof WORK[number]; tag: string }) {
  const [ref, vis] = useReveal(0.15);
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-3xl bg-[#141210] bg-gradient-to-br ${w.color} p-10 md:p-14`}
      style={{
        minHeight: 340,
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(28px)",
        transition: "opacity 0.8s, transform 0.8s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div className="absolute left-8 top-8 md:left-10 md:top-10 inline-block rounded-lg px-3 py-1.5" style={{ background: "rgba(20,18,16,0.5)", backdropFilter: "blur(8px)" }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">{w.year}</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">{tag}</div>
      </div>
      <div className="absolute bottom-8 left-8 right-8 md:bottom-10 md:left-10 md:right-10">
        <div className="max-w-xl font-display font-bold text-white" style={{ fontSize: "clamp(1.5rem,3.2vw,2.75rem)" }}>{w.title}</div>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">{w.desc}</p>
      </div>
    </div>
  );
}

function IllustratedWorkCard({ title, subtitle, hues, bg = "linear-gradient(160deg, #fbf9ef, #f2f0e7)" }: { title: string; subtitle: string; hues: [string, string, string]; bg?: string }) {
  const [ref, vis] = useReveal(0.15);
  return (
    <div
      ref={ref}
      className="relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-3xl p-9"
      style={{
        background: bg,
        border: "1px solid rgba(20,18,16,0.08)",
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(28px)",
        transition: "opacity 0.8s, transform 0.8s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40" style={{ background: hues[0], opacity: 0.85, borderRadius: "40% 60% 55% 45%", transform: "rotate(12deg)" }} />
      <div className="pointer-events-none absolute right-16 top-24 h-16 w-16 rounded-full" style={{ background: hues[1], opacity: 0.9 }} />
      <div className="pointer-events-none absolute -left-10 bottom-10 h-32 w-32" style={{ background: hues[2], opacity: 0.7, borderRadius: "55% 45% 60% 40%" }} />
      <div className="relative">
        <div className="font-display text-3xl font-black tracking-tight" style={{ color: "#141210" }}>{title}</div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-widest" style={{ color: "rgba(20,18,16,0.4)" }}>{subtitle}</div>
      </div>
    </div>
  );
}

function WordmarkWorkCard({ title, tag, bg = "#141210" }: { title: string; tag: string; bg?: string }) {
  const [ref, vis] = useReveal(0.15);
  return (
    <div
      ref={ref}
      className="group relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-3xl p-9"
      style={{
        background: bg,
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(28px)",
        transition: "opacity 0.8s, transform 0.8s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{tag}</div>
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center font-display font-black leading-none tracking-tight text-white" style={{ fontSize: "clamp(1.75rem,3.5vw,3rem)" }}>{title}</div>
      </div>
      <a href="#contact" className="flex items-center gap-2 self-end font-mono text-[11px] uppercase tracking-widest text-white/50 transition-colors group-hover:text-white">
        Discover case
        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </a>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   TESTIMONIALS — fanned "hand of cards", scroll wobble + hover spread
───────────────────────────────────────────────────── */
const FAN_BASE = [
  { rot: -9,   x: 188, y: 24 },
  { rot: -4.5, x: 94,  y: 10 },
  { rot: 0,    x: 0,   y: 0  },
  { rot: 2,    x: -94, y: 10 },
  { rot: 3.5,  x: -188, y: 24 },
];

const FAN_AVATARS = [
  "linear-gradient(160deg, var(--brand-light), var(--brand-deep))",
  "linear-gradient(160deg, #3a332e, var(--ink))",
  "linear-gradient(160deg, #ffffff, var(--low))",
  "linear-gradient(160deg, var(--brand-sky), var(--brand-mid))",
  "linear-gradient(160deg, var(--grey), var(--ink))",
];

function FanPhoneIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function FanCardFace({ t, i }: { t: (typeof TESTIMONIALS)[number]; i: number }) {
  const taupe = i === 1 || i === 3;
  return (
    <article
      className="flex h-full flex-col gap-5 rounded-[22px] p-7"
      style={{
        minHeight: 430,
        background: taupe ? "var(--grey)" : "var(--bg-d)",
        color: taupe ? "var(--bg)" : "var(--ink)",
        boxShadow: "0 30px 60px rgba(23,20,18,0.14)",
      }}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="text-[16px] tracking-[2px]" style={{ color: "var(--rating-star)" }} aria-hidden="true">★★★★★</div>
        <a
          href="#contact"
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-wide"
          style={{ background: taupe ? "var(--bg)" : "var(--ink)", color: taupe ? "var(--ink)" : "var(--bg)" }}
        >
          Contact sales
          <FanPhoneIcon />
        </a>
      </div>

      <p className="text-[22px] font-medium leading-relaxed">&ldquo;{t.quote}&rdquo;</p>

      <div className="mt-auto flex items-center gap-3">
        <div className="h-11 w-11 flex-shrink-0 rounded-full" style={{ background: FAN_AVATARS[i % FAN_AVATARS.length] }} />
        <div>
          <div className="text-[16px] font-bold">{t.name}</div>
          <div className="mt-0.5 text-[14px]" style={{ color: taupe ? "rgba(255,255,255,0.7)" : "var(--grey)" }}>{t.role}</div>
        </div>
      </div>
    </article>
  );
}

function Testimonials() {
  const [headRef, headVis] = useReveal(0.2);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState(-1);
  const [narrow, setNarrow] = useState(false);
  const rafId = useRef<number | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const carouselRaf = useRef<number | null>(null);

  useEffect(() => {
    const update = () => setNarrow(window.innerWidth < 900);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const restState = (i: number) => {
    const b = FAN_BASE[i];
    return { rot: b.rot, x: b.x, y: b.y, scale: 1, z: 10 - Math.abs(2 - i) };
  };
  const hoverState = (i: number, h: number) => {
    const b = FAN_BASE[i];
    if (i === h) return { rot: 0, x: b.x, y: -28, scale: 1.05, z: 50 };
    const dir = i < h ? -1 : 1;
    return { rot: b.rot, x: b.x + dir * 64, y: b.y, scale: 1, z: 10 - Math.abs(2 - i) };
  };

  const applyState = (i: number, s: { rot: number; x: number; y: number; scale: number; z: number }) => {
    const el = cardRefs.current[i];
    if (!el) return;
    el.style.zIndex = String(s.z);
    el.style.transform = `translateX(${s.x}px) translateY(${s.y}px) rotate(${s.rot}deg) scale(${s.scale})`;
  };

  const layout = (h: number) => {
    TESTIMONIALS.forEach((_, i) => applyState(i, h === -1 ? restState(i) : hoverState(i, h)));
  };

  // Desktop fan — hover is a discrete state change, so the outer card's own
  // CSS transition (see .fan-card in globals.css) handles the smoothing;
  // no rAF needed here.
  useEffect(() => {
    if (narrow) return;
    layout(hovered);
  }, [hovered, narrow]); // eslint-disable-line react-hooks/exhaustive-deps

  // Desktop fan — scroll wobble, written every frame to the INNER layer
  // only (no CSS transition on it), so it never fights the hover transform.
  useEffect(() => {
    if (narrow) return;
    const tick = () => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect) {
        const vh = window.innerHeight || 1;
        const progress = 1 - Math.min(1, Math.max(0, rect.top / vh));
        TESTIMONIALS.forEach((_, i) => {
          const el = scrollLayerRefs.current[i];
          if (!el) return;
          const wobbleRot = Math.sin(progress * Math.PI * 2 + i * 0.9) * 1.4;
          const wobbleY = Math.cos(progress * Math.PI * 2 + i * 0.9) * 4;
          el.style.transform = `rotate(${wobbleRot}deg) translateY(${wobbleY}px)`;
        });
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [narrow]);

  // Mobile — side-scrolling carousel: as the row scrolls horizontally, each
  // card's distance from the container's center drives a parallax
  // scale/lift, so it feels alive while swiping, not just a bare
  // scroll-snap list — cards stay fully opaque, same as the desktop fan.
  useEffect(() => {
    if (!narrow) return;
    const el = carouselRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      carouselCardRefs.current.forEach((card) => {
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const dist = Math.max(-1, Math.min(1, (cardCenter - center) / rect.width));
        const abs = Math.abs(dist);
        card.style.transform = `translateY(${abs * 16}px) scale(${1 - abs * 0.08})`;
      });
    };

    const onScroll = () => {
      if (carouselRaf.current) cancelAnimationFrame(carouselRaf.current);
      carouselRaf.current = requestAnimationFrame(update);
    };

    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (carouselRaf.current) cancelAnimationFrame(carouselRaf.current);
    };
  }, [narrow]);

  return (
    <section id="testimonials" ref={sectionRef} className="relative z-10 py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl md:px-6 md:pl-24">
        <div
          ref={headRef}
          className="px-6 md:px-0"
          style={{
            opacity: headVis ? 1 : 0,
            transform: headVis ? "none" : "translateY(24px)",
            transition: "opacity 0.7s, transform 0.7s",
          }}
        >
          <SectionLabel number="06" label="Client stories" />
          <h2 className="mb-14 font-display font-black leading-[0.95] tracking-tight sm:mb-20" style={{ fontSize: "clamp(2.8rem,6.5vw,5.6rem)" }}>
            <span style={{ color: "var(--ink)" }}>Trusted by</span><br />
            <span style={{ color: "var(--grey)" }}>+{TESTIMONIALS.length * 8} founders</span>
          </h2>
        </div>

        {narrow ? (
          <div
            ref={carouselRef}
            className="testimonial-carousel flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                ref={(el) => { carouselCardRefs.current[i] = el; }}
                className="flex-shrink-0 snap-center"
                style={{ width: "min(80vw, 290px)", transition: "transform 0.15s ease-out" }}
              >
                <FanCardFace t={t} i={i} />
              </div>
            ))}
          </div>
        ) : (
          <div className="fan-row mx-auto flex justify-center" style={{ gap: 16, paddingTop: "4vh" }}>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="fan-card"
                style={{ width: 290, flex: "0 0 290px" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(-1)}
              >
                <div ref={(el) => { scrollLayerRefs.current[i] = el; }} className="fan-card__scroll">
                  <FanCardFace t={t} i={i} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   FOOTER  — dark closing band: call badge, nav grid, cropped wordmark
───────────────────────────────────────────────────── */
const FOOTER_SOCIALS: { name: string; render: () => React.ReactNode }[] = [
  { name: "Instagram", render: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4.2" /><path d="M17 7h.01" />
      </svg>
    ) },
  { name: "X", render: () => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round">
        <path d="M4 4l16 16M20 4 4 20" />
      </svg>
    ) },
  { name: "LinkedIn", render: () => (
      <span className="font-mono text-[11px] font-bold">in</span>
    ) },
  { name: "Behance", render: () => (
      <span className="font-mono text-[11px] font-bold">Bē</span>
    ) },
];

function Footer() {
  // Crop the giant wordmark to exactly 80% of its own rendered height (so
  // only the bottom ~20% sits under the overflow) — measured directly
  // rather than guessed as a fraction of font-size, since a display font's
  // true glyph height rarely matches its nominal font-size 1:1.
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [wordmarkCrop, setWordmarkCrop] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => {
      const h = wordmarkRef.current?.getBoundingClientRect().height;
      if (h) setWordmarkCrop(h * 0.8);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <footer id="contact" className="relative z-10 mt-6 overflow-hidden px-6 md:pl-24" style={{ background: "var(--ink)" }}>
      {/* Ambient glows + faint dot grid, echoing the rest of the site */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-[420px] w-[420px] rounded-full opacity-[0.16]"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)", filter: "blur(60px)" }} />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full opacity-[0.13]"
        style={{ background: "radial-gradient(circle, var(--orange), transparent 70%)", filter: "blur(60px)" }} />
      <div className="pointer-events-none absolute inset-0" style={{
        backgroundImage: "radial-gradient(rgba(251,249,239,0.08) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
        maskImage: "radial-gradient(ellipse 80% 70% at 30% 0%, black, transparent)",
      }} />

      <div className="relative mx-auto max-w-7xl pt-16">
        {/* Top strip — brand mark + circular call badge, mirrors the hero CTA style */}
        <div className="mb-14 flex flex-col items-start justify-between gap-8 border-b pb-10 sm:flex-row sm:items-center"
          style={{ borderColor: "rgba(251,249,239,0.1)" }}>
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Three Plug" width={56} height={56} className="h-12 w-auto object-contain" />
            <div>
              <div className="font-display text-lg font-black leading-tight tracking-tight" style={{ color: "var(--bg)" }}>THREE PLUG</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(10,144,216,0.75)" }}>Software Solutions</div>
            </div>
          </div>

          <a href="#contact" className="group flex items-center gap-4 rounded-full py-1.5 pl-6 pr-1.5 transition-all hover:pl-7"
            style={{ background: "rgba(251,249,239,0.06)", border: "1px solid rgba(251,249,239,0.14)" }}>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--bg)" }}>Book a call</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full transition-transform group-hover:scale-110"
              style={{ background: "var(--bg)", color: "var(--ink)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 19 19 5M9 5h10v10" />
              </svg>
            </span>
          </a>
        </div>

        {/* Nav grid */}
        <div className="grid gap-10 pb-14 sm:grid-cols-2 md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed" style={{ color: "rgba(251,249,239,0.42)" }}>
              Full-service digital studio specialising in intelligent automation, performance marketing, 3D animation, and custom software.
            </p>
            <div className="flex gap-2.5">
              {FOOTER_SOCIALS.map((s) => (
                <a key={s.name} href="#" aria-label={s.name}
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition-all hover:scale-110 hover:text-[var(--brand-light)]"
                  style={{ border: "1px solid rgba(251,249,239,0.14)", color: "rgba(251,249,239,0.55)", background: "rgba(251,249,239,0.03)" }}>
                  {s.render()}
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Three Plug" links={[
            { label: "Home", href: "#top" }, { label: "Work", href: "#work" },
            { label: "Contact us", href: "#contact" },
          ]} dot={ACCENT} />

          <FooterCol title="Industries" links={INDUSTRIES.map((i) => ({ label: i, href: "#" }))} dot={ACCENT} />

          <FooterCol title="Services" links={SERVICE_MEGA.map((s) => ({ label: s.label, href: "#services" }))} dot={HOT} />

          <FooterCol title="Explore more" links={[
            { label: "Featured work", href: "#work" }, { label: "Join the team", href: "#" },
            { label: "Privacy policy", href: "#", muted: true }, { label: "Terms of service", href: "#", muted: true },
            { label: "Site map", href: "#", muted: true },
          ]} dot={ACCENT} />
        </div>
      </div>

      {/* Giant closing wordmark — cropped to exactly 80% of its own height (measured
          above), so only the bottom ~20% sits under the overflow, flush against the
          footer's bottom edge as the footer's sole closing note */}
      <div className="relative mx-auto max-w-[1700px] overflow-hidden select-none"
        aria-hidden="true"
        style={{ height: wordmarkCrop ? `${wordmarkCrop}px` : "clamp(150px,20vw,290px)" }}
      >
        <div ref={wordmarkRef} className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap font-display font-black leading-none tracking-tight"
          style={{
            fontSize: "clamp(6rem, 21vw, 19rem)",
            color: "rgba(251,249,239,0.05)",
            WebkitTextStroke: "1px rgba(251,249,239,0.14)",
          }}>
          ThreePlug
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title, links, dot,
}: { title: string; links: { label: string; href: string; muted?: boolean }[]; dot: string }) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        <div style={{ width: 7, height: 7, borderRadius: 1, background: dot, boxShadow: `0 0 6px ${dot}88` }} />
        <div className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: "rgba(251,249,239,0.35)" }}>{title}</div>
      </div>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-sm font-semibold transition-colors"
              style={{ color: l.muted ? "rgba(251,249,239,0.28)" : "rgba(251,249,239,0.68)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-light)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = l.muted ? "rgba(251,249,239,0.28)" : "rgba(251,249,239,0.68)")}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── SHARED ─── */
function SectionLabel({ number, label, center }: { number: string; label: string; center?: boolean }) {
  return (
    <div className={`mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] ${center ? "justify-center" : ""}`}>
      <span style={{ color: "var(--brand-light)" }}>{number}</span>
      <span style={{ color: "rgba(20,18,16,0.25)" }}>—</span>
      <span style={{ color: "rgba(20,18,16,0.38)" }}>{label}</span>
    </div>
  );
}
