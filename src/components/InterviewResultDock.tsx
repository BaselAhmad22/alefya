"use client";

import { Link } from "@/i18n/routing";

type Props = {
  score: number;
  scoreLabel: string;
  retryLabel: string;
  backCategoryLabel: string;
  backAllLabel: string;
  nextLabel: string;
  categorySlug: string;
  onRetry: () => void;
  tone: "strong" | "ok" | "weak";
};

export function InterviewResultDock({
  score,
  scoreLabel,
  retryLabel,
  backCategoryLabel,
  backAllLabel,
  nextLabel,
  categorySlug,
  onRetry,
  tone,
}: Props) {
  const toneClass =
    tone === "strong"
      ? "is-strong"
      : tone === "ok"
        ? "is-ok"
        : "is-weak";

  return (
    <section
      className={`interview-result-footer animate-rise ${toneClass}`}
      aria-label={nextLabel}
    >
      <div className="interview-result-footer-glow" aria-hidden />

      <div className="interview-result-footer-score">
        <span className="interview-result-footer-ring" aria-hidden />
        <span className="interview-result-footer-score-value tabular-nums">
          {score}
        </span>
        <span className="interview-result-footer-score-label">{scoreLabel}</span>
      </div>

      <div className="interview-result-footer-copy">
        <p className="interview-result-footer-kicker">AlefYa</p>
        <h2 className="interview-result-footer-title">{nextLabel}</h2>
      </div>

      <div className="interview-result-footer-actions">
        <button
          type="button"
          className="btn-primary interview-result-footer-primary"
          onClick={onRetry}
        >
          {retryLabel}
        </button>
        <div className="interview-result-footer-links">
          <Link
            href={`/interviews/${categorySlug}`}
            className="btn-ghost interview-result-footer-ghost"
          >
            {backCategoryLabel}
          </Link>
          <Link
            href="/interviews"
            className="btn-ghost interview-result-footer-ghost"
          >
            {backAllLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
