"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/routing";

type Props = {
  score: number;
  scoreLabel: string;
  retryLabel: string;
  backCategoryLabel: string;
  backAllLabel: string;
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
  categorySlug,
  onRetry,
  tone,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [compact, setCompact] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const lastY = useRef(0);
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => setVisible(true));
    lastY.current = window.scrollY;

    const clearIdle = () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => setCompact(false), 420);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      setAtEnd(max > 40 && y >= max - 48);

      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) {
        setCompact(delta > 0 && y > 80);
        clearIdle();
      }
      lastY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, []);

  const toneClass =
    tone === "strong"
      ? "is-strong"
      : tone === "ok"
        ? "is-ok"
        : "is-weak";

  return (
    <div
      className={`interview-dock ${visible ? "is-visible" : ""} ${
        compact && !atEnd ? "is-compact" : ""
      } ${atEnd ? "is-at-end" : ""}`}
      role="navigation"
      aria-label={retryLabel}
    >
      <div className={`interview-dock-shell ${toneClass}`}>
        <div className="interview-dock-core">
          <div className="interview-dock-score">
            <span className="interview-dock-score-value tabular-nums">
              {score}
            </span>
            <span className="interview-dock-score-label">{scoreLabel}</span>
          </div>

          <div className="interview-dock-actions">
            <button
              type="button"
              className="interview-dock-primary"
              onClick={onRetry}
            >
              {retryLabel}
            </button>
            <Link
              href={`/interviews/${categorySlug}`}
              className="interview-dock-ghost"
            >
              {backCategoryLabel}
            </Link>
            <Link href="/interviews" className="interview-dock-ghost interview-dock-ghost-muted">
              {backAllLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
