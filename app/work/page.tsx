import type { Metadata } from "next";
import Link from "next/link";
import SiteChrome from "../SiteChrome";
import { WorkGrid } from "./Cards";
import { Reveal, RevealWords } from "./Motion";
import { CASES } from "./cases";

export const metadata: Metadata = {
  title: "Work — Three Plug",
  description: "Platforms, apps, ERP and CRM systems, automation and AI agents built by Three Plug.",
};

const HAIRLINE = "rgba(20,18,16,0.1)";

export default function WorkIndexPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <SiteChrome />

      <section className="px-6 pb-4 pt-36 text-center md:pt-44">
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
          style={{ fontSize: "clamp(3.5rem, 15vw, 11rem)" }}
        />

        <Reveal delay={0.5}>
          <p className="mx-auto mt-8 max-w-lg text-base leading-relaxed" style={{ color: "rgba(20,18,16,0.5)" }}>
            {CASES.length} builds — platforms, apps, ERP and CRM systems, automation and AI agents. Every one of them opens into the full case.
          </p>
        </Reveal>
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-16 pt-14 md:pl-32">
        <WorkGrid />
      </div>

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
          <Link href="/" className="rounded-full px-7 py-4 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-black/5" style={{ border: "1px solid rgba(20,18,16,0.25)" }}>
            ← Back home
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
