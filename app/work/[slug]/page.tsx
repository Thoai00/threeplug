import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AutoVideo from "../../AutoVideo";
import SiteFooter from "../../SiteFooter";
import Magnetic from "../../fx/Magnetic";
import PageTransition from "../../fx/PageTransition";
import { ArrowRight, ArrowUpRight } from "../../fx/icons";
import { CASES, getCase } from "../cases";
import { WORK } from "../projects";
import { COMPANY, SITE_URL, breadcrumbJsonLd } from "../../seo";
import { CountUp, Reveal, RevealMedia, RevealWords } from "../Motion";

export const dynamicParams = false;

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  const url = `${SITE_URL}/work/${c.slug}`;
  const image = c.video?.poster ?? "/og.jpg";
  return {
    title: `${c.name} — ${c.services} case study`,
    description: `${c.tagline} A Three Plug case study covering the challenge, the approach and the result for this ${c.industry.toLowerCase()} project.`,
    keywords: [c.name, `${c.industry} software`, ...c.services.split(" · "), "case study", "Three Plug"],
    alternates: { canonical: `/work/${c.slug}` },
    openGraph: {
      type: "article",
      url,
      title: `${c.name} — ${c.services}`,
      description: c.tagline,
      images: [{ url: image, alt: `${c.name} — ${c.tagline}` }],
    },
    twitter: { card: "summary_large_image", title: `${c.name} — ${c.services}`, description: c.tagline, images: [image] },
  };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();

  const project = WORK.find((w) => w.slug === c.slug);
  const next = CASES[(CASES.findIndex((x) => x.slug === c.slug) + 1) % CASES.length];
  // long names overflow at 16vw, so scale the cap with the character count
  const nameVw = Math.min(17, Math.round(150 / c.name.length));

  const meta = [
    { k: "Year", v: c.year },
    { k: "Industry", v: c.industry },
    { k: "Services", v: c.services },
  ];

  return (
    // keyed by slug so "Next case" (same route, new params) also transitions
    <PageTransition key={c.slug}>
      <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              name: c.name,
              headline: `${c.name} — ${c.services}`,
              description: c.tagline,
              url: `${SITE_URL}/work/${c.slug}`,
              about: c.industry,
              dateCreated: c.year,
              inLanguage: "en",
              creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: COMPANY.legalName },
              ...(c.video ? { video: { "@type": "VideoObject", name: `${c.name} walkthrough`, description: c.tagline, thumbnailUrl: `${SITE_URL}${c.video.poster}`, contentUrl: `${SITE_URL}${c.video.src}`, uploadDate: `${c.year}-01-01` } } : {}),
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Work", path: "/work" },
              { name: c.name, path: `/work/${c.slug}` },
            ])),
          }}
        />

        <main id="main">
          {/* Hero — the project's own colour falling into the site's midnight */}
          <section
            className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-12 pt-36 md:pb-16 md:pt-44"
            style={{ background: `linear-gradient(170deg, ${c.hero[0]} 0%, ${c.hero[1]} 58%, var(--bg) 100%)` }}
          >
            <div className="hero-grid" aria-hidden="true" />
            <div className="shell relative">
              <Reveal y={12}>
                <nav className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3" aria-label="Breadcrumb">
                  <Link href="/" className="link-u transition-colors hover:text-ink">Home</Link>
                  <span className="mx-3">›</span>
                  <Link href="/#work" className="link-u transition-colors hover:text-ink">Work</Link>
                  <span className="mx-3">›</span>
                  <span className="text-ink-2">{c.name}</span>
                </nav>
              </Reveal>

              <RevealWords
                as="h1"
                by="char"
                text={c.name}
                stagger={0.045}
                delay={0.15}
                className="display mt-8"
                style={{ fontSize: `clamp(3.2rem, ${nameVw}vw, 15rem)`, lineHeight: 0.84 }}
              />

              <div className="mt-12 grid gap-10 border-t border-line-2 pt-8 md:mt-16 md:grid-cols-12">
                <dl className="flex flex-wrap gap-x-12 gap-y-6 md:col-span-5">
                  {meta.map((m, i) => (
                    <Reveal key={m.k} delay={0.55 + i * 0.1} y={20}>
                      <dt className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-3">{m.k}</dt>
                      <dd className="mt-1.5 text-[15px] text-ink">{m.v}</dd>
                    </Reveal>
                  ))}
                </dl>

                <div className="md:col-span-7">
                  <RevealWords
                    as="p"
                    text={c.tagline}
                    stagger={0.025}
                    delay={0.8}
                    className="display"
                    style={{ fontSize: "clamp(1.5rem, 3vw, 2.75rem)", lineHeight: 1.08, letterSpacing: "-0.03em" }}
                  />
                  <Reveal delay={1.3} y={10}>
                    <div className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">(Scroll down)</div>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>

          {/* Cover — the recording where there is one, the project's own colour otherwise */}
          <div className="shell pt-4 md:pt-6">
            <RevealMedia className="rounded-3xl" style={{ aspectRatio: "1280 / 672", background: c.hero[1], boxShadow: "0 40px 100px -30px rgba(0,0,0,0.8), inset 0 0 0 1px var(--line)" }}>
              {c.video ? (
                <AutoVideo src={c.video.src} poster={c.video.poster} className="h-full w-full object-cover" />
              ) : (
                <div className={`flex h-full w-full items-center justify-center bg-panel bg-gradient-to-br ${project?.color ?? ""}`}>
                  <span className="display px-8 text-center uppercase text-ink" style={{ fontSize: "clamp(2rem, 7vw, 6rem)" }}>
                    {c.name}
                  </span>
                </div>
              )}
            </RevealMedia>
          </div>

          {/* Sections */}
          <div className="shell pb-10 pt-16 md:pt-24">
            {c.sections.map((s, i) => (
              <section key={s.label} className="border-t border-line py-14 md:py-28">
                <div className="grid gap-8 md:grid-cols-12 md:gap-10">
                  <Reveal y={16} className="md:col-span-3">
                    <div className="eyebrow md:sticky md:top-32"><b>{String(i + 1).padStart(2, "0")}</b><i />{s.label}</div>
                  </Reveal>
                  <div className="md:col-span-9">
                    <RevealWords
                      text={s.heading}
                      className="display max-w-4xl"
                      style={{ fontSize: "clamp(2.3rem, 5.2vw, 4.25rem)", lineHeight: 0.98 }}
                    />
                    <div className="mt-8 max-w-2xl space-y-5 text-[17px] leading-relaxed text-ink-2 md:text-lg">
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
                            <Reveal delay={j * 0.08} y={24} className="card">
                              <div className="h-24" style={{ background: p.hex }} />
                              <div className="px-3 py-2.5">
                                <div className="text-sm text-ink">{p.name}</div>
                                <div className="font-mono text-[11px] text-ink-3">{p.hex}</div>
                              </div>
                            </Reveal>
                          </li>
                        ))}
                      </ul>
                    )}

                    {s.stats && (
                      <dl className="mt-12 grid max-w-3xl gap-8 sm:grid-cols-3">
                        {s.stats.map((st, j) => (
                          <Reveal key={st.label} delay={j * 0.1} className="border-t border-line-2 pt-5">
                            <dt>
                              <CountUp value={st.value} className="display" style={{ fontSize: "clamp(2.75rem, 5.5vw, 4.75rem)" }} />
                            </dt>
                            <dd className="mt-3 text-sm text-ink-2">{st.label}</dd>
                          </Reveal>
                        ))}
                      </dl>
                    )}
                  </div>
                </div>

                {s.image && (
                  <RevealMedia className="group mt-16 rounded-3xl" style={{ boxShadow: "inset 0 0 0 1px var(--line), 0 30px 80px -30px rgba(0,0,0,0.8)" }}>
                    <Image src={s.image.src} alt={s.image.alt} width={s.image.width} height={s.image.height} sizes="(min-width: 1280px) 1400px, 100vw" className="zoom h-auto w-full" />
                  </RevealMedia>
                )}
              </section>
            ))}
          </div>

          {/* Close */}
          <section className="section border-t border-line text-center">
            <div className="shell">
              <RevealWords
                text="Have a project like this?"
                className="display mx-auto max-w-5xl"
                style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)" }}
              />
              <Reveal delay={0.3} className="mt-12 flex flex-wrap items-center justify-center gap-3">
                <Magnetic>
                  <Link href="/#contact" className="btn btn-accent">
                    Book a call
                    <ArrowUpRight />
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link href="/#work" className="btn btn-ghost">← All work</Link>
                </Magnetic>
              </Reveal>
            </div>
          </section>

          {/* Next case — a full-width band, the whole thing is the link */}
          <Link href={`/work/${next.slug}`} data-cursor="Next case" className="group block border-t border-line transition-colors duration-700 hover:bg-panel">
            <div className="shell flex items-end justify-between gap-6 py-12 md:py-20">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">Next case</span>
                <span className="display mt-3 block transition-colors duration-500 group-hover:text-accent-hi" style={{ fontSize: "clamp(2.4rem, 8vw, 7rem)" }}>
                  {next.name}
                </span>
              </div>
              <span className="mb-2 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-ink transition-transform duration-700 group-hover:translate-x-2 md:h-20 md:w-20" style={{ boxShadow: "inset 0 0 0 1px var(--line-2)", transitionTimingFunction: "var(--ease)" }}>
                <ArrowRight size={22} />
              </span>
            </div>
          </Link>
        </main>

        <SiteFooter />
      </div>
    </PageTransition>
  );
}
