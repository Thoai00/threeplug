"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ShipDeck from "./ShipDeck";
import WorkRing from "./WorkRing";
import SiteFooter from "./SiteFooter";
import Magnetic from "./fx/Magnetic";
import Tilt from "./fx/Tilt";
import Parallax from "./fx/Parallax";
import PageTransition from "./fx/PageTransition";
import { ArrowDown, ArrowRight, ArrowUpRight, PlugGlyph } from "./fx/icons";
import { WorkGrid } from "./work/Cards";
import { CASES } from "./work/cases";
import { CountUp, Reveal, RevealLines } from "./work/Motion";
import { track } from "./analytics";
import { COMPANY, FAQS, SERVICES, faqJsonLd } from "./seo";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Heavy, below-the-fold or WebGL pieces are split out of the first bundle.
const HeroCanvas = dynamic(() => import("./fx/HeroCanvas"), { ssr: false });
const HeroCarousel = dynamic(() => import("./HeroCarousel"));

/* ─── DATA ─── */
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

const CLIENT_NAMES = ["BIDYALOY.ACADEMY", "CHORKI", "BALUCHOR", "GRAVIA GLASS"];

// How a project runs — the stages and wording come from the FAQ answers
// (see FAQS in seo.ts), laid out as a sequence rather than a paragraph.
const PROCESS = [
  { n: "01", title: "Discovery", body: "Every project starts with a discovery call and a written scope before any number is quoted." },
  { n: "02", title: "System design", body: "Cost and shape are driven by how many modules, user roles and integrations a system needs — a single-department tool and a company-wide ERP are very different builds." },
  { n: "03", title: "Development in sprints", body: "Projects run over video calls, shared boards and a working demo at every stage, so distance doesn't change how the work is reviewed." },
  { n: "04", title: "Testing, migration & training", body: "Testing with data migration and staff training. Every build includes admin training, documentation and support." },
  { n: "05", title: "Go-live & support", body: "Deployment goes live on cloud or on-premise with rollback ready. After launch we handle maintenance, monitoring and backups, plus new modules and extra branches as the business grows." },
];

// Why us — each point restates something already said elsewhere on the site
// (hero, service cards, FAQ); nothing here is a new claim.
const WHY = [
  { title: "One team, twelve categories", body: "Websites, web and mobile apps, desktop software, ERP and CRM systems, digital marketing, animation and interactive 3D — delivered by one team." },
  { title: "Clients anywhere", body: "The team is based in Dhaka and works remotely with clients anywhere in the world, in English and Bengali." },
  { title: "Measured, not estimated", body: "Every build earns its keep — measured in hours saved, revenue moved, and deals closed, not just how it looks in a screenshot." },
  { title: "A working demo at every stage", body: "Projects run over video calls, shared boards and a working demo at every stage, so you review real software, not slides." },
  { title: "Start small, extend later", body: "Our ERP and CRM systems are modular: start with one department and extend company-wide without rebuilding." },
  { title: "Built in, not extras", body: "On website projects, CMS, speed and SEO setup, hosting, security hardening and support are built in rather than quoted as extras." },
];

const FACTS = [
  { value: String(SERVICES.length), label: "Service categories" },
  { value: String(CASES.length), label: "Case studies" },
  { value: COMPANY.founded, label: "Founded" },
  { value: "2", label: "Working languages — English & Bengali" },
];

/* ─── SHARED ─── */
function SectionLabel({ number, label, className = "" }: { number: string; label: string; className?: string }) {
  return (
    <Reveal y={16} className={className}>
      <div className="eyebrow"><b>{number}</b><i />{label}</div>
    </Reveal>
  );
}

/* ─────────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────────── */
export default function Home() {
  return (
    <PageTransition>
      <div className="relative min-h-screen antialiased">
        <main id="main">
          <Hero />
          <Showreel />
          <ShipDeck />
          <FeaturedWork />
          <WorkRing />
          <Process />
          <WhyUs />
          <About />
          <Testimonials />
          <FaqSection />
          <Contact />
        </main>
        <SiteFooter />
      </div>
    </PageTransition>
  );
}

/* ─────────────────────────────────────────────────────
   HERO — WebGL core, split-line headline, client marquee
───────────────────────────────────────────────────── */
function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // 4 copies (2 per half) so each half is wider than the viewport and the -50% loop never shows a gap.
  const marqueeRow = [...CLIENT_NAMES, ...CLIENT_NAMES, ...CLIENT_NAMES, ...CLIENT_NAMES];

  // The headline drifts up and dims as the hero scrolls away, slower than
  // the page, so the 3D core appears to pass in front of it.
  useEffect(() => {
    const content = contentRef.current;
    const section = sectionRef.current;
    if (!content || !section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(content, {
        yPercent: -14,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="top" ref={sectionRef} className="gate relative flex min-h-[100svh] flex-col overflow-hidden">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <HeroCanvas />
      {/* keeps the headline legible where it overlaps the core */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ background: "linear-gradient(90deg, rgba(5,7,12,0.82) 0%, rgba(5,7,12,0.35) 48%, transparent 72%), linear-gradient(0deg, var(--bg) 0%, transparent 26%)" }} />

      <div ref={contentRef} className="shell relative z-10 flex flex-1 flex-col justify-end pb-10 pt-28 md:justify-center md:pb-8 md:pt-28" style={{ willChange: "transform" }}>
        <div className="eyebrow g-fade" style={{ "--i": 0 } as React.CSSProperties}>
          <span className="live-dot" />
          {COMPANY.legalName}
        </div>

        <h1 className="display t-hero mt-5 md:mt-6">
          <span className="line-mask"><span className="mask-in" style={{ "--i": 1 } as React.CSSProperties}>We build</span></span>
          <span className="line-mask">
            <span className="mask-in" style={{ "--i": 2 } as React.CSSProperties}>
              the
              <span
                className="mx-[0.14em] inline-flex h-[0.64em] w-[0.64em] items-center justify-center rounded-full align-[-0.02em]"
                style={{ background: "linear-gradient(135deg, var(--accent-hi), var(--accent) 55%, var(--accent-deep))", color: "var(--ink)" }}
              >
                <PlugGlyph />
              </span>
              tailored
            </span>
          </span>
          <span className="line-mask"><span className="mask-in" style={{ "--i": 3 } as React.CSSProperties}>solution</span></span>
          <span className="line-mask"><span className="mask-in muted" style={{ "--i": 4 } as React.CSSProperties}>you desire</span></span>
        </h1>

        <div className="mt-8 grid items-end gap-7 md:mt-9 md:grid-cols-[minmax(0,34rem)_1fr]">
          <p className="t-lead g-fade" style={{ "--i": 6 } as React.CSSProperties}>
            Three Plug builds websites, web and mobile apps, desktop software, ERP and CRM
            systems, digital marketing, animation and interactive 3D — twelve service
            categories, delivered by one team, for clients anywhere in the world.
          </p>

          <div className="g-fade flex flex-wrap items-center gap-3 md:justify-end" style={{ "--i": 7 } as React.CSSProperties}>
            <Magnetic>
              <a href="#contact" onClick={() => track("book_call_click", { location: "hero" })} className="btn btn-accent">
                Book an intro call
                <ArrowUpRight />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#work" className="btn btn-ghost">
                Featured work
                <ArrowDown />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Client marquee */}
      <div className="g-fade marquee relative z-10 overflow-hidden border-t border-line py-5" style={{ "--i": 9 } as React.CSSProperties}>
        <div className="marquee-track items-center">
          {marqueeRow.map((name, i) => (
            <span key={i} className="flex items-center gap-10 pr-10 font-mono text-[12px] font-medium uppercase tracking-[0.22em] text-ink-3 md:gap-16 md:pr-16">
              {name}
              <span className="block h-1 w-1 rounded-full bg-accent-hi" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   SHOWREEL — sticky stage; the frame scales up to full-bleed
   as you scroll through it (scale only, never width/height)
───────────────────────────────────────────────────── */
function Showreel() {
  const wrapRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    const video = videoRef.current;
    if (!wrap || !card || !video) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: wrap, start: "top top", end: "bottom bottom", scrub: true },
      });
      // 1.08 pushes the rounded corners just past the viewport edge at the end.
      tl.to(card, { scale: 1.08 }, 0).fromTo(video, { scale: 1.3 }, { scale: 1 }, 0);
    });
    return () => mm.revert();
  }, []);

  // Plays only while the section is on screen; pausing off-screen also drops
  // the audio the moment the viewer scrolls away.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) v.play().catch(() => {});
    setMuted(v.muted);
    track("showreel_sound", { muted: v.muted });
  };

  return (
    <section ref={wrapRef} className="reel-wrap z-10" aria-label="Showreel">
      <div className="reel-sticky">
        <div ref={cardRef} className="reel-card">
          <video
            ref={videoRef}
            src="/hero-web.mp4"
            poster="/hero-poster.jpg"
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ willChange: "transform" }}
          />
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,7,12,0.55))" }} />
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <Magnetic strength={0.45}>
              <button
                type="button"
                onClick={toggleSound}
                aria-label={muted ? "Unmute showreel" : "Mute showreel"}
                aria-pressed={!muted}
                data-cursor={muted ? "Sound on" : "Sound off"}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(5,7,12,0.55)] text-ink transition-colors duration-300 hover:bg-accent-hi hover:text-[var(--on-accent)]"
                style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: "inset 0 0 0 1px rgba(238,243,249,0.4)" }}
              >
                {muted ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="m17 9 4 6M21 9l-4 6" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
                  </svg>
                )}
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   FEATURED WORK — intro, case-study card feed, floating CTA dock
───────────────────────────────────────────────────── */
function FeaturedWork() {
  const wrapRef = useRef<HTMLElement>(null);
  const [dockVisible, setDockVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setDockVisible(e.isIntersecting), { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="work" ref={wrapRef} className="section relative z-10 border-t border-line">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel number="02" label="Featured work" />
            <RevealLines
              className="display t-h2 mt-6"
              lines={[<span key="a">Featured</span>, <span key="b" className="muted">work</span>]}
            />
          </div>
          <div className="md:col-span-5 md:pb-3">
            <Reveal delay={0.15}>
              <p className="t-lead max-w-md">
                Every build here earns its keep — measured in hours saved, revenue moved, and deals closed, not just how it looks in a screenshot.
              </p>
              <Link href="/work" className="link-u link-u--on mt-7 inline-flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.14em] text-ink">
                All case studies <ArrowRight />
              </Link>
            </Reveal>
          </div>
        </div>

        <div className="mt-14 md:mt-24">
          <WorkGrid />
        </div>
      </div>

      {/* Section-local floating CTA — visible only while this section is in view */}
      <div
        className="nav-pill fixed bottom-6 left-1/2 z-[996] w-[calc(100vw-1.5rem)] max-w-[540px] rounded-full p-1.5 sm:w-auto"
        style={{
          opacity: dockVisible ? 1 : 0,
          transform: `translate3d(-50%, ${dockVisible ? 0 : 16}px, 0)`,
          pointerEvents: dockVisible ? "auto" : "none",
          transition: "opacity var(--dur-slow) var(--ease-flyout), transform var(--dur-slow) var(--ease-flyout)",
        }}
      >
        <a
          href="#contact"
          tabIndex={dockVisible ? 0 : -1}
          onClick={() => track("book_call_click", { location: "floating_dock" })}
          className="group flex items-center justify-between gap-3 rounded-full sm:gap-8"
        >
          <span className="truncate pl-4 text-[13px] text-ink sm:pl-6 sm:text-[15px]">Book a free discovery call</span>
          <span className="flex-shrink-0 whitespace-nowrap rounded-full bg-ink px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-bg transition-colors duration-300 group-hover:bg-accent-hi sm:px-7 sm:py-3.5 sm:text-[12px]">
            Book a call
          </span>
        </a>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   PROCESS — sticky heading, steps on a rail that draws itself
───────────────────────────────────────────────────── */
function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const line = lineRef.current;
    if (!list || !line) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(line, { scaleY: 0 }, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: list, start: "top 72%", end: "bottom 62%", scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="process" className="section relative z-10 border-t border-line">
      <div className="shell grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <SectionLabel number="03" label="Process" />
            <RevealLines
              className="display t-h2 mt-6"
              lines={[<span key="a">Discovery</span>, <span key="b" className="muted">to go-live</span>]}
            />
            <Reveal delay={0.2}>
              <p className="t-lead mt-8 max-w-sm">
                A project runs through discovery, system design, development in sprints, testing with data migration and staff training, then go-live and support.
              </p>
            </Reveal>
          </div>
        </div>

        <ol ref={listRef} className="relative md:col-span-6 md:col-start-7">
          <div className="absolute bottom-0 left-0 top-0 w-px" style={{ background: "var(--line)" }} aria-hidden="true">
            <div ref={lineRef} className="h-full w-full origin-top" style={{ background: "linear-gradient(180deg, var(--accent-hi), var(--accent))" }} />
          </div>
          {PROCESS.map((step, i) => (
            <li key={step.n} className="relative pb-14 pl-8 last:pb-0 md:pb-20 md:pl-14">
              <span className="absolute -left-[5px] top-2 block h-[11px] w-[11px] rounded-full bg-bg" style={{ boxShadow: "inset 0 0 0 2px var(--accent-hi)" }} aria-hidden="true" />
              <Reveal delay={i === 0 ? 0.1 : 0}>
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-hi">Step {step.n}</div>
                <h3 className="display t-h3 mt-3">{step.title}</h3>
                <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-ink-2">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   WHY US — tilt cards with a pointer-following glow
───────────────────────────────────────────────────── */
function WhyUs() {
  return (
    <section id="why" className="section relative z-10 border-t border-line">
      <div className="shell">
        <SectionLabel number="04" label="Why us" />
        <RevealLines
          className="display t-h2 mt-6"
          lines={[<span key="a">One team,</span>, <span key="b" className="muted">start to support</span>]}
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={(i % 3) * 0.08} className="h-full">
              <div className="lift h-full">
              <Tilt className="card group flex h-full min-h-[260px] flex-col justify-between p-7 md:p-9">
                <div className="relative z-[2] flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full text-ink-3 transition-colors duration-500 group-hover:bg-accent-hi group-hover:text-[var(--on-accent)]" style={{ boxShadow: "inset 0 0 0 1px var(--line-2)" }} aria-hidden="true">
                    <PlugGlyph size={16} />
                  </span>
                </div>
                <div className="relative z-[2] mt-12">
                  <h3 className="display text-[1.7rem]" style={{ lineHeight: 1.02, letterSpacing: "-0.035em" }}>{w.title}</h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{w.body}</p>
                </div>
              </Tilt>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   ABOUT — the 3D team ring, then the studio in plain facts
───────────────────────────────────────────────────── */
function About() {
  return (
    <section id="about" className="relative z-10 border-t border-line">
      <HeroCarousel />

      <div className="shell section grid gap-14 md:grid-cols-12">
        <div className="md:col-span-6">
          <SectionLabel number="05" label="About us" />
          <Reveal delay={0.1}>
            <p className="display mt-7" style={{ fontSize: "clamp(1.7rem, 3.1vw, 2.9rem)", lineHeight: 1.08, letterSpacing: "-0.035em" }}>
              {COMPANY.tagline}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="t-lead mt-8 max-w-xl">
              The team is based in Dhaka and works remotely with clients anywhere in the world, in English and Bengali.
              Projects run over video calls, shared boards and a working demo at every stage, so distance doesn&apos;t change how the work is reviewed.
            </p>
          </Reveal>
          <Reveal delay={0.28} className="mt-9">
            <Magnetic>
              <a href="#contact" onClick={() => track("book_call_click", { location: "about" })} className="btn btn-ghost">
                Book a call
                <ArrowUpRight />
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:col-span-5 md:col-start-8">
          {FACTS.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.08} className="border-t border-line-2 pt-5">
              <dt className="sr-only">{f.label}</dt>
              <dd>
                <CountUp value={f.value} className="display block" style={{ fontSize: "clamp(3rem, 6.4vw, 5.75rem)", lineHeight: 0.9 }} />
                <span className="mt-3 block font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-ink-3" aria-hidden="true">{f.label}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   TESTIMONIALS — fanned "hand of cards": hover spreads the hand,
   scroll gives it a slow sway
───────────────────────────────────────────────────── */
const FAN_BASE = [
  { rot: -9,   x: 188,  y: 24 },
  { rot: -4.5, x: 94,   y: 10 },
  { rot: 0,    x: 0,    y: 0  },
  { rot: 2,    x: -94,  y: 10 },
  { rot: 3.5,  x: -188, y: 24 },
];

const FAN_AVATARS = [
  "linear-gradient(160deg, var(--accent-hi), var(--accent-deep))",
  "linear-gradient(160deg, #2a3446, var(--bg))",
  "linear-gradient(160deg, #ffffff, var(--grey))",
  "linear-gradient(160deg, var(--brand-sky), var(--brand-mid))",
  "linear-gradient(160deg, var(--grey), var(--panel-2))",
];

function fanTransform(i: number, hovered: number) {
  const b = FAN_BASE[i];
  const restZ = 10 - Math.abs(2 - i);
  if (hovered === -1) return { zIndex: restZ, transform: `translateX(${b.x}px) translateY(${b.y}px) rotate(${b.rot}deg) scale(1)` };
  if (i === hovered) return { zIndex: 50, transform: `translateX(${b.x}px) translateY(-28px) rotate(0deg) scale(1.05)` };
  const dir = i < hovered ? -1 : 1;
  return { zIndex: restZ, transform: `translateX(${b.x + dir * 64}px) translateY(${b.y}px) rotate(${b.rot}deg) scale(1)` };
}

function FanPhoneIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function FanCardFace({ t, i }: { t: (typeof TESTIMONIALS)[number]; i: number }) {
  const blue = i === 1 || i === 3;
  return (
    <article
      className="flex h-full flex-col gap-5 rounded-[22px] p-7"
      style={{
        minHeight: 430,
        background: blue ? "linear-gradient(165deg, #0b3f7a, var(--accent-deep) 70%)" : "var(--panel-2)",
        color: "var(--ink)",
        boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 1px var(--line-2)",
      }}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="text-[16px] tracking-[2px]" style={{ color: "var(--rating-star)" }} aria-hidden="true">★★★★★</div>
        <a
          href="#contact"
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-ink px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-bg transition-colors duration-300 hover:bg-accent-hi"
        >
          Contact sales
          <FanPhoneIcon />
        </a>
      </div>

      <p className="text-[21px] font-medium leading-relaxed">&ldquo;{t.quote}&rdquo;</p>

      <div className="mt-auto flex items-center gap-3">
        <div className="h-11 w-11 flex-shrink-0 rounded-full" style={{ background: FAN_AVATARS[i % FAN_AVATARS.length] }} />
        <div>
          <div className="text-[16px] font-bold">{t.name}</div>
          <div className="mt-0.5 text-[14px] text-ink-2">{t.role}</div>
        </div>
      </div>
    </article>
  );
}

function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const swayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState(-1);
  const [narrow, setNarrow] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 899.98px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Desktop fan — the sway is scrubbed on the INNER layer only; the outer
  // .fan-card owns the hover transform, so the two never fight.
  useEffect(() => {
    if (narrow) return;
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      swayRefs.current.forEach((el, i) => {
        if (!el) return;
        const dir = i % 2 === 0 ? 1 : -1;
        gsap.fromTo(el, { rotation: -1.6 * dir, y: 14 }, {
          rotation: 1.6 * dir,
          y: -14,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });
    return () => mm.revert();
  }, [narrow]);

  // Mobile — side-scrolling carousel: each card's distance from the
  // container's centre drives a small scale/drop, so swiping feels alive.
  useEffect(() => {
    if (!narrow) return;
    const el = carouselRef.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      carouselCardRefs.current.forEach((card) => {
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        const dist = Math.max(-1, Math.min(1, (cardRect.left + cardRect.width / 2 - center) / rect.width));
        const abs = Math.abs(dist);
        card.style.transform = `translate3d(0, ${abs * 16}px, 0) scale(${1 - abs * 0.08})`;
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [narrow]);

  return (
    <section id="testimonials" ref={sectionRef} className="section relative z-10 overflow-hidden border-t border-line">
      <div className="shell">
        <SectionLabel number="06" label="Client stories" />
        <RevealLines
          className="display t-h2 mb-12 mt-6 sm:mb-24"
          lines={[
            <span key="a">Trusted by</span>,
            <span key="b" className="muted">+{TESTIMONIALS.length * 8} founders</span>,
          ]}
        />
      </div>

      {narrow ? (
        <div
          ref={carouselRef}
          className="testimonial-carousel flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
          style={{ WebkitOverflowScrolling: "touch", paddingInline: "var(--gutter)" }}
        >
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              ref={(el) => { carouselCardRefs.current[i] = el; }}
              className="flex-shrink-0 snap-center"
              style={{ width: "min(80vw, 300px)", willChange: "transform" }}
            >
              <FanCardFace t={t} i={i} />
            </div>
          ))}
        </div>
      ) : (
        <Reveal y={60}>
          <div className="mx-auto flex justify-center" style={{ gap: 16, paddingTop: "4vh", paddingBottom: "2vh" }}>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="fan-card"
                style={{ width: 290, flex: "0 0 290px", ...fanTransform(i, hovered) }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(-1)}
              >
                <div ref={(el) => { swayRefs.current[i] = el; }} style={{ willChange: "transform" }}>
                  <FanCardFace t={t} i={i} />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   FAQ — visible answers to the questions buyers search for,
   mirrored into FAQPage structured data for rich results.
───────────────────────────────────────────────────── */
function FaqSection() {
  return (
    <section id="faq" className="section relative z-10 border-t border-line">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      <div className="shell grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <SectionLabel number="07" label="Questions" />
            <RevealLines
              className="display mt-6"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.4rem)" }}
              lines={[<span key="a">Frequently</span>, <span key="b">asked</span>, <span key="c" className="muted">questions</span>]}
            />
          </div>
        </div>

        <div className="md:col-span-8">
          <dl>
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={0.04 * i} y={24} className="group border-t border-line py-8 md:grid md:grid-cols-[2.5rem_1fr_1.25fr] md:gap-8 md:py-10">
                <span className="hidden font-mono text-[11px] tracking-[0.2em] text-ink-3 transition-colors duration-500 group-hover:text-accent-hi md:block" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <dt className="display text-[1.45rem] md:text-[1.6rem]" style={{ lineHeight: 1.1, letterSpacing: "-0.03em" }}>{f.q}</dt>
                <dd className="mt-4 text-[16px] leading-relaxed text-ink-2 md:mt-0">{f.a}</dd>
              </Reveal>
            ))}
          </dl>

          <Reveal className="border-t border-line pt-10">
            <p className="text-[17px] leading-relaxed text-ink-2">
              Still deciding?{" "}
              <a href="#contact" onClick={() => track("book_call_click", { location: "faq" })} className="link-u link-u--on font-bold text-ink">
                Book a free discovery call
              </a>{" "}
              — or email{" "}
              <a href={`mailto:${COMPANY.email}`} className="link-u link-u--on font-bold text-ink">
                {COMPANY.email}
              </a>
              .
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   CONTACT — the closing call to action
───────────────────────────────────────────────────── */
function Contact() {
  return (
    <section id="contact" className="section relative z-10 overflow-hidden border-t border-line">
      <Parallax speed={0.14} className="pointer-events-none absolute -right-[12%] top-[-10%] h-[70vw] max-h-[900px] w-[70vw] max-w-[900px] rounded-full" style={{ background: "radial-gradient(circle, rgba(10,144,216,0.34), transparent 65%)" }} />
      <Parallax speed={-0.1} className="pointer-events-none absolute -left-[18%] bottom-[-30%] h-[60vw] max-h-[760px] w-[60vw] max-w-[760px] rounded-full" style={{ background: "radial-gradient(circle, rgba(1,42,94,0.75), transparent 65%)" }} />

      <div className="shell relative">
        <SectionLabel number="08" label="Contact" />
        <RevealLines
          className="display t-hero mt-7"
          lines={[<span key="a">Book a free</span>, <span key="b" className="muted">discovery call</span>]}
        />

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal>
              <p className="t-lead max-w-xl">
                Every project starts with a discovery call and a written scope before any number is quoted.
              </p>
            </Reveal>
            <Reveal delay={0.12} className="mt-9">
              <a
                href={`mailto:${COMPANY.email}`}
                onClick={() => track("book_call_click", { location: "contact_email" })}
                data-cursor="Email us"
                className="display link-u link-u--on break-all text-ink transition-colors duration-500 hover:text-accent-hi"
                style={{ fontSize: "clamp(1.55rem, 4.6vw, 4.25rem)", lineHeight: 1.05 }}
              >
                {COMPANY.email}
              </a>
            </Reveal>
            <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a href={`mailto:${COMPANY.email}`} onClick={() => track("book_call_click", { location: "contact" })} className="btn btn-accent">
                  Book a call
                  <ArrowUpRight />
                </a>
              </Magnetic>
              <Magnetic>
                <a href={`tel:${COMPANY.phone}`} onClick={() => track("book_call_click", { location: "contact_phone" })} className="btn btn-ghost">
                  {COMPANY.phone}
                </a>
              </Magnetic>
            </Reveal>
          </div>

          <Reveal delay={0.25} className="md:col-span-4 md:col-start-9">
            <dl className="grid gap-6 border-t border-line-2 pt-6 text-[15px]">
              <div>
                <dt className="eyebrow mb-2">Studio</dt>
                <dd className="leading-relaxed text-ink-2">
                  {COMPANY.address.street}<br />
                  {COMPANY.address.locality} {COMPANY.address.postalCode}, Bangladesh
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-2">Languages</dt>
                <dd className="text-ink-2">English · Bengali</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
