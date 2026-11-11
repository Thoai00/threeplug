"use client";

import Link from "next/link";
import type { Project } from "./projects";
import { track } from "../analytics";
import { ArrowUpRight } from "../fx/icons";

const SIZES = {
  lg: { inset: "clamp(14px, 2vw, 24px)", h: 56, padX: 18, gap: 12, name: "clamp(15px, 1.5vw, 20px)", meta: "9.5px" },
  sm: { inset: "10px", h: 38, padX: 11, gap: 8, name: "13px", meta: "8.5px" },
} as const;

// Sits on top of a work card (the card must be `position: relative` and
// carry the `group` class):
//   · a full-card link underneath everything, so the whole card opens the case
//   · the project's name tag in the top-left corner
//   · a "Discover case" pill in the top-right that slides in on hover/focus
//     (always visible on touch screens, where there is no hover)
// All motion is transform + opacity, driven by CSS (.case-cta in globals.css).
export default function CaseLabel({ work: w, size = "lg" }: { work: Project; size?: keyof typeof SIZES }) {
  const z = SIZES[size];
  const href = `/work/${w.slug}`;

  return (
    <>
      <Link
        href={href}
        aria-label={`${w.name} case study`}
        className="absolute inset-0 z-10"
        tabIndex={-1}
        onClick={() => track("case_study_open", { project: w.slug, via: "card" })}
      />

      <div
        className="pointer-events-none absolute z-20 flex items-center rounded-xl"
        style={{
          top: z.inset,
          left: z.inset,
          height: z.h,
          paddingInline: z.padX,
          gap: z.gap,
          background: "rgba(5,7,12,0.82)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35), inset 0 0 0 1px var(--line-2)",
        }}
      >
        <span className="display whitespace-nowrap uppercase text-ink-2 transition-colors duration-500 group-hover:text-ink" style={{ fontSize: z.name, letterSpacing: "-0.02em", lineHeight: 1 }}>
          {w.name}
        </span>
        <span className={`${size === "lg" ? "hidden sm:inline" : "inline"} font-mono uppercase leading-[1.3] tracking-[0.14em] text-ink-3`} style={{ fontSize: z.meta }}>
          {w.year}
          <br />
          {w.tag}
        </span>
      </div>

      <Link
        href={href}
        onClick={() => track("case_study_open", { project: w.slug, via: "discover_case" })}
        className="case-cta absolute z-20 flex items-center gap-2.5 rounded-full bg-accent-hi font-bold uppercase text-[var(--on-accent)]"
        style={{
          top: z.inset,
          right: z.inset,
          height: z.h,
          paddingInline: size === "lg" ? 20 : 12,
          fontSize: size === "lg" ? 11.5 : 10,
          letterSpacing: "0.12em",
        }}
      >
        <span className="hidden whitespace-nowrap sm:inline">Discover case</span>
        <span className="sr-only sm:hidden">Discover case</span>
        <ArrowUpRight size={size === "lg" ? 16 : 12} />
      </Link>
    </>
  );
}
