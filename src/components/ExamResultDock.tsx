"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";

type Props = {
  trackSlug: string;
  stageSlug?: string;
  nextHref: string | null;
  passed: boolean;
  labels: {
    continueNext: string;
    retry: string;
    backToTrack: string;
  };
  onRetry?: () => void;
};

/**
 * Fixed bottom action island after exam results.
 * Keep a single instance — never also render an inline duplicate.
 */
export function ExamResultDock({
  trackSlug,
  stageSlug,
  nextHref,
  passed,
  labels,
  onRetry,
}: Props) {
  const retryHref = stageSlug ? `/exam/${trackSlug}/${stageSlug}` : null;
  const showContinue = Boolean(passed && nextHref);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      className={`exam-result-dock${ready ? " is-ready" : ""}`}
      role="navigation"
      aria-label={labels.retry}
    >
      <div className="exam-result-dock-bar">
        <span className="exam-result-dock-glow" aria-hidden />

        <Link
          href={`/tracks/${trackSlug}`}
          className="exam-result-btn exam-result-btn-ghost"
          style={{ ["--btn-i" as string]: 0 }}
        >
          <span className="exam-result-btn-ico" aria-hidden>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M9.25 3.25 5 7.5l4.25 4.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {labels.backToTrack}
        </Link>

        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className={`exam-result-btn ${
              showContinue ? "exam-result-btn-quiet" : "exam-result-btn-primary"
            }`}
            style={{ ["--btn-i" as string]: 1 }}
          >
            <span className="exam-result-btn-ico" aria-hidden>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M12.2 7.5A4.7 4.7 0 1 1 9.4 3.1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M9.1 1.8 11.4 3.4 9.5 5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {labels.retry}
          </button>
        ) : retryHref ? (
          <Link
            href={retryHref}
            className={`exam-result-btn ${
              showContinue ? "exam-result-btn-quiet" : "exam-result-btn-primary"
            }`}
            style={{ ["--btn-i" as string]: 1 }}
          >
            <span className="exam-result-btn-ico" aria-hidden>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M12.2 7.5A4.7 4.7 0 1 1 9.4 3.1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M9.1 1.8 11.4 3.4 9.5 5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {labels.retry}
          </Link>
        ) : null}

        {showContinue && nextHref ? (
          <Link
            href={nextHref}
            className="exam-result-btn exam-result-btn-primary"
            style={{ ["--btn-i" as string]: 2 }}
          >
            <span>{labels.continueNext}</span>
            <span className="exam-result-btn-arrow" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M5.25 3.25 9.5 7l-4.25 3.75"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
