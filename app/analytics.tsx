"use client";

import Link from "next/link";
import { sendGTMEvent } from "@next/third-parties/google";

/** Push a named event into the GTM dataLayer. No-ops when GTM isn't configured. */
export function track(event: string, params: Record<string, string | number | boolean> = {}) {
  if (!process.env.NEXT_PUBLIC_GTM_ID) return;
  sendGTMEvent({ event, ...params });
}

/** Link that reports a conversion event before navigating. */
export function TrackedLink({
  href, event, params, className, style, children, ariaLabel,
}: {
  href: string;
  event: string;
  params?: Record<string, string | number | boolean>;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <Link href={href} aria-label={ariaLabel} className={className} style={style} onClick={() => track(event, params)}>
      {children}
    </Link>
  );
}
