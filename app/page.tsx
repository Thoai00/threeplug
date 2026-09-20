"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import HeroCarousel from "./HeroCarousel";
import ShipDeck from "./ShipDeck";
import WorkRing from "./WorkRing";
import SiteChrome, { SERVICE_MEGA } from "./SiteChrome";
import { WORK } from "./work/projects";
import { WorkGrid } from "./work/Cards";
import { useReveal } from "./work/useReveal";
import { track } from "./analytics";
import { COMPANY, FAQS, faqJsonLd } from "./seo";

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

const INDUSTRIES = [
  "Manufacturing", "Garments & Textiles", "Retail & E-commerce",
  "Education", "Healthcare", "Real Estate",
  "Logistics", "Hospitality", "Professional Services",
];

/* ─── ACCENT SYSTEM — every tone drawn from the logo's own blue gradient ─── */
const ACCENT = "#0a90d8";
const HOT    = "#00c0ff";

/* ─── HOOKS ─── */
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
      <SiteChrome />

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
      <FaqSection />
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

  const clientNames = ["BIDYALOY.ACADEMY", "CHORKI", "BALUCHOR", "GRAVIA GLASS"];
  // 4 copies (2 per half) so each half is wider than the container and the -50% loop never shows a gap.
  const marqueeRow = [...clientNames, ...clientNames, ...clientNames, ...clientNames];

  return (
    <section id="top" className="relative flex min-h-[86svh] flex-col justify-center overflow-hidden pb-10 pt-20 md:min-h-screen md:pb-16 md:pt-24">
      {/* Parallax background glow layer */}
      <div ref={parallaxBg} className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse 70% 60% at 50% 20%, rgba(10,144,216,0.08), transparent 70%)",
        willChange: "transform",
      }} />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center">
        <h1
          className="font-display font-black leading-[0.95] tracking-tight"
          style={{
            fontSize: "clamp(3.15rem, 8.2vw, 6rem)",
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

        <div className="mt-8 overflow-hidden md:mt-14" style={{ animation: mounted ? "fadeUp 1s 0.35s both" : "none" }}>
          <div className="flex w-max animate-[marquee_28s_linear_infinite] items-center">
            {marqueeRow.map((name, i) => (
              <span key={i} className="pr-10 text-[15px] font-bold uppercase tracking-wider md:pr-16 md:text-sm" style={{ color: "rgba(20,18,16,0.32)" }}>
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-9 flex flex-col items-center gap-7 md:mt-14 md:gap-8"
          style={{ animation: mounted ? "fadeUp 1s 0.5s both" : "none" }}>
          <p className="max-w-xl text-lg leading-relaxed" style={{ color: "rgba(20,18,16,0.6)" }}>
            Three Plug builds websites, web and mobile apps, desktop software, ERP and CRM
            systems, digital marketing, animation and interactive 3D — twelve service
            categories, delivered by one team, for clients anywhere in the world.
          </p>

          <a href="#contact" onClick={() => track("book_call_click", { location: "hero" })} className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-70"
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [useSimple, setUseSimple] = useState(false);

  useEffect(() => {
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setUseSimple(reduceMq.matches);
    update();
    reduceMq.addEventListener("change", update);
    return () => reduceMq.removeEventListener("change", update);
  }, []);

  // Scroll through the pinned section grows the card from a framed card to full-bleed.
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
  }, [useSimple]);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) v.play().catch(() => {});
    setMuted(v.muted);
    track("showreel_sound", { muted: v.muted });
  };

  const SoundButton = (
    <button
      type="button"
      onClick={toggleSound}
      aria-label={muted ? "Unmute showreel" : "Mute showreel"}
      aria-pressed={!muted}
      className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform hover:scale-110"
      style={{ background: "rgba(251,249,239,0.16)", backdropFilter: "blur(8px)", border: "1px solid rgba(251,249,239,0.3)" }}
    >
      {muted ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(251,249,239,0.92)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="m17 9 4 6M21 9l-4 6" />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(251,249,239,0.92)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      )}
    </button>
  );

  const Video = (
    <video
      ref={videoRef}
      src="/hero-web.mp4"
      poster="/hero-poster.jpg"
      muted
      loop
      playsInline
      preload="none"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );

  if (useSimple) {
    return (
      <section className="relative z-10 px-6 py-16 md:pl-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#141210] shadow-2xl" style={{ aspectRatio: "21 / 9" }}>
          {Video}
          {SoundButton}
        </div>
      </section>
    );
  }

  return (
    <section ref={wrapRef} className="relative z-10" style={{ height: "380vh" }}>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <div ref={cardRef} className="relative overflow-hidden bg-[#141210] shadow-2xl" style={{ width: "74vw", height: "46vh", borderRadius: 28 }}>
          {Video}
          {SoundButton}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   FEATURED WORK — centered intro + scroll cue, alternating full/split case-study feed
───────────────────────────────────────────────────── */

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
    <section id="work" ref={wrapRef} className="relative z-10 overflow-hidden py-16 md:py-28">
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
        <h2 className="font-display font-black leading-[0.9] tracking-tight" style={{ fontSize: "clamp(3.6rem,11vw,7rem)" }}>
          Featured<br /><span style={{ color: "var(--grey)" }}>work</span>
        </h2>
        <div className="mx-auto my-8 flex h-9 w-9 items-center justify-center rounded-full" style={{ border: "1px solid rgba(20,18,16,0.15)", animation: "floatY 2.4s ease-in-out infinite" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(20,18,16,0.5)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v16M6 14l6 6 6-6" /></svg>
        </div>
        <p className="mx-auto max-w-lg text-[17px] leading-relaxed md:text-base" style={{ color: "rgba(20,18,16,0.5)" }}>
          Every build here earns its keep — measured in hours saved, revenue moved, and deals closed, not just how it looks in a screenshot.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-6 md:mt-20 md:pl-24">
        <WorkGrid />
      </div>

      {/* Section-local floating CTA — visible only while this section is in view */}
      <div
        className="fixed bottom-6 left-1/2 z-[997] w-[calc(100vw-1.5rem)] max-w-[540px] rounded-full sm:w-auto"
        style={{
          background: "rgba(96,91,86,0.5)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 8px 40px rgba(20,18,16,0.22)",
          padding: 6,
          opacity: dockVisible ? 1 : 0,
          transform: `translate(-50%, ${dockVisible ? 0 : 12}px)`,
          pointerEvents: dockVisible ? "auto" : "none",
          transition: "opacity var(--dur-slow) var(--ease-flyout), transform var(--dur-slow) var(--ease-flyout)",
        }}
      >
        <a href="#contact" onClick={() => track("book_call_click", { location: "floating_dock" })} className="flex items-center justify-between gap-3 sm:gap-8">
          <span className="truncate pl-4 text-[13px] sm:pl-6 sm:text-[15px]" style={{ color: "rgba(251,249,239,0.92)" }}>
            Book a free discovery call
          </span>
          <span
            className="flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-[11px] font-black uppercase tracking-tight transition-transform hover:scale-[1.03] sm:px-7 sm:py-3.5 sm:text-[13px]"
            style={{ background: "#ffffff", color: "var(--ink)" }}
          >
            Book a call
          </span>
        </a>
      </div>
    </section>
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
    <section id="testimonials" ref={sectionRef} className="relative z-10 overflow-hidden py-16 md:py-28">
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
          <h2 className="mb-10 font-display font-black leading-[0.95] tracking-tight sm:mb-20" style={{ fontSize: "clamp(3.3rem,8.5vw,5.6rem)" }}>
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
   FAQ — visible answers to the questions buyers search for,
   mirrored into FAQPage structured data for rich results.
───────────────────────────────────────────────────── */
function FaqSection() {
  const [headRef, headVis] = useReveal(0.2);
  return (
    <section id="faq" className="relative z-10 px-6 py-16 md:py-28 md:pl-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      <div className="mx-auto max-w-5xl">
        <div
          ref={headRef}
          style={{
            opacity: headVis ? 1 : 0,
            transform: headVis ? "none" : "translateY(24px)",
            transition: "opacity 0.7s, transform 0.7s",
          }}
        >
          <SectionLabel number="07" label="Questions" />
          <h2 className="mb-10 font-display font-black leading-[0.95] tracking-tight sm:mb-16" style={{ fontSize: "clamp(2.6rem,7vw,4.6rem)" }}>
            Frequently asked<br /><span style={{ color: "var(--grey)" }}>questions</span>
          </h2>
        </div>

        <dl className="divide-y" style={{ borderColor: "rgba(20,18,16,0.12)" }}>
          {FAQS.map((f) => (
            <div key={f.q} className="border-t py-7 md:grid md:grid-cols-[1fr_1.35fr] md:gap-12" style={{ borderColor: "rgba(20,18,16,0.12)" }}>
              <dt className="font-display text-xl font-bold leading-snug tracking-tight md:text-2xl">{f.q}</dt>
              <dd className="mt-3 text-[17px] leading-relaxed md:mt-0 md:text-base" style={{ color: "rgba(20,18,16,0.62)" }}>{f.a}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-12 text-[17px] leading-relaxed md:text-base" style={{ color: "rgba(20,18,16,0.62)" }}>
          Still deciding?{" "}
          <a href="#contact" onClick={() => track("book_call_click", { location: "faq" })} className="font-bold underline underline-offset-4" style={{ color: "var(--ink)" }}>
            Book a free discovery call
          </a>{" "}
          — or email{" "}
          <a href={`mailto:${COMPANY.email}`} className="font-bold underline underline-offset-4" style={{ color: "var(--ink)" }}>
            {COMPANY.email}
          </a>
          .
        </p>
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
    <footer id="contact" data-theme="dark" className="relative z-10 mt-6 overflow-hidden px-6 md:pl-24" style={{ background: "var(--ink)" }}>
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
