"use client";

// The Featured Work card set — shared by the home page section and /work,
// so both render the same design from one place.
//
// Every card is the same shell: it fades up on scroll, lifts with a blue
// glow on hover, leans toward the pointer (Tilt) with a light that follows
// it, and carries the CaseLabel (name tag + "Discover case"). What differs
// is only the art inside.
import AutoVideo from "../AutoVideo";
import Tilt from "../fx/Tilt";
import CaseLabel from "./CaseLabel";
import { Reveal, RevealMedia } from "./Motion";
import { useReveal } from "./useReveal";
import { WORK, type Project } from "./projects";

function CardShell({
  work, children, className = "", style, delay = 0,
}: { work: Project; children: React.ReactNode; className?: string; style?: React.CSSProperties; delay?: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="lift h-full">
        <Tilt max={2.2} cursor="View case" className={`card group h-full ${className}`} style={style}>
          {children}
          <CaseLabel work={work} />
        </Tilt>
      </div>
    </Reveal>
  );
}

const TITLE = "display relative z-[2] max-w-xl text-ink";
const DESC = "relative z-[2] mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-2";

function FullWorkCard({ work: w }: { work: Project }) {
  return (
    <CardShell
      work={w}
      className={`bg-panel bg-gradient-to-br ${w.color} p-8 md:p-14`}
      // a video card takes the recording's own ratio; a min-height on top of
      // that would force it wider than a phone screen
      style={w.video ? { aspectRatio: "1280 / 672" } : { minHeight: 360 }}
    >
      {w.video && w.poster ? (
        // image zoom-and-mask reveal: uncovered on scroll, eases in on hover
        <RevealMedia className="absolute inset-0">
          <AutoVideo src={w.video} poster={w.poster} className="zoom h-full w-full object-cover" />
        </RevealMedia>
      ) : (
        <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12">
          <div className={TITLE} style={{ fontSize: "clamp(1.6rem,3.3vw,3rem)", lineHeight: 1 }}>{w.title}</div>
          <p className={DESC}>{w.desc}</p>
        </div>
      )}
    </CardShell>
  );
}

function IllustratedWorkCard({ work, title, subtitle, hues, bg = "linear-gradient(160deg, #0b2a2e, #06141a)" }: { work: Project; title: string; subtitle: string; hues: [string, string, string]; bg?: string }) {
  return (
    <CardShell work={work} className="flex min-h-[340px] flex-col justify-end p-8 md:p-10" style={{ background: bg }}>
      <div className="zoom pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-8 -top-10 h-44 w-44" style={{ background: hues[0], opacity: 0.9, borderRadius: "40% 60% 55% 45%", transform: "rotate(12deg)" }} />
        <div className="absolute right-20 top-28 h-16 w-16 rounded-full" style={{ background: hues[1], opacity: 0.95 }} />
        <div className="absolute -left-10 bottom-10 h-32 w-32" style={{ background: hues[2], opacity: 0.55, borderRadius: "55% 45% 60% 40%" }} />
      </div>
      <div className="relative z-[2]">
        <div className="display text-ink" style={{ fontSize: "clamp(1.9rem,3vw,2.6rem)", lineHeight: 1 }}>{title}</div>
        <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-2">{subtitle}</div>
      </div>
    </CardShell>
  );
}

function FlowWorkCard({ work: w, nodes }: { work: Project; nodes: string[] }) {
  return (
    <CardShell
      work={w}
      delay={0.1}
      className="flex min-h-[340px] flex-col justify-between px-8 pb-8 pt-32 md:px-10 md:pb-10"
      style={{ background: "linear-gradient(160deg, #24132d, #0d0712)" }}
    >
      <div className="relative z-[2] flex items-center justify-center py-6">
        {nodes.map((n, i) => (
          <div key={n} className="flex items-center">
            {i > 0 && <div className="h-px w-4 sm:w-7" style={{ background: "linear-gradient(90deg, rgba(234,75,113,0.25), #ea4b71)" }} />}
            <div className="rounded-xl px-2.5 py-2 text-[10.5px] font-semibold text-white" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(234,75,113,0.45)" }}>
              {n}
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className={TITLE} style={{ fontSize: "clamp(1.5rem,2.3vw,2rem)", lineHeight: 1.02 }}>{w.title}</div>
        <p className={DESC}>{w.desc}</p>
      </div>
    </CardShell>
  );
}

function AgentWorkCard({ work: w, task, steps }: { work: Project; task: string; steps: { label: string; done: boolean }[] }) {
  const [ref, vis] = useReveal(0.3);
  return (
    <CardShell
      work={w}
      className="grid gap-8 px-8 pb-8 pt-32 md:grid-cols-2 md:items-center md:px-14 md:pb-14"
      style={{
        minHeight: 360,
        background: "radial-gradient(120% 90% at 85% 15%, rgba(124,92,255,0.3), transparent 60%), linear-gradient(160deg, #150f26, #07050d)",
      }}
    >
      <div>
        <div className={TITLE} style={{ fontSize: "clamp(1.6rem,3.3vw,3rem)", lineHeight: 1 }}>{w.title}</div>
        <p className={DESC}>{w.desc}</p>
      </div>
      <div ref={ref} className="relative z-[2] rounded-2xl p-5 font-mono text-[12px]" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(124,92,255,0.35)" }}>
        <div className="mb-3 text-white/50">agent.run(&quot;{task}&quot;)</div>
        {steps.map((s, i) => (
          <div
            key={s.label}
            className="flex items-center gap-2.5 py-1"
            style={{
              color: s.done ? "rgba(255,255,255,0.85)" : "#b9a8ff",
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translate3d(-8px,0,0)",
              transition: `opacity 0.5s ${0.3 + i * 0.25}s, transform 0.6s ${0.3 + i * 0.25}s var(--ease)`,
            }}
          >
            <span className="w-3 text-center">{s.done ? "✓" : "…"}</span>
            {s.label}
          </div>
        ))}
      </div>
    </CardShell>
  );
}

function WordmarkWorkCard({ work, title, bg = "var(--panel)" }: { work: Project; title: string; bg?: string }) {
  return (
    <CardShell work={work} className="flex min-h-[340px] flex-col px-8 pb-8 pt-24 md:px-10" style={{ background: bg }}>
      <div className="relative z-[2] flex flex-1 items-center justify-center">
        <div className="zoom display text-center text-ink" style={{ fontSize: "clamp(1.9rem,3.6vw,3.2rem)", lineHeight: 0.95 }}>{title}</div>
      </div>
    </CardShell>
  );
}

export function WorkGrid() {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <FullWorkCard work={WORK[0]} />
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        <WordmarkWorkCard work={WORK[1]} title="Bidyaloy.academy" bg="linear-gradient(160deg, #0b2e5c, #011830)" />
        <IllustratedWorkCard work={WORK[4]} title="Sales CRM" subtitle="Lead to closed deal" hues={["#0b4a42", "#40d8ff", "#0a90d8"]} />
      </div>
      <FullWorkCard work={WORK[3]} />
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        <FlowWorkCard work={WORK[5]} nodes={["Form", "Filter", "CRM", "WhatsApp"]} />
        <WordmarkWorkCard work={WORK[2]} title="Health & Wellness App" bg="linear-gradient(160deg, #0b4a42, #05221d)" />
      </div>
      <FullWorkCard work={WORK[6]} />
      <AgentWorkCard
        work={WORK[7]}
        task="chase overdue invoices"
        steps={[
          { label: "Read request from inbox", done: true },
          { label: "Query ERP for overdue invoices", done: true },
          { label: "Draft personalised reminders", done: true },
          { label: "Log follow-ups in CRM", done: true },
          { label: "Waiting for human approval", done: false },
        ]}
      />
    </div>
  );
}
