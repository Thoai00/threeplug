"use client";

/**
 * ShipDeck — "What we ship. / Our ways to move fast" pinned 3D flip-deck.
 *
 * An 800vh .stack-wrapper holds a .stack-list pinned to the viewport via
 * GSAP ScrollTrigger (pin + scrub, start:"top top" end:"bottom bottom" on
 * the wrapper). One scrubbed GSAP timeline drives all 8 cards: at each of
 * the 7 hand-off points the active (front) card hinges back on its bottom
 * edge — rotateX(0 -> 15deg), translateY(0 -> -850px), fading out — while
 * the next card in the stack flattens from its peeking depth position
 * (translateZ(-30px * depth), translateY(40px * depth)) up to the front,
 * and every card still further back shifts up one depth level in sync.
 * Scrub ties all of it directly to scroll position, so it reverses cleanly
 * on scroll-up and eases to rest the instant scrolling stops — no manual
 * reverse logic needed, GSAP's scrubbed timeline just plays backwards.
 *
 * Lenis (mounted globally in LenisProvider) is what gives the scroll driving
 * that scrub its inertia; ScrollTrigger.update() runs on Lenis's own "scroll"
 * event so the two stay in lockstep without ScrollTrigger installing a
 * second scroll listener of its own.
 *
 * The "See our case studies" pill is a fixed-position, pointer-events:none
 * cursor replacement — one shared rAF loop lerps it toward the live mouse
 * position every frame; a single boolean (hovering the pinned stack) drives
 * its opacity. It's independent of the scroll timeline above, so the two
 * never contend for the same rAF tick's writes.
 *
 * On mobile or with prefers-reduced-motion, the pin/GSAP path and the
 * custom cursor are both skipped — the 8 cards render as a plain static
 * stack (see `useSimple`).
 *
 * The 8 cards cover all 11 service categories from the company's service
 * catalog plus DevOps: 01 websites, 02 web + mobile apps, 03 desktop
 * software, 04 ERP + CRM, 05 digital marketing, 06 animation + character,
 * 07 3D web + visualisation, 08 DevOps & cloud.
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DECK_ITEMS = [
  {
    n: "01", color: "#0B2E5C",
    title: "Websites that carry the whole business",
    body: "Corporate, business, e-commerce, institutional and multi-language sites — with CMS, speed and SEO setup, hosting, security hardening and support built into every project rather than quoted as extras.",
    items: ["Corporate & Business", "E-commerce", "Institutional", "Landing & Portfolio", "Multi-language", "CMS & Content Control"],
    stack: "Next.js · React · Laravel · MySQL · Cloudflare",
  },
  {
    n: "02", color: "#0B4A42",
    title: "Web and mobile apps your customers and staff work inside",
    body: "SaaS platforms, customer and employee portals, admin dashboards, booking and marketplace systems — plus Android, iOS and cross-platform apps taken all the way through store deployment.",
    items: ["SaaS Platforms", "Customer & Employee Portals", "Admin Dashboards", "Booking & Marketplace", "Android & iOS", "App Store Deployment"],
    stack: "React · Node.js · Flutter · React Native · REST & GraphQL",
  },
  {
    n: "03", color: "#4A1F42",
    title: "Desktop software that keeps running when the internet doesn't",
    body: "POS, inventory, accounting and office management software built offline-first — for counters, warehouses and back offices that can't wait on a connection to take the next order.",
    items: ["POS Software", "Inventory", "Accounting", "Office Management", "Offline-First Systems", "Custom Desktop Apps"],
    stack: "Offline-first architecture · Local & cloud sync",
  },
  {
    n: "04", color: "#5A2A0F",
    title: "One platform. One database. One source of truth.",
    body: "Modular ERP and CRM — HR and payroll, accounting, inventory, sales, purchase and production alongside lead, pipeline and customer management. Start with one department and extend company-wide without rebuilding.",
    items: ["Business ERP", "HR & Payroll", "Accounting & Finance", "Inventory & Stock", "Lead & Pipeline", "Sales Dashboard"],
    stack: "Website → CRM → ERP → HR → Accounts → Inventory",
  },
  {
    n: "05", color: "#3A2A5E",
    title: "Marketing that's measured, not estimated",
    body: "Social, paid and search marketing with the analytics infrastructure underneath it — campaign management, creative, lead generation and email/SMS, all reported against numbers you can check yourself.",
    items: ["Social Media", "Facebook & Instagram Ads", "SEO & Search", "Performance Marketing", "Email & SMS", "Reporting & Analytics"],
    stack: "Build → Promote → Engage → Convert → Grow",
  },
  {
    n: "06", color: "#5C1D2B",
    title: "Animation and characters that make people stop scrolling",
    body: "2D and 3D animation, product and explainer videos, motion graphics and brand films — plus full character work: design, modelling, rigging, mascot animation and lip-sync.",
    items: ["2D & 3D Animation", "Product Animation", "Explainer Videos", "Motion Graphics", "Character Design & Rigging", "Mascot & Lip-sync"],
    stack: "2D & 3D pipeline · Motion graphics · Character rigging",
  },
  {
    n: "07", color: "#07445C",
    title: "Interactive 3D that runs in the browser — no app, no plugin",
    body: "Product configurators, virtual showrooms, 3D real-estate walkthroughs and architectural visualisation — built on Three.js and WebGL so the whole experience loads in a browser tab.",
    items: ["3D Product Configurators", "Virtual Showrooms", "3D Real Estate", "Architecture Viz", "Walkthrough & Virtual Tours", "WebGL Performance Tuning"],
    stack: "Three.js · WebGL · Real-time render",
  },
  {
    n: "08", color: "#143A2A",
    title: "Shipped, hosted and kept running",
    body: "Cloud and on-premise deployment with rollback ready, CI/CD pipelines, monitoring, backups and security hardening — plus the maintenance and scaling that comes after go-live.",
    items: ["Cloud & On-Premise Deploy", "CI/CD Pipelines", "Monitoring & Backups", "Security Hardening", "Scaling & New Branches", "Maintenance & Support"],
    stack: "AWS · Cloudflare · CI/CD · Rollback-ready deploys",
  },
];

const N = DECK_ITEMS.length;
const DEPTH_Z = 30;   // translateZ(-DEPTH_Z * depth)
const DEPTH_Y = 40;   // translateY(DEPTH_Y * depth)
const EXIT_Y = -850;
const EXIT_ROTATE_X = 15;

function CardContent({ item }: { item: (typeof DECK_ITEMS)[number] }) {
  return (
    <>
      <div className="stack-card__number">({item.n})</div>

      <div className="stack-card__body">
        <h3 className="stack-card__title">{item.title}</h3>
        <p className="stack-card__desc">{item.body}</p>
      </div>

      <div className="stack-card__bottom">
        <div className="stack-card__meta">
          <div className="stack-card__meta-label">Built with</div>
          <div className="stack-card__stack">{item.stack}</div>
        </div>

        <ul className="stack-card__chips">
          {item.items.map((label) => (
            <li key={label} className="stack-card__chip">{label}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

function DeckCursor({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouse.current.x = e.clientX; mouse.current.y = e.clientY; };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const tick = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.16;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.16;
      const el = ref.current;
      if (el) el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={ref} className="deck-cursor" style={{ opacity: active ? 1 : 0 }} aria-hidden="true">
      See our case studies
    </div>
  );
}

function StaticDeck() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-6 py-8 md:pl-24">
      {DECK_ITEMS.map((item) => (
        <div key={item.n} className="relative overflow-hidden rounded-[28px] p-8" style={{ background: item.color, minHeight: 280 }}>
          <div className="absolute right-8 top-8 font-mono text-sm font-bold text-white/50">({item.n})</div>
          <h3 className="max-w-md font-display font-black leading-[1.05] text-white" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>{item.title}</h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">{item.body}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {item.items.map((label) => (
              <li key={label} className="rounded-full px-3 py-1.5 text-[11px] font-semibold text-white/85" style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.2)" }}>
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">Built with</div>
          <div className="mt-1 text-xs text-white/75">{item.stack}</div>
        </div>
      ))}
    </div>
  );
}

export default function ShipDeck() {
  const [useSimple, setUseSimple] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stackListRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cursorActive, setCursorActive] = useState(false);

  useEffect(() => {
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setUseSimple(reduceMq.matches);
    update();
    reduceMq.addEventListener("change", update);
    return () => reduceMq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (useSimple) return;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);

      cards.forEach((el, i) => {
        gsap.set(el, {
          transformOrigin: "center bottom",
          rotateX: 0,
          y: DEPTH_Y * i,
          z: -DEPTH_Z * i,
          opacity: 1,
        });
      });

      const tl = gsap.timeline({ defaults: { ease: "none", duration: 1 } });
      for (let act = 0; act < N - 1; act++) {
        tl.to(cards[act], { rotateX: EXIT_ROTATE_X, y: EXIT_Y, opacity: 0 }, act);
        for (let i = act + 1; i < N; i++) {
          const depth = i - act - 1;
          tl.to(cards[i], { rotateX: 0, y: DEPTH_Y * depth, z: -DEPTH_Z * depth }, act);
        }
      }

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: stackListRef.current,
        scrub: true,
        animation: tl,
      });
    }, wrapperRef);

    // Lenis -> ScrollTrigger sync is wired once, globally, in LenisProvider
    // (lenis.on("scroll", ScrollTrigger.update) + gsap.ticker driving
    // lenis.raf), so this pinned timeline just needs its own cleanup here.
    return () => ctx.revert();
  }, [useSimple]);

  if (useSimple) {
    return (
      <section className="relative z-10 py-16">
        <DeckHeading />
        <StaticDeck />
      </section>
    );
  }

  return (
    <section className="relative z-10">
      <DeckHeading />
      <div ref={wrapperRef} className="stack-wrapper">
        <div ref={stackListRef} className="stack-list">
          <div
            className="stack-frame"
            onMouseEnter={() => setCursorActive(true)}
            onMouseLeave={() => setCursorActive(false)}
          >
            {DECK_ITEMS.map((item, i) => (
              <div
                key={item.n}
                ref={(el) => { cardRefs.current[i] = el; }}
                className={`stack-card ${i === 0 ? "stack-card--first" : ""}`}
                style={{ background: item.color, zIndex: N - i }}
              >
                <CardContent item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <DeckCursor active={cursorActive} />
    </section>
  );
}

function DeckHeading() {
  return (
    <div className="relative z-10 mx-auto max-w-2xl px-6 pb-10 text-center md:pb-14">
      <h2 className="font-display font-black tracking-tight" style={{ fontSize: "clamp(2.2rem, 8vw, 5.6rem)", lineHeight: 0.8 }}>
        <span style={{ color: "var(--grey)" }}>What we ship.</span>
        <br />
        <span style={{ color: "var(--ink)" }}>Our ways to move fast</span>
      </h2>
    </div>
  );
}
