"use client";

/**
 * SiteChrome — the fixed frame every route shares, mounted once in the root
 * layout so it holds still through page transitions:
 *
 *   · Header: logo, section links (desktop), "Book a call now", menu toggle.
 *     Slides away while scrolling down, returns on the first scroll up.
 *   · A hairline scroll-progress bar across the top edge.
 *   · The full-screen menu (every breakpoint): large staggered links,
 *     contact details, legal and social links, local time.
 */

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import HashLink from "./HashLink";
import Magnetic from "./fx/Magnetic";
import { ArrowUpRight } from "./fx/icons";
import { useLenis } from "./LenisProvider";
import { track } from "./analytics";
import { COMPANY } from "./seo";

/* ─── NAV DATA ─── */
export const NAV_LINKS: { id: string; label: string; href?: string }[] = [
  { id: "work",     label: "Work", href: "/work" },
  { id: "services", label: "Services" },
  { id: "process",  label: "Process" },
  { id: "why",      label: "Why us" },
  { id: "about",    label: "About us" },
  { id: "contact",  label: "Contact" },
];

/* ─── SERVICE CATALOG LABELS (footer + menu) ─── */
export const SERVICE_MEGA = [
  { label: "Website Development" },
  { label: "Web Applications" },
  { label: "Mobile Applications" },
  { label: "Desktop Software" },
  { label: "ERP Solutions" },
  { label: "CRM Solutions" },
  { label: "Digital Marketing" },
  { label: "Animation & Motion" },
  { label: "Character Animation" },
  { label: "3D Web Experience" },
  { label: "3D Visualisation" },
  { label: "DevOps & Cloud" },
];

export const SOCIALS = [
  { name: "Instagram", short: "ig" },
  { name: "X", short: "x" },
  { name: "LinkedIn", short: "in" },
  { name: "Behance", short: "be" },
];

/* ─── LIVE CLOCK ─── */
export function LiveClock({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className={className}>
      Remote-first <span className="text-ink">{time ?? "--:--"}</span>
    </span>
  );
}

/* ─── HEADER VISIBILITY + PROGRESS ─── */
function useHeaderScroll(progressRef: React.RefObject<HTMLDivElement | null>) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${total > 0 ? Math.min(1, y / total) : 0})`;
      setScrolled(y > 24);
      // 6px of slack so trackpad jitter doesn't flap the header
      if (y > 160 && y - lastY > 6) setHidden(true);
      else if (lastY - y > 6 || y <= 160) setHidden(false);
      lastY = y;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [progressRef]);

  return { hidden, scrolled };
}

/* ─── ACTIVE SECTION (home page only) ─── */
function useActiveSection(pathname: string) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (pathname !== "/") return;
    const targets = NAV_LINKS
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return pathname === "/" ? active : pathname.startsWith("/work") ? "work" : null;
}

/* ─── SITE CHROME ─── */
export default function SiteChrome() {
  const pathname = usePathname();
  const progressRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const { hidden, scrolled } = useHeaderScroll(progressRef);
  const active = useActiveSection(pathname);
  const lenis = useLenis();

  // While the menu is open: lock the page, close on Escape, keep Tab inside
  // the header + menu, and hand focus back to the toggle on close.
  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    // Read the ref at call time: the Lenis instance can be replaced while the menu is open.
    const resumeScroll = () => lenis?.current?.start();
    lenis?.current?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const focusables = () =>
      [headerRef.current, menuRef.current].flatMap((root) =>
        root ? Array.from(root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")) : [],
      ).filter((el) => el.offsetParent !== null);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      const current = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (current === first || !current || !list.includes(current))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (current === last || !current || !list.includes(current))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      resumeScroll();
      toggle?.focus({ preventScroll: true });
    };
  }, [open, lenis]);

  const close = () => setOpen(false);

  return (
    <>
      {/* Scroll progress */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[999] h-[2px]" aria-hidden="true">
        <div ref={progressRef} className="progress-bar h-full w-full" style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-hi))" }} />
      </div>

      <header ref={headerRef} className="site-header fixed inset-x-0 top-0 z-[998]" data-hidden={hidden && !open}>
        <div className="shell flex items-center justify-between gap-4 py-4 md:py-5">
          <HashLink id="top" onClick={close} aria-label="Three Plug — home" className="relative z-10 flex items-center">
            <Image
              src="/logoh.png"
              alt="Three Plug — Software Solutions"
              width={377}
              height={251}
              priority
              className="h-10 w-auto md:h-14"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </HashLink>

          <nav aria-label="Primary" className={`nav-pill hidden items-center gap-1 rounded-full p-1.5 lg:flex ${open ? "invisible" : ""}`}>
            {NAV_LINKS.map((l) => {
              const cls = "rounded-full px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 hover:bg-white/[0.07] hover:text-ink";
              const state = active === l.id ? "bg-white/[0.09] text-ink" : "text-ink-2";
              return l.href ? (
                <Link key={l.id} href={l.href} className={`${cls} ${state}`} aria-current={active === l.id ? "page" : undefined}>{l.label}</Link>
              ) : (
                <HashLink key={l.id} id={l.id} className={`${cls} ${state}`} aria-current={active === l.id ? "true" : undefined}>{l.label}</HashLink>
              );
            })}
          </nav>

          <div className="relative z-10 flex items-center gap-2.5">
            <Magnetic className="hidden sm:inline-block">
              <HashLink
                id="contact"
                onClick={() => { close(); track("book_call_click", { location: "header" }); }}
                className="btn btn-primary btn-sm"
              >
                Book a call now
                <ArrowUpRight size={13} />
              </HashLink>
            </Magnetic>

            <Magnetic strength={0.25}>
              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="site-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className={`nav-pill flex h-[42px] items-center gap-3 rounded-full pl-5 pr-4 text-[11px] font-bold uppercase tracking-[0.14em] text-ink ${scrolled || open ? "" : "lg:bg-transparent"}`}
              >
                <span className="relative block h-[14px] w-[44px] overflow-hidden text-left leading-[14px]">
                  <span className="absolute inset-0 transition-transform duration-500" style={{ transform: open ? "translate3d(0,-110%,0)" : "none", transitionTimingFunction: "var(--ease)" }}>Menu</span>
                  <span className="absolute inset-0 transition-transform duration-500" style={{ transform: open ? "none" : "translate3d(0,110%,0)", transitionTimingFunction: "var(--ease)" }}>Close</span>
                </span>
                <span className="relative block h-3 w-4" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 block h-[1.5px] w-4 bg-current transition-transform duration-500" style={{ transform: open ? "rotate(45deg)" : "translate3d(0,-3.5px,0)", transitionTimingFunction: "var(--ease)" }} />
                  <span className="absolute left-0 top-1/2 block h-[1.5px] w-4 bg-current transition-transform duration-500" style={{ transform: open ? "rotate(-45deg)" : "translate3d(0,3.5px,0)", transitionTimingFunction: "var(--ease)" }} />
                </span>
              </button>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* Full-screen menu */}
      <div
        id="site-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        data-lenis-prevent
        className={`menu fixed inset-0 z-[997] overflow-y-auto ${open ? "is-open" : ""}`}
        style={{ background: "var(--panel)" }}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ background: "radial-gradient(55% 60% at 85% 20%, rgba(10,144,216,0.28), transparent 70%), radial-gradient(40% 45% at 5% 100%, rgba(1,42,94,0.6), transparent 70%)" }} />

        <div className="shell relative flex min-h-full flex-col gap-10 pb-8 pt-24 md:pt-28">
          <nav aria-label="Menu" className="display flex flex-col" style={{ fontSize: "clamp(2.5rem, min(8.4vw, 10.5vh), 7rem)", lineHeight: 0.98 }}>
            {NAV_LINKS.map((l, i) => {
              const inner = (
                <>
                  <span className="mr-4 align-top font-mono text-[11px] font-medium tracking-[0.2em] text-accent-hi md:mr-6" style={{ letterSpacing: "0.2em" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {l.label}
                  <span className="menu-arrow ml-4 text-accent-hi" aria-hidden="true">→</span>
                </>
              );
              return (
                <span key={l.id} className="line-mask">
                  <span className="mask-in" style={{ "--i": i } as React.CSSProperties}>
                    {l.href ? (
                      <Link href={l.href} onClick={close} className="menu-link inline-block py-1">{inner}</Link>
                    ) : (
                      <HashLink id={l.id} onClick={close} className="menu-link inline-block py-1">{inner}</HashLink>
                    )}
                  </span>
                </span>
              );
            })}
          </nav>

          <div className="g-fade mt-auto grid gap-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="eyebrow mb-3">Get in touch</div>
              <a href={`mailto:${COMPANY.email}`} className="link-u block w-fit text-[15px] text-ink">{COMPANY.email}</a>
              <a href={`tel:${COMPANY.phone}`} className="link-u mt-1.5 block w-fit text-[15px] text-ink-2">{COMPANY.phone}</a>
            </div>
            <div>
              <div className="eyebrow mb-3">Legal</div>
              <a href="#" className="link-u block w-fit text-[15px] text-ink-2">Privacy Policy</a>
              <a href="#" className="link-u mt-1.5 block w-fit text-[15px] text-ink-2">Terms of Service</a>
            </div>
            <div>
              <div className="eyebrow mb-3">Follow</div>
              <div className="flex gap-2">
                {SOCIALS.map((s) => (
                  <a key={s.name} href="#" aria-label={s.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full font-mono text-[10px] font-semibold uppercase text-ink-2 transition-colors duration-300 hover:bg-accent-hi hover:text-[var(--on-accent)]"
                    style={{ boxShadow: "inset 0 0 0 1px var(--line-2)" }}>
                    {s.short}
                  </a>
                ))}
              </div>
            </div>
            <div className="lg:text-right">
              <div className="eyebrow mb-3 lg:justify-end">Studio</div>
              <LiveClock className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
