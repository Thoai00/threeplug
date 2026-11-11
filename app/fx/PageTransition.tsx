import { ViewTransition } from "react";

/**
 * PageTransition — wraps a route's content so navigating between pages
 * animates: the outgoing page lifts and fades, the incoming one rises in
 * (see `::view-transition-*(.page)` in globals.css). The fixed header and
 * cursor live in the root layout, outside this boundary, so they hold
 * still while the page changes underneath.
 *
 * Built on React's <ViewTransition>, enabled by `experimental.viewTransition`
 * in next.config.ts. Browsers without the View Transitions API navigate
 * normally, with no animation.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      {children}
    </ViewTransition>
  );
}
