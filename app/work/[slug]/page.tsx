import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AutoVideo from "../../AutoVideo";
import SiteChrome from "../../SiteChrome";
import { CASES, getCase } from "../cases";
import { WORK } from "../projects";
import { CountUp, Reveal, RevealMedia, RevealWords } from "../Motion";

export const dynamicParams = false;

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  return { title: `${c.name} — ${c.industry} case study · Three Plug`, description: c.tagline };
}

const DARK = "#141210";
const LIGHT_TEXT = "#fbf9ef";
const MUTED = "rgba(20,18,16,0.62)";
const HAIRLINE = "rgba(20,18,16,0.1)";

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();

  const project = WORK.find((w) => w.slug === c.slug);
  const next = CASES[(CASES.findIndex((x) => x.slug === c.slug) + 1) % CASES.length];
  // long names overflow at 16vw, so scale the cap with the character count
  const nameVw = Math.min(16, Math.round(150 / c.name.length));

  const meta = [
    { k: "Year", v: c.year },
    { k: "Industry", v: c.industry },
    { k: "Services", v: c.services },
  ];

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <SiteChrome />

      {/* Upper half — dark */}
      <section data-theme="dark" className="flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-36 text-center" style={{ background: DARK, color: LIGHT_TEXT }}>
        <Reveal y={12}>
          <nav className="font-mono text-xs" style={{ color: "rgba(251,249,239,0.35)" }} aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span className="mx-3">›</span>
            <Link href="/#work" className="transition-colors hover:text-white">Work</Link>
            <span className="mx-3">›</span>
            <span style={{ color: "rgba(251,249,239,0.7)" }}>{c.name}</span>
          </nav>
        </Reveal>

        <RevealWords
          as="h1"
          by="char"
          text={c.name}
          stagger={0.045}
          delay={0.15}
          className="mt-8 font-display font-black leading-[0.9] tracking-tight"
          style={{ fontSize: `clamp(3rem, ${nameVw}vw, 13rem)` }}
        />

        <dl className="mt-10 flex flex-wrap justify-center gap-x-16 gap-y-6">
          {meta.map((m, i) => (
            <Reveal key={m.k} delay={0.55 + i * 0.1} y={20}>
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "rgba(251,249,239,0.45)" }}>{m.k}</dt>
              <dd className="mt-1.5 text-base">{m.v}</dd>
            </Reveal>
          ))}
        </dl>

        <RevealWords
          as="p"
          text={c.tagline}
          stagger={0.025}
          delay={0.8}
          className="mx-auto mt-auto max-w-3xl pt-20 text-2xl leading-snug md:text-4xl"
        />
        <Reveal delay={1.3} y={10}>
          <div className="mt-10 font-mono text-xs" style={{ color: "rgba(251,249,239,0.3)" }}>(Scroll down)</div>
        </Reveal>
      </section>

      {/* Cover straddles the dark → light seam: the recording where there is one,
          the project's own colour otherwise */}
      <div className="relative">
        <div data-theme="dark" className="absolute inset-x-0 top-0 h-1/2" style={{ background: DARK }} />
        <div className="relative mx-auto max-w-7xl px-6 md:pl-32">
          <RevealMedia className="overflow-hidden rounded-3xl shadow-2xl" style={{ aspectRatio: "1280 / 672", background: "#1e1714" }}>
            {c.video ? (
              <AutoVideo src={c.video.src} poster={c.video.poster} className="h-full w-full object-cover" />
            ) : (
              <div className={`flex h-full w-full items-center justify-center bg-[#141210] bg-gradient-to-br ${project?.color ?? ""}`}>
                <span className="px-8 text-center font-display font-black uppercase leading-none tracking-tight" style={{ fontSize: "clamp(2rem, 7vw, 6rem)", color: "rgba(251,249,239,0.9)" }}>
                  {c.name}
                </span>
              </div>
            )}
          </RevealMedia>
        </div>
      </div>

      {/* Lower half — light */}
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-24 md:pl-32">
        {c.sections.map((s, i) => (
          <section key={s.label} className="border-t py-20 md:py-28" style={{ borderColor: HAIRLINE }}>
            <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-16">
              <Reveal y={16}>
                <div className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(20,18,16,0.45)" }}>
                  {String(i + 1).padStart(2, "0")} — {s.label}
                </div>
              </Reveal>
              <div>
                <RevealWords
                  text={s.heading}
                  className="max-w-3xl font-display font-bold leading-[1.05] tracking-tight"
                  style={{ fontSize: "clamp(2rem, 4.2vw, 3.5rem)" }}
                />
                <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed" style={{ color: MUTED }}>
                  {s.body.map((p, j) => (
                    <Reveal key={p} delay={0.15 + j * 0.12}>
                      <p>{p}</p>
                    </Reveal>
                  ))}
                </div>

                {s.palette && (
                  <ul className="mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-5">
                    {s.palette.map((p, j) => (
                      <li key={p.hex}>
                        <Reveal delay={j * 0.08} y={24} className="overflow-hidden rounded-2xl bg-white/60" style={{ border: `1px solid ${HAIRLINE}` }}>
                          <div className="h-24" style={{ background: p.hex }} />
                          <div className="px-3 py-2.5">
                            <div className="text-sm">{p.name}</div>
                            <div className="font-mono text-[11px]" style={{ color: "rgba(20,18,16,0.45)" }}>{p.hex}</div>
                          </div>
                        </Reveal>
                      </li>
                    ))}
                  </ul>
                )}

                {s.stats && (
                  <dl className="mt-12 grid max-w-3xl gap-8 sm:grid-cols-3">
                    {s.stats.map((st, j) => (
                      <Reveal key={st.label} delay={j * 0.1} className="border-t pt-5" style={{ borderColor: "rgba(20,18,16,0.18)" }}>
                        <dt>
                          <CountUp value={st.value} className="font-display font-black leading-none" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }} />
                        </dt>
                        <dd className="mt-3 text-sm" style={{ color: MUTED }}>{st.label}</dd>
                      </Reveal>
                    ))}
                  </dl>
                )}
              </div>
            </div>

            {s.image && (
              <RevealMedia className="mt-16 overflow-hidden rounded-3xl shadow-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
                <Image src={s.image.src} alt={s.image.alt} width={s.image.width} height={s.image.height} sizes="(min-width: 1280px) 1150px, 100vw" className="h-auto w-full" />
              </RevealMedia>
            )}
          </section>
        ))}
      </div>

      {/* Close */}
      <section className="border-t px-6 py-28 text-center md:pl-32" style={{ borderColor: HAIRLINE }}>
        <RevealWords
          text="Have a project like this?"
          className="mx-auto max-w-4xl font-display font-black leading-[0.95] tracking-tight"
          style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
        />
        <Reveal delay={0.3} className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link href="/#contact" className="rounded-full px-7 py-4 text-sm font-bold uppercase tracking-wide transition-transform hover:scale-105" style={{ background: "var(--ink)", color: "var(--bg)" }}>
            Book a call
          </Link>
          <Link href="/#work" className="rounded-full px-7 py-4 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-black/5" style={{ border: "1px solid rgba(20,18,16,0.25)" }}>
            ← All work
          </Link>
        </Reveal>
        <Reveal delay={0.45} className="mt-14">
          <Link href={`/work/${next.slug}`} className="group inline-flex flex-col items-center gap-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "rgba(20,18,16,0.45)" }}>Next case</span>
            <span className="font-display text-2xl font-black tracking-tight transition-transform group-hover:translate-x-1 md:text-3xl">{next.name} →</span>
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
