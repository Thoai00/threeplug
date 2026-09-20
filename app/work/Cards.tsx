"use client";

// The Featured Work card set — shared by the home page section and /work,
// so both render the same design from one place.
import AutoVideo from "../AutoVideo";
import CaseLabel from "./CaseLabel";
import { useReveal } from "./useReveal";
import { WORK, type Project } from "./projects";

function FullWorkCard({ work: w }: { work: Project }) {
  const [ref, vis] = useReveal(0.15);
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-3xl bg-[#141210] bg-gradient-to-br ${w.color} p-10 md:p-14`}
      style={{
        minHeight: 340,
        aspectRatio: w.video ? "1280 / 672" : undefined,
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(28px)",
        transition: "opacity 0.8s, transform 0.8s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {w.video && w.poster ? (
        <AutoVideo src={w.video} poster={w.poster} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute bottom-8 left-8 right-8 md:bottom-10 md:left-10 md:right-10">
          <div className="max-w-xl font-display font-bold text-white" style={{ fontSize: "clamp(1.5rem,3.2vw,2.75rem)" }}>{w.title}</div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">{w.desc}</p>
        </div>
      )}
      <CaseLabel work={w} />
    </div>
  );
}

function IllustratedWorkCard({ work, title, subtitle, hues, bg = "linear-gradient(160deg, #fbf9ef, #f2f0e7)" }: { work: Project; title: string; subtitle: string; hues: [string, string, string]; bg?: string }) {
  const [ref, vis] = useReveal(0.15);
  return (
    <div
      ref={ref}
      className="relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-3xl p-9"
      style={{
        background: bg,
        border: "1px solid rgba(20,18,16,0.08)",
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(28px)",
        transition: "opacity 0.8s, transform 0.8s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40" style={{ background: hues[0], opacity: 0.85, borderRadius: "40% 60% 55% 45%", transform: "rotate(12deg)" }} />
      <div className="pointer-events-none absolute right-16 top-24 h-16 w-16 rounded-full" style={{ background: hues[1], opacity: 0.9 }} />
      <div className="pointer-events-none absolute -left-10 bottom-10 h-32 w-32" style={{ background: hues[2], opacity: 0.7, borderRadius: "55% 45% 60% 40%" }} />
      <CaseLabel work={work} />
      <div className="relative">
        <div className="font-display text-3xl font-black tracking-tight" style={{ color: "#141210" }}>{title}</div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-widest" style={{ color: "rgba(20,18,16,0.4)" }}>{subtitle}</div>
      </div>
    </div>
  );
}

function FlowWorkCard({ work: w, nodes }: { work: Project; nodes: string[] }) {
  const [ref, vis] = useReveal(0.15);
  return (
    <div
      ref={ref}
      className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-3xl px-9 pb-9 pt-36"
      style={{
        background: "linear-gradient(160deg, #24132d, #0d0712)",
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(28px)",
        transition: "opacity 0.8s 0.1s, transform 0.8s 0.1s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <CaseLabel work={w} />
      <div className="flex items-center justify-center py-6">
        {nodes.map((n, i) => (
          <div key={n} className="flex items-center">
            {i > 0 && <div className="h-px w-4 sm:w-7" style={{ background: "linear-gradient(90deg, rgba(234,75,113,0.25), #ea4b71)" }} />}
            <div className="rounded-xl px-2.5 py-2 text-[10px] font-semibold text-white" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(234,75,113,0.45)" }}>
              {n}
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="font-display text-2xl font-black tracking-tight text-white">{w.title}</div>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/55">{w.desc}</p>
      </div>
    </div>
  );
}

function AgentWorkCard({ work: w, task, steps }: { work: Project; task: string; steps: { label: string; done: boolean }[] }) {
  const [ref, vis] = useReveal(0.15);
  return (
    <div
      ref={ref}
      className="relative grid gap-8 overflow-hidden rounded-3xl px-10 pb-10 pt-36 md:grid-cols-2 md:items-center md:px-14 md:pb-14"
      style={{
        minHeight: 340,
        background: "radial-gradient(120% 90% at 85% 15%, rgba(124,92,255,0.3), transparent 60%), linear-gradient(160deg, #150f26, #07050d)",
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(28px)",
        transition: "opacity 0.8s, transform 0.8s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <CaseLabel work={w} />
      <div>
        <div className="max-w-xl font-display font-bold text-white" style={{ fontSize: "clamp(1.5rem,3.2vw,2.75rem)" }}>{w.title}</div>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">{w.desc}</p>
      </div>
      <div className="rounded-2xl p-5 font-mono text-[12px]" style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(124,92,255,0.35)" }}>
        <div className="mb-3 text-white/40">agent.run(&quot;{task}&quot;)</div>
        {steps.map((s, i) => (
          <div
            key={s.label}
            className="flex items-center gap-2.5 py-1"
            style={{
              color: s.done ? "rgba(255,255,255,0.82)" : "#b9a8ff",
              opacity: vis ? 1 : 0,
              transition: `opacity 0.5s ${0.3 + i * 0.25}s`,
            }}
          >
            <span className="w-3 text-center">{s.done ? "✓" : "…"}</span>
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function WordmarkWorkCard({ work, title, bg = "#141210" }: { work: Project; title: string; bg?: string }) {
  const [ref, vis] = useReveal(0.15);
  return (
    <div
      ref={ref}
      className="relative flex min-h-[320px] flex-col overflow-hidden rounded-3xl px-9 pb-9 pt-24"
      style={{
        background: bg,
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(28px)",
        transition: "opacity 0.8s, transform 0.8s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <CaseLabel work={work} />
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center font-display font-black leading-none tracking-tight text-white" style={{ fontSize: "clamp(1.75rem,3.5vw,3rem)" }}>{title}</div>
      </div>
    </div>
  );
}

export function WorkGrid() {
  return (
    <div className="flex flex-col gap-5">
      <FullWorkCard work={WORK[0]} />
      <div className="grid gap-5 md:grid-cols-2">
        <WordmarkWorkCard work={WORK[1]} title="Bidyaloy.academy" bg="linear-gradient(160deg, #0b2e5c, #011830)" />
        <IllustratedWorkCard work={WORK[4]} title="Sales CRM" subtitle="Lead to closed deal" hues={["#0b4a42", "#40d8ff", "#0a90d8"]} bg="linear-gradient(160deg, #effaf5, #d5eee3)" />
      </div>
      <FullWorkCard work={WORK[3]} />
      <div className="grid gap-5 md:grid-cols-2">
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
