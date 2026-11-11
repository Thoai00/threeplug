import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../SiteFooter";
import Magnetic from "../fx/Magnetic";
import PageTransition from "../fx/PageTransition";
import { ArrowUpRight } from "../fx/icons";
import { WorkGrid } from "./Cards";
import { Reveal, RevealWords } from "./Motion";
import { CASES } from "./cases";
import { SITE_URL, breadcrumbJsonLd } from "../seo";

export const metadata: Metadata = {
  title: "Work — Case Studies in Software, ERP, CRM, Apps & Automation",
  description:
    "Case studies from Three Plug: school management platforms, ERP and CRM systems, iOS and Android apps, n8n workflow automation and AI agents — with the problem, the approach and the result for each build.",
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/work`,
    title: "Work — Case Studies in Software, ERP, CRM, Apps & Automation",
    description: "Platforms, apps, ERP and CRM systems, automation and AI agents built by Three Plug.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Three Plug case studies" }],
  },
};

export default function WorkIndexPage() {
  return (
    <PageTransition>
      <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Work — Three Plug case studies",
              url: `${SITE_URL}/work`,
              hasPart: CASES.map((c) => ({
                "@type": "CreativeWork",
                name: c.name,
                url: `${SITE_URL}/work/${c.slug}`,
                about: c.industry,
                description: c.tagline,
              })),
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }])) }}
        />

        <main id="main">
          <section className="relative overflow-hidden pb-6 pt-36 md:pt-48">
            <div className="hero-bg" aria-hidden="true" />
            <div className="hero-grid" aria-hidden="true" />
            <div className="shell relative">
              <Reveal y={12}>
                <nav className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3" aria-label="Breadcrumb">
                  <Link href="/" className="link-u transition-colors hover:text-ink">Home</Link>
                  <span className="mx-3">›</span>
                  <span className="text-ink-2">Work</span>
                </nav>
              </Reveal>

              <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end">
                <RevealWords
                  as="h1"
                  by="char"
                  text="Work"
                  stagger={0.06}
                  delay={0.1}
                  className="display md:col-span-7"
                  style={{ fontSize: "clamp(5rem, 21vw, 17rem)", lineHeight: 0.8 }}
                />
                <Reveal delay={0.5} className="md:col-span-4 md:col-start-9 md:pb-4">
                  <div className="eyebrow mb-4"><b>{String(CASES.length).padStart(2, "0")}</b><i />Case studies</div>
                  <p className="t-lead">
                    {CASES.length} builds — platforms, apps, ERP and CRM systems, automation and AI agents. Every one of them opens into the full case.
                  </p>
                </Reveal>
              </div>
            </div>
          </section>

          <div className="shell pb-16 pt-12 md:pb-24 md:pt-20">
            <WorkGrid />
          </div>

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
                  <Link href="/" className="btn btn-ghost">← Back home</Link>
                </Magnetic>
              </Reveal>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </PageTransition>
  );
}
