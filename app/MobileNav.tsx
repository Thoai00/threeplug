"use client";

/**
 * MobileNav — floating bottom tab bar, mobile-only counterpart to the
 * desktop IconRail in page.tsx.
 *
 * IconRail renders `hidden md:flex` (visible at md/768px and up); this
 * component mirrors that exact breakpoint from the other side (bails out
 * to `null` below the JS gate, and is additionally `md:hidden` as a CSS
 * belt-and-braces) so exactly one of the two is ever mounted/visible —
 * desktop's TopBar / IconRail / MenuFlyout are untouched by this file.
 *
 * Same 6 items as IconRail's CHROME_LINKS, same RailGlyph icon set
 * (duplicated here rather than importing from page.tsx, to keep this
 * component fully standalone like ShipDeck.tsx / HeroCarousel.tsx). Real
 * pages navigate via their #anchor as they already do site-wide; Services
 * opens a submenu overlay — a full-screen panel of service tiles, reveal
 * animated on transform/opacity/filter only, with Lenis paused
 * (lenis.stop()/start(), see LenisProvider's useLenis()) while it's open.
 */

import { useEffect, useRef, useState } from "react";
import { useLenis } from "./LenisProvider";

type IconName = "bag" | "building" | "target" | "smiley" | "docs" | "mail";

const NAV_ITEMS: { id: string; label: string; icon: IconName; submenu?: boolean }[] = [
  { id: "services", label: "Services", icon: "bag",      submenu: true },
  { id: "process",  label: "Process",  icon: "building" },
  { id: "why",      label: "Why us",   icon: "target" },
  { id: "about",    label: "About us", icon: "smiley" },
  { id: "work",     label: "Work",     icon: "docs" },
  { id: "contact",  label: "Contact",  icon: "mail" },
];

const SERVICE_TILES = [
  { label: "Website Development", gradient: "linear-gradient(160deg, #cdeeff, var(--brand-light) 55%, var(--brand-deep))" },
  { label: "Web Applications",    gradient: "linear-gradient(160deg, var(--brand-light), var(--brand-deep))" },
  { label: "Mobile Applications", gradient: "linear-gradient(160deg, #0b4a42, #05221d)" },
  { label: "Desktop Software",    gradient: "linear-gradient(160deg, var(--ink), #3a332e)" },
  { label: "ERP Solutions",       gradient: "linear-gradient(160deg, #5a2a0f, #2a1206)" },
  { label: "CRM Solutions",       gradient: "linear-gradient(160deg, #4a1f42, #24101f)" },
  { label: "Digital Marketing",   gradient: "linear-gradient(160deg, #3a2a5e, #1a1230)" },
  { label: "Animation & Motion",  gradient: "linear-gradient(160deg, #5c1d2b, #2b0d14)" },
  { label: "Character Animation", gradient: "linear-gradient(160deg, var(--grey), var(--ink))" },
  { label: "3D Web Experience",   gradient: "radial-gradient(120% 120% at 30% 80%, var(--brand-sky), var(--brand-mid) 60%, var(--ink))" },
  { label: "3D Visualisation",    gradient: "linear-gradient(160deg, #07445c, #03202b)" },
  { label: "DevOps & Cloud",      gradient: "linear-gradient(160deg, #143a2a, #08190f)" },
];

function NavGlyph({ name }: { name: IconName }) {
  const p = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "bag":      return <svg {...p}><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>;
    case "building": return <svg {...p}><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" /></svg>;
    case "target":   return <svg {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></svg>;
    case "smiley":   return <svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M8.5 14c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2" /><path d="M9 10h.01M15 10h.01" /></svg>;
    case "docs":     return <svg {...p}><rect x="4" y="4" width="12" height="16" rx="1.2" /><path d="M8 8h4M8 11.5h4M8 15h2" /></svg>;
    case "mail":     return <svg {...p}><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><path d="M4 6.5 12 13l8-6.5" /></svg>;
  }
}

const EASE = "cubic-bezier(.36,.33,0,1)";

function SubmenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lenisRef = useLenis();

  useEffect(() => {
    const lenis = lenisRef?.current;
    if (!lenis) return;
    if (open) lenis.stop(); else lenis.start();
    // Safety: never leave scroll locked if this unmounts while open.
    return () => lenis.start();
  }, [open, lenisRef]);

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: "fixed", inset: 0, zIndex: 996,
          background: "rgba(23,18,16,0.4)",
          backdropFilter: open ? "blur(4px)" : "blur(0px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: `opacity .5s ${EASE}, backdrop-filter .5s ${EASE}`,
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Services"
        style={{
          position: "fixed", inset: 0, zIndex: 997,
          background: "var(--ink)",
          padding: "28px 20px 120px",
          overflowY: "auto",
          transformOrigin: "center bottom",
          transform: open ? "scale(1)" : "scale(0.96)",
          filter: open ? "blur(0px)" : "blur(6px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: `transform .64s ${EASE}, filter .64s ${EASE}, opacity .64s ${EASE}`,
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: 20, right: 20,
            display: "flex", height: 40, width: 40, alignItems: "center", justifyContent: "center",
            borderRadius: 999, background: "rgba(251,249,239,0.08)", color: "var(--bg)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M5 5l14 14M19 5 5 19" /></svg>
        </button>

        <div className="mb-6 mt-2 text-center font-mono text-xs uppercase tracking-[0.25em]" style={{ color: "rgba(251,249,239,0.4)" }}>
          Services
        </div>

        <div className="grid grid-cols-2 gap-4">
          {SERVICE_TILES.map((t) => (
            <a
              key={t.label}
              href="#services"
              onClick={onClose}
              className="relative overflow-hidden rounded-2xl"
              style={{ aspectRatio: "3 / 4", background: t.gradient }}
            >
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 55%)" }} />
              <div className="absolute bottom-3 left-3 right-3 text-xs font-bold uppercase tracking-wide text-white">{t.label}</div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

export default function MobileNav() {
  const [isMobile, setIsMobile] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767.98px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Lightweight scroll-spy — only observes ids that actually exist on the
  // page (several nav items are anchors left over from a fuller version of
  // the site and currently have no matching section).
  useEffect(() => {
    if (!isMobile) return;
    const targets = NAV_ITEMS
      .filter((i) => !i.submenu)
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    targets.forEach((el) => obs.observe(el));
    observerRef.current = obs;
    return () => obs.disconnect();
  }, [isMobile]);

  if (!isMobile) return null;

  return (
    <>
      <nav
        className="md:hidden"
        style={{
          position: "fixed", bottom: 8, left: "50%", transform: "translateX(-50%)",
          zIndex: 998,
          display: "flex", flexDirection: "row", alignItems: "center", gap: 2,
          background: "rgba(36,31,29,0.9)",
          backdropFilter: "blur(32px)",
          borderRadius: 16,
          padding: "0 8px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = item.submenu ? submenuOpen : activeId === item.id;
          const commonStyle: React.CSSProperties = {
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            padding: "10px 10px 9px",
            color: active ? "var(--bg)" : "rgba(251,249,239,0.62)",
            background: active ? "rgba(251,249,239,0.1)" : "transparent",
            borderRadius: 10,
            transition: `color .3s ${EASE}, background-color .3s ${EASE}`,
          };
          const content = (
            <>
              <NavGlyph name={item.icon} />
              <span className="font-mono" style={{ fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.label}</span>
            </>
          );
          return item.submenu ? (
            <button
              key={item.id}
              type="button"
              aria-expanded={submenuOpen}
              onClick={() => setSubmenuOpen((o) => !o)}
              style={commonStyle}
            >
              {content}
            </button>
          ) : (
            <a key={item.id} href={`#${item.id}`} onClick={() => setSubmenuOpen(false)} style={commonStyle}>
              {content}
            </a>
          );
        })}
      </nav>

      <SubmenuOverlay open={submenuOpen} onClose={() => setSubmenuOpen(false)} />
    </>
  );
}
