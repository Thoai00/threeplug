"use client";

/**
 * ShipDeck — "What we ship. / Our ways to move fast", as a horizontal
 * scroll showcase.
 *
 * Desktop (≥900px, motion allowed): the section's wrapper is exactly as
 * tall as the track is wide, the stage inside it is `position: sticky`,
 * and one scrubbed GSAP tween slides the track sideways as the page
 * scrolls down — so vertical scrolling reads as travelling along the
 * deck. Lenis (LenisProvider) supplies the inertia; scrub ties the track
 * to scroll position, so it reverses cleanly on the way back up. A counter
 * and progress bar track which card is centred.
 *
 * Phones, tablets and prefers-reduced-motion: no pinning — the same track
 * is a native, swipeable scroll-snap carousel.
 *
 * The 8 cards cover all 12 service categories from the company's service
 * catalog: 01 websites, 02 web + mobile apps, 03 desktop software,
 * 04 ERP + CRM, 05 digital marketing, 06 animation + character,
 * 07 3D web + visualisation, 08 DevOps & cloud.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "./fx/Tilt";
import { ArrowRight } from "./fx/icons";
import { Reveal, RevealLines } from "./work/Motion";

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

function DeckCard({ item }: { item: (typeof DECK_ITEMS)[number] }) {
  return (
    <Tilt
      max={3.5}
      className="card rail-card group flex flex-col justify-between p-7 md:p-10"
      style={{
        // each card keeps its own hue from the catalog, as a corner wash over the shared panel
        background: `radial-gradient(120% 85% at 100% 0%, ${item.color} 0%, transparent 62%), var(--panel)`,
      }}
    >
      <div className="relative z-[2]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-hi">({item.n})</span>
          <span className="display text-ink/10 transition-colors duration-700 group-hover:text-accent-hi/40" style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)", lineHeight: 0.7 }} aria-hidden="true">
            {item.n}
          </span>
        </div>
        <h3 className="display t-h3 mt-6 max-w-[18ch]">{item.title}</h3>
        <p className="mt-5 max-w-[52ch] text-[14.5px] leading-relaxed text-ink-2">{item.body}</p>
      </div>

      <div className="relative z-[2] mt-8">
        <ul className="flex flex-wrap gap-1.5">
          {item.items.map((label) => (
            <li key={label} className="rounded-full px-3 py-1.5 text-[11.5px] font-medium text-ink-2" style={{ boxShadow: "inset 0 0 0 1px var(--line-2)", background: "rgba(238,243,249,0.04)" }}>
              {label}
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-line pt-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">Built with</div>
          <div className="mt-1.5 text-[13px] leading-relaxed text-ink">{item.stack}</div>
        </div>
      </div>
    </Tilt>
  );
}

export default function ShipDeck() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    const count = countRef.current;
    if (!wrap || !track || !bar || !count) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      let distance = 0;
      // Make the wrapper exactly one viewport plus the track's overflow tall,
      // so one pixel of vertical scroll moves the deck one pixel sideways.
      const measure = () => {
        distance = Math.max(0, track.scrollWidth - window.innerWidth);
        wrap.style.height = `${window.innerHeight + distance}px`;
      };
      measure();
      ScrollTrigger.addEventListener("refreshInit", measure);

      const tween = gsap.to(track, {
        x: () => -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            bar.style.transform = `scaleX(${self.progress})`;
            count.textContent = String(Math.min(N, Math.floor(self.progress * N) + 1)).padStart(2, "0");
          },
        },
      });

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", measure);
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: "transform" });
        wrap.style.height = "";
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="services" className="relative z-10 border-t border-line" aria-label="Services">
      <div ref={wrapRef} className="rail-wrap">
        <div className="rail-sticky py-16 md:py-0">
          <div ref={trackRef} className="rail-track items-stretch">
            {/* Lead panel — the section heading travels with the deck */}
            <div className="rail-item flex w-[min(74vw,560px)] flex-col justify-center pr-2 md:pr-12">
              <Reveal y={16}>
                <div className="eyebrow"><b>01</b><i />Services</div>
              </Reveal>
              <RevealLines
                className="display t-h2 mt-6"
                lines={[
                  <span key="a" className="muted">What we ship.</span>,
                  <span key="b">Our ways to</span>,
                  <span key="c">move fast</span>,
                ]}
              />
              <Reveal delay={0.35} className="mt-9 hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3 md:flex">
                Keep scrolling <ArrowRight />
              </Reveal>
              <Reveal delay={0.35} className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3 md:hidden">
                Swipe <ArrowRight />
              </Reveal>
            </div>

            {DECK_ITEMS.map((item) => (
              <div key={item.n} className="rail-item">
                <DeckCard item={item} />
              </div>
            ))}

            {/* spacer so the last card can reach the centre of the stage */}
            <div className="rail-item hidden w-[12vw] min-[900px]:block" aria-hidden="true" />
          </div>

          {/* Position readout — desktop pinned mode only */}
          <div className="shell mt-8 hidden items-center gap-5 min-[900px]:motion-safe:flex" aria-hidden="true">
            <span className="font-mono text-[11px] tracking-[0.2em] text-ink">
              <span ref={countRef}>01</span>
              <span className="text-ink-3"> / {String(N).padStart(2, "0")}</span>
            </span>
            <div className="h-px flex-1" style={{ background: "var(--line)" }}>
              <div ref={barRef} className="progress-bar h-full w-full" style={{ background: "var(--accent-hi)" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
