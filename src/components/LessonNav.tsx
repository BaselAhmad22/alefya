"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link } from "@/i18n/routing";

export type LessonNavTarget = {
  href: string;
  label: string;
  title: string;
} | null;

type Props = {
  prev: LessonNavTarget;
  next: LessonNavTarget;
  /** Next is visible but blocked until the current lesson is marked complete. */
  nextBlocked?: boolean;
  blockedMessage?: string;
  ariaLabel: string;
};

function ArrowIcon({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      {dir === "prev" ? (
        <path
          d="M9.25 3.25 5 7.5l4.25 4.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M5.75 3.25 10 7.5 5.75 11.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function LessonNav({
  prev,
  next,
  nextBlocked = false,
  blockedMessage = "",
  ariaLabel,
}: Props) {
  const [hint, setHint] = useState<string | null>(null);
  const hintTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hintTimer.current) window.clearTimeout(hintTimer.current);
    };
  }, []);

  useEffect(() => {
    setHint(null);
  }, [next?.href, nextBlocked]);

  function showBlockedHint(e: MouseEvent<HTMLButtonElement>) {
    if (!blockedMessage) return;
    setHint(blockedMessage);
    // Drop focus so :focus-within doesn't keep the sticky bar fully opaque.
    e.currentTarget.blur();
    if (hintTimer.current) window.clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => setHint(null), 5200);
  }

  return (
    <nav className="lesson-nav" aria-label={ariaLabel}>
      <div className="lesson-nav-shell">
        <div className="lesson-nav-core">
          {prev ? (
            <Link
              href={prev.href}
              className="lesson-nav-btn lesson-nav-prev"
              title={prev.title}
              style={{ animationDelay: "40ms" }}
            >
              <span className="lesson-nav-chip" aria-hidden>
                <ArrowIcon dir="prev" />
              </span>
              <span className="lesson-nav-copy">
                <span className="lesson-nav-label">{prev.label}</span>
                <span className="lesson-nav-title">{prev.title}</span>
              </span>
            </Link>
          ) : (
            <span className="lesson-nav-empty" aria-hidden />
          )}

          {next ? (
            nextBlocked ? (
              <button
                type="button"
                className="lesson-nav-btn lesson-nav-next is-blocked"
                title={blockedMessage || next.title}
                style={{ animationDelay: "110ms" }}
                aria-disabled="true"
                onClick={showBlockedHint}
              >
                <span className="lesson-nav-copy">
                  <span className="lesson-nav-label">{next.label}</span>
                  <span className="lesson-nav-title">{next.title}</span>
                </span>
                <span className="lesson-nav-chip" aria-hidden>
                  <ArrowIcon dir="next" />
                </span>
              </button>
            ) : (
              <Link
                href={next.href}
                className="lesson-nav-btn lesson-nav-next"
                title={next.title}
                style={{ animationDelay: "110ms" }}
              >
                <span className="lesson-nav-copy">
                  <span className="lesson-nav-label">{next.label}</span>
                  <span className="lesson-nav-title">{next.title}</span>
                </span>
                <span className="lesson-nav-chip" aria-hidden>
                  <ArrowIcon dir="next" />
                </span>
              </Link>
            )
          ) : (
            <span className="lesson-nav-empty" aria-hidden />
          )}
        </div>

        {hint ? (
          <p className="lesson-nav-hint" role="alert">
            {hint}
          </p>
        ) : null}
      </div>
    </nav>
  );
}
