"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "./projects";
import { track } from "../analytics";

const EASE = "cubic-bezier(0.36,0.33,0,1)";

const SIZES = {
  lg: { inset: 24, h: 64, hOpen: 116, padX: 20, gap: 12, name: "clamp(18px, 4.6vw, 26px)", meta: "10.5px", cta: "16px", ctaInset: [16, 20], radius: 12 },
  sm: { inset: 10, h: 38, hOpen: 66, padX: 11, gap: 8, name: "13px", meta: "8.5px", cta: "11px", ctaInset: [8, 11], radius: 9 },
} as const;

// Dark name tag in the card's top-left corner. Hover/focus on the parent card
// stretches it to full width and reveals "Discover case". Widths are measured
// in px so the transition animates in every browser. Also renders a full-card
// link underneath, so the whole card opens the case page.
export default function CaseLabel({ work: w, size = "lg" }: { work: Project; size?: keyof typeof SIZES }) {
  const z = SIZES[size];
  const boxRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState({ closed: 0, open: 0 });
  const href = `/work/${w.slug}`;

  useEffect(() => {
    const row = rowRef.current;
    const card = boxRef.current?.parentElement;
    if (!row || !card) return;

    const measure = () => {
      const max = card.clientWidth - z.inset * 2;
      setWidth({ closed: Math.min(row.offsetWidth, max), open: max });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(card);
    ro.observe(row);

    const enter = (e: PointerEvent) => { if (e.pointerType === "mouse") setOpen(true); };
    const leave = () => setOpen(false);
    const focusIn = () => setOpen(true);
    const focusOut = (e: FocusEvent) => { if (!card.contains(e.relatedTarget as Node | null)) setOpen(false); };
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    card.addEventListener("focusin", focusIn);
    card.addEventListener("focusout", focusOut);
    return () => {
      ro.disconnect();
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
      card.removeEventListener("focusin", focusIn);
      card.removeEventListener("focusout", focusOut);
    };
  }, [z.inset]);

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
        ref={boxRef}
        className="absolute z-20 overflow-hidden"
        style={{
          pointerEvents: "none",
          top: z.inset,
          left: z.inset,
          borderRadius: z.radius,
          width: width.closed ? (open ? width.open : width.closed) : undefined,
          height: open ? z.hOpen : z.h,
          background: "#161412",
          boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
          transition: `width 0.55s ${EASE}, height 0.55s ${EASE}`,
        }}
      >
        <div ref={rowRef} className="flex w-max items-center" style={{ height: z.h, paddingInline: z.padX, gap: z.gap }}>
          <span
            className="whitespace-nowrap font-display font-black uppercase leading-none tracking-tight"
            style={{ fontSize: z.name, color: open ? "#ffffff" : "#8e827c", transition: "color 0.4s ease" }}
          >
            {w.name}
          </span>
          <span
            className={`${size === "lg" ? "hidden sm:inline" : "inline"} font-mono uppercase leading-[1.25] tracking-[0.14em] text-white/75`}
            style={{ fontSize: z.meta }}
          >
            {w.year}
            <br />
            {w.tag}
          </span>
        </div>
        <Link
          href={href}
          onClick={() => track("case_study_open", { project: w.slug, via: "discover_case" })}
          className="absolute font-display font-black uppercase tracking-tight text-white"
          style={{
            bottom: z.ctaInset[0],
            right: z.ctaInset[1],
            fontSize: z.cta,
            opacity: open ? 1 : 0,
            transform: open ? "none" : "translateY(8px)",
            transition: `opacity 0.35s ease ${open ? "0.15s" : "0s"}, transform 0.45s ${EASE}`,
            pointerEvents: open ? "auto" : "none",
          }}
        >
          Discover case
        </Link>
      </div>
    </>
  );
}
