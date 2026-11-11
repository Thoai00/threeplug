"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Link to a section of the home page, from anywhere.
 *
 * On the home page it renders a plain same-page anchor (`#work`), which
 * Lenis picks up and smooth-scrolls to. On any other page it renders a
 * client-side <Link> to `/#work`, so the visitor gets the page transition
 * and lands on that section.
 */
export default function HashLink({
  id, children, ...rest
}: { id: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const onHome = usePathname() === "/";
  if (onHome) {
    return <a href={`#${id}`} {...rest}>{children}</a>;
  }
  return <Link href={`/#${id}`} {...rest}>{children}</Link>;
}
