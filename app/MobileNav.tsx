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
 * Same 5 items as IconRail's CHROME_LINKS, same RailGlyph icon set
 * (duplicated here rather than importing from page.tsx, to keep this
 * component fully standalone like ShipDeck.tsx / HeroCarousel.tsx). Real
 * pages navigate via their #anchor as they already do site-wide; Work
 * links out to the /work index page. The bar stays hidden until the
 * top-right toggle opens it, mirroring the reference site's menu button.
 */

import { useEffect, useRef, useState } from "react";

type IconName = "bag" | "building" | "target" | "smiley" | "docs" | "mail";

const NAV_ITEMS: { id: string; label: string; icon: IconName; href?: string }[] = [
  { id: "work",     label: "Work",     icon: "docs",     href: "/work" },
  { id: "process",  label: "Process",  icon: "building" },
  { id: "why",      label: "Why us",   icon: "target" },
  { id: "about",    label: "About us", icon: "smiley" },
  { id: "contact",  label: "Contact",  icon: "mail" },
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

export default function MobileNav({ dark = false }: { dark?: boolean }) {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
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
      .filter((i) => !i.href)
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
      <button
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="md:hidden"
        style={{
          position: "fixed", top: 16, right: 16, zIndex: 999,
          height: 44, width: 44, borderRadius: 13,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: dark ? "#fbf9ef" : "var(--ink)",
          color: dark ? "var(--ink)" : "var(--bg)",
          boxShadow: "0 10px 30px rgba(20,18,16,0.22)",
          transition: `background-color .4s ease, color .4s ease`,
        }}
      >
        {open ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M5 5l14 14M19 5 5 19" /></svg>
        ) : (
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M4 9h16M4 15h16" /></svg>
        )}
      </button>

      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className="md:hidden"
        style={{
          position: "fixed", inset: 0, zIndex: 997,
          background: "rgba(20,18,16,0.28)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: `opacity .4s ${EASE}`,
        }}
      />

      <nav
        className="md:hidden"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          zIndex: 998,
          display: "flex", flexDirection: "row", alignItems: "stretch",
          background: "rgba(36,31,29,0.94)",
          backdropFilter: "blur(32px)",
          borderTopLeftRadius: 18, borderTopRightRadius: 18,
          padding: "6px 4px calc(6px + env(safe-area-inset-bottom))",
          boxShadow: "0 -8px 30px rgba(0,0,0,0.3)",
          transform: open ? "translateY(0)" : "translateY(115%)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: `transform .5s ${EASE}, opacity .4s ${EASE}`,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = activeId === item.id;
          const commonStyle: React.CSSProperties = {
            flex: "1 1 0", minWidth: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5,
            padding: "8px 2px 7px",
            color: active ? "var(--bg)" : "rgba(251,249,239,0.62)",
            background: active ? "rgba(251,249,239,0.1)" : "transparent",
            borderRadius: 10,
            transition: `color .3s ${EASE}, background-color .3s ${EASE}`,
          };
          const content = (
            <>
              <NavGlyph name={item.icon} />
              <span className="font-mono" style={{ fontSize: 8.5, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{item.label}</span>
            </>
          );
          return (
            <a key={item.id} href={item.href ?? `/#${item.id}`} onClick={() => setOpen(false)} style={commonStyle}>
              {content}
            </a>
          );
        })}
      </nav>
    </>
  );
}
