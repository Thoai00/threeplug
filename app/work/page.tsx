import type { Metadata } from "next";
import Link from "next/link";
import SiteChrome from "../SiteChrome";
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

const HAIRLINE = "rgba(20,18,16,0.1)";

export default function WorkIndexPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
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
      <SiteChrome />

      <section className="px-6 pb-4 pt-28 text-center md:pt-44">
        <Reveal y={12}>
          <nav className="font-mono text-xs" style={{ color: "rgba(20,18,16,0.4)" }} aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-[var(--ink)]">Home</Link>
            <span className="mx-3">›</span>
            <span style={{ color: "rgba(20,18,16,0.7)" }}>Work</span>
          </nav>
        </Reveal>

        <RevealWords
          as="h1"
          by="char"
          text="Work"
          stagger={0.06}
          delay={0.1}
          className="mt-6 font-display font-black leading-[0.9] tracking-tight"
          style={{ fontSize: "clamp(4.2rem, 17vw, 11rem)" }}
        />

        <Reveal delay={0.5}>
          <p className="mx-auto mt-7 max-w-lg text-[17px] leading-relaxed md:text-base" style={{ color: "rgba(20,18,16,0.5)" }}>
            {CASES.length} builds — platforms, apps, ERP and CRM systems, automation and AI agents. Every one of them opens into the full case.
          </p>
        </Reveal>
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-12 pt-10 md:pb-16 md:pt-14 md:pl-32">
        <WorkGrid />
      </div>

      <section className="border-t px-6 py-16 text-center md:py-28 md:pl-32" style={{ borderColor: HAIRLINE }}>
        <RevealWords
          text="Have a project like this?"
          className="mx-auto max-w-4xl font-display font-black leading-[0.95] tracking-tight"
          style={{ fontSize: "clamp(3rem, 9vw, 6rem)" }}
        />
        <Reveal delay={0.3} className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link href="/#contact" className="rounded-full px-7 py-4 text-sm font-bold uppercase tracking-wide transition-transform hover:scale-105" style={{ background: "var(--ink)", color: "var(--bg)" }}>
            Book a call
          </Link>
          <Link href="/" className="rounded-full px-7 py-4 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-black/5" style={{ border: "1px solid rgba(20,18,16,0.25)" }}>
            ← Back home
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
