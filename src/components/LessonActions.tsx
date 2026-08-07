"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter as useNextRouter } from "next/navigation";

type Props = {
  trackSlug: string;
  lessonSlug: string;
  initialCompleted: boolean;
};

export function LessonActions({
  trackSlug,
  lessonSlug,
  initialCompleted,
}: Props) {
  const t = useTranslations("lesson");
  const nextRouter = useNextRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  async function mark() {
    setLoading(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackSlug, lessonSlug }),
      });
      if (res.ok) {
        setCompleted(true);
        nextRouter.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  if (completed) {
    return (
      <span className="lesson-complete-badge">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
          className="shrink-0"
        >
          <circle cx="7" cy="7" r="6.25" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M4.2 7.1 6.1 9l3.7-4.2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {t("completed")}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void mark()}
      disabled={loading}
      className="btn-primary lesson-mark-btn disabled:opacity-50"
    >
      {loading ? "…" : t("markComplete")}
    </button>
  );
}
