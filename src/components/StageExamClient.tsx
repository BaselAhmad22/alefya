"use client";

import { FormEvent, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PageLoader } from "@/components/PageLoader";
import { Link } from "@/i18n/routing";

type PublicQ = {
  id: string;
  kind: "mcq" | "written";
  prompt: string;
  options?: string[];
};

type FeedbackItem = {
  id: string;
  score: number;
  feedback: string;
};

type Props = {
  trackSlug: string;
  stageSlug: string;
  stageTitle: string;
  nextHref: string | null;
};

export function StageExamClient({
  trackSlug,
  stageSlug,
  stageTitle,
  nextHref,
}: Props) {
  const t = useTranslations("exam");
  const locale = useLocale() as "ar" | "en";
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [format, setFormat] = useState<"mixed" | "mcq" | "written">("mixed");
  const [questions, setQuestions] = useState<PublicQ[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    passScore: number;
    feedback: FeedbackItem[];
  } | null>(null);

  async function startExam() {
    setLoading(true);
    setError(null);
    setResult(null);
    setAnswers({});
    const res = await fetch("/api/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "start",
        trackSlug,
        stageSlug,
        locale,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(
        data.error === "locked" ? t("locked") : t("startError"),
      );
      return;
    }
    setAttemptId(data.attemptId);
    setFormat(data.format);
    setQuestions(data.questions || []);
  }

  useEffect(() => {
    void startExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackSlug, stageSlug]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!attemptId) return;
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "submit",
        attemptId,
        locale,
        answers,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) {
      setError(t("submitError"));
      return;
    }
    setResult({
      score: data.score,
      passed: data.passed,
      passScore: data.passScore,
      feedback: data.feedback || [],
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-[12rem] items-center justify-center py-10">
        <PageLoader />
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="space-y-4">
        <p className="text-danger">{error}</p>
        <Link href={`/tracks/${trackSlug}`} className="text-accent hover:underline">
          {t("backToTrack")}
        </Link>
      </div>
    );
  }

  if (result) {
    return (
      <div className="space-y-6">
        <div
          className={`border px-5 py-4 ${
            result.passed
              ? "border-teal/40 bg-teal/10"
              : "border-danger/40 bg-danger/10"
          }`}
        >
          <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">
            {t("result")}
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-4xl">
            {result.score}
            <span className="text-lg text-ink-muted"> / 100</span>
          </p>
          <p className="mt-2 text-sm">
            {result.passed
              ? t("passed", { pass: result.passScore })
              : t("failed", { pass: result.passScore })}
          </p>
        </div>

        <ul className="space-y-3">
          {result.feedback.map((f, i) => (
            <li key={f.id} className="border border-line px-4 py-3 text-sm">
              <p className="text-ink-muted">
                {t("questionN", { n: i + 1 })} · {f.score}/100
              </p>
              <p className="mt-1">{f.feedback}</p>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-3">
          {result.passed && nextHref ? (
            <Link
              href={nextHref}
              className="rounded bg-accent px-4 py-2.5 text-sm font-medium text-bg"
            >
              {t("continueNext")}
            </Link>
          ) : null}
          {!result.passed ? (
            <button
              type="button"
              onClick={() => void startExam()}
              className="rounded bg-accent px-4 py-2.5 text-sm font-medium text-bg"
            >
              {t("retry")}
            </button>
          ) : null}
          <Link
            href={`/tracks/${trackSlug}`}
            className="rounded border border-line px-4 py-2.5 text-sm text-ink-muted hover:text-accent"
          >
            {t("backToTrack")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
        <span>
          {format === "mixed"
            ? t("formatMixed")
            : format === "mcq"
              ? t("formatMcq")
              : t("formatWritten")}
        </span>
        <span>·</span>
        <span>{stageTitle}</span>
        <span>·</span>
        <span>{t("questionCount", { n: questions.length })}</span>
      </div>

      {questions.map((q, i) => (
        <fieldset key={q.id} className="space-y-3 border-b border-line pb-6">
          <legend className="text-base font-medium">
            <span className="me-2 text-accent">{i + 1}.</span>
            <span
              className={`me-2 inline-flex rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${
                q.kind === "mcq"
                  ? "bg-teal/15 text-teal"
                  : "bg-accent/15 text-accent"
              }`}
            >
              {q.kind === "mcq" ? t("kindMcq") : t("kindWritten")}
            </span>
            {q.prompt}
          </legend>
          {q.kind === "mcq" && q.options ? (
            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                <label
                  key={oi}
                  className="flex cursor-pointer items-start gap-3 border border-line px-3 py-2.5 text-sm has-[:checked]:border-accent"
                >
                  <input
                    type="radio"
                    name={q.id}
                    required
                    value={oi}
                    checked={answers[q.id] === oi}
                    onChange={() =>
                      setAnswers((prev) => ({ ...prev, [q.id]: oi }))
                    }
                    className="mt-1"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          ) : (
            <textarea
              required
              rows={5}
              value={String(answers[q.id] ?? "")}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
              }
              className="w-full border border-line bg-bg-elevated px-3 py-2.5 text-sm outline-none focus:border-accent"
              placeholder={t("writtenPlaceholder")}
            />
          )}
        </fieldset>
      ))}

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-accent px-5 py-2.5 font-medium text-bg disabled:opacity-50"
      >
        {submitting ? t("grading") : t("submit")}
      </button>
      <p className="text-xs text-ink-muted">{t("aiGradeHint")}</p>
    </form>
  );
}
