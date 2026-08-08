"use client";

import type { ReactNode } from "react";
import { Link } from "@/i18n/routing";

type Common = {
  children: ReactNode;
  className?: string;
};

type LinkProps = Common & {
  href: string;
  onClick?: never;
};

type ButtonProps = Common & {
  href?: undefined;
  onClick?: () => void;
  disabled?: boolean;
};

function BackVisual({ children }: { children: ReactNode }) {
  return (
    <>
      <span className="ay-back-chip" aria-hidden>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M8.75 3.25 5 7l3.75 3.75"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="ay-back-label">{children}</span>
    </>
  );
}

/** Clear, clickable back control used across the site. */
export function BackLink(props: LinkProps | ButtonProps) {
  const className = ["ay-back", props.className].filter(Boolean).join(" ");

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={className}>
        <BackVisual>{props.children}</BackVisual>
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={props.onClick}
      disabled={"disabled" in props ? props.disabled : false}
    >
      <BackVisual>{props.children}</BackVisual>
    </button>
  );
}
