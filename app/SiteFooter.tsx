"use client";

/**
 * SiteFooter — the closing band on every page: brand mark and call badge,
 * the link grid, the legal line, and a giant ghosted wordmark that rises
 * into place as the footer scrolls in.
 */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HashLink from "./HashLink";
import Magnetic from "./fx/Magnetic";
import { ArrowUpRight } from "./fx/icons";
import { LiveClock, SERVICE_MEGA } from "./SiteChrome";
import { track } from "./analytics";
import { COMPANY } from "./seo";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INDUSTRIES = [
  "Manufacturing", "Garments & Textiles", "Retail & E-commerce",
  "Education", "Healthcare", "Real Estate",
  "Logistics", "Hospitality", "Professional Services",
];

const FOOTER_SOCIALS: { name: string; render: () => React.ReactNode }[] = [
  { name: "Instagram", render: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4.2" /><path d="M17 7h.01" />
      </svg>
    ) },
  { name: "X", render: () => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" aria-hidden="true">
        <path d="M4 4l16 16M20 4 4 20" />
      </svg>
    ) },
  { name: "LinkedIn", render: () => <span className="font-mono text-[11px] font-bold">in</span> },
  { name: "Behance", render: () => <span className="font-mono text-[11px] font-bold">Bē</span> },
];

type FooterLink = { label: string; href?: string; hash?: string; muted?: boolean };

function FooterCol({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <div className="eyebrow mb-5"><span className="block h-1.5 w-1.5 rounded-[1px] bg-accent-hi" />{title}</div>
      <ul className="space-y-2.5">
        {links.map((l) => {
          const cls = `link-u text-[14.5px] transition-colors duration-300 hover:text-accent-hi ${l.muted ? "text-ink-3" : "text-ink-2"}`;
          return (
            <li key={l.label}>
              {l.hash ? (
                <HashLink id={l.hash} className={cls}>{l.label}</HashLink>
              ) : l.href && l.href !== "#" ? (
                <Link href={l.href} className={cls}>{l.label}</Link>
              ) : (
                <a href="#" className={cls}>{l.label}</a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  const rootRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const word = wordRef.current;
    if (!root || !word) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(word, { yPercent: 55 }, {
        yPercent: 0,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom bottom", scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <footer ref={rootRef} className="relative z-10 overflow-hidden border-t border-line" style={{ background: "var(--bg-soft)" }}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{
        backgroundImage: "radial-gradient(rgba(238,243,249,0.09) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
        maskImage: "radial-gradient(ellipse 80% 70% at 30% 0%, black, transparent)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 30% 0%, black, transparent)",
      }} />

      <div className="shell relative pt-14 md:pt-20">
        {/* Top strip — brand mark + call badge */}
        <div className="mb-14 flex flex-col items-start justify-between gap-8 border-b border-line pb-10 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Three Plug" width={56} height={56} className="h-12 w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} />
            <div>
              <div className="display text-xl" style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}>THREE PLUG</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-hi">Software Solutions</div>
            </div>
          </div>

          <Magnetic>
            <HashLink id="contact" onClick={() => track("book_call_click", { location: "footer" })} className="btn btn-ghost">
              Book a call
              <ArrowUpRight />
            </HashLink>
          </Magnetic>
        </div>

        {/* Nav grid */}
        <div className="grid gap-x-8 gap-y-12 pb-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <p className="mb-6 max-w-xs text-[14.5px] leading-relaxed text-ink-2">
              Full-service digital studio specialising in intelligent automation, performance marketing, 3D animation, and custom software.
            </p>
            <div className="flex gap-2">
              {FOOTER_SOCIALS.map((s) => (
                <a key={s.name} href="#" aria-label={s.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-ink-2 transition-colors duration-300 hover:bg-accent-hi hover:text-[var(--on-accent)]"
                  style={{ boxShadow: "inset 0 0 0 1px var(--line-2)" }}>
                  {s.render()}
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Three Plug" links={[
            { label: "Home", hash: "top" },
            { label: "Work", hash: "work" },
            { label: "Contact us", hash: "contact" },
          ]} />

          <FooterCol title="Industries" links={INDUSTRIES.map((i) => ({ label: i, href: "#" }))} />

          <FooterCol title="Services" links={SERVICE_MEGA.map((s) => ({ label: s.label, hash: "services" }))} />

          <FooterCol title="Explore more" links={[
            { label: "Featured work", hash: "work" },
            { label: "Join the team", href: "#" },
            { label: "Privacy policy", href: "#", muted: true },
            { label: "Terms of service", href: "#", muted: true },
            { label: "Site map", href: "#", muted: true },
          ]} />
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-6 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <span>{COMPANY.legalName}</span>
          <span>{COMPANY.address.street}, {COMPANY.address.locality} {COMPANY.address.postalCode}</span>
          <LiveClock />
        </div>
      </div>

      {/* Giant closing wordmark — cropped by the footer's bottom edge */}
      <div className="relative select-none overflow-hidden" aria-hidden="true" style={{ height: "clamp(4.4rem, 15.5vw, 15rem)" }}>
        <div ref={wordRef} className="display absolute inset-x-0 top-0 whitespace-nowrap text-center"
          style={{
            fontSize: "clamp(5.4rem, 21vw, 20rem)",
            lineHeight: 0.86,
            // filled, not stroked: a variable font's overlapping contours show through an outline
            color: "rgba(238,243,249,0.07)",
            willChange: "transform",
          }}>
          ThreePlug
        </div>
      </div>
    </footer>
  );
}
