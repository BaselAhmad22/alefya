"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter as useNextRouter } from "next/navigation";
import { hideNavLoader, showNavLoader } from "@/lib/nav-loader";
import { notifyAppError } from "@/lib/app-error";

type Props = {
  trackSlug: string;
  lessonSlug: string;
  initialCompleted: boolean;
  /** True while Next is locked until this lesson is marked complete. */
  nextBlocked?: boolean;
};

export function LessonActions({
  trackSlug,
  lessonSlug,
  initialCompleted,
  nextBlocked = false,
}: Props) {
  const t = useTranslations("lesson");
  const nextRouter = useNextRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const [awaitingNext, setAwaitingNext] = useState(false);

  useEffect(() => {
    setCompleted(initialCompleted);
  }, [initialCompleted]);

  // Keep the loader up until Next is actually unlocked after refresh.
  useEffect(() => {
    if (!awaitingNext) return;
    if (completed && !nextBlocked) {
      setAwaitingNext(false);
      setLoading(false);
      hideNavLoader();
    }
  }, [awaitingNext, completed, nextBlocked]);

  async function mark() {
    setLoading(true);
    showNavLoader();
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackSlug, lessonSlug }),
      });
      if (!res.ok) {
        hideNavLoader();
        setLoading(false);
        notifyAppError();
        return;
      }
      setCompleted(true);
      setAwaitingNext(true);
      nextRouter.refresh();
      // If Next was never blocked, unlock immediately after save.
      if (!nextBlocked) {
        setAwaitingNext(false);
        setLoading(false);
        hideNavLoader();
      }
    } catch {
      setAwaitingNext(false);
      setLoading(false);
      hideNavLoader();
      notifyAppError();
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
