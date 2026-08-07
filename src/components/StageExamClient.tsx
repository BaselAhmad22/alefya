"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LeaveGuard } from "@/components/LeaveGuard";
import { PageLoader } from "@/components/PageLoader";
import { ExamResultDock } from "@/components/ExamResultDock";
import { Link } from "@/i18n/routing";
import type { ExamReport } from "@/lib/exams";

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
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
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
    report?: ExamReport;
  } | null>(null);

  async function startExam() {
    setLoading(true);
    setStarted(true);
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
      setError(data.error === "locked" ? t("locked") : t("startError"));
      return;
    }
    setAttemptId(data.attemptId);
    setFormat(data.format);
    setQuestions(data.questions || []);
  }

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
      report: data.report,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const inProgress = Boolean(attemptId && questions.length > 0 && !result);

  const leaveGuard = (
    <LeaveGuard
      active={inProgress || submitting}
      title={t("leaveTitle")}
      description={t("leaveDesc")}
      confirmLabel={t("leaveConfirm")}
      cancelLabel={t("leaveCancel")}
    />
  );

  function ResultActions() {
    return (
      <ExamResultDock
        trackSlug={trackSlug}
        nextHref={nextHref}
        passed={Boolean(result?.passed)}
        labels={{
          continueNext: t("continueNext"),
          retry: t("retryPractice"),
          backToTrack: t("backToTrack"),
        }}
        onRetry={() => void startExam()}
      />
    );
  }

  if (!started) {
    return (
      <section className="exam-intro" aria-labelledby="exam-intro-title">
        <div className="exam-intro-card">
          <p className="exam-intro-kicker">{stageTitle}</p>
          <h2 id="exam-intro-title" className="exam-intro-title">
            {t("introTitle")}
          </h2>
          <p className="exam-intro-lead">{t("introLead")}</p>

          <ul className="exam-intro-points">
            <li>{t("introPointPass")}</li>
            <li>{t("introPointMixed")}</li>
            <li>{t("introPointRetry")}</li>
            <li>{t("introPointFocus")}</li>
          </ul>

          <div className="exam-intro-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={() => void startExam()}
            >
              {t("beginExam")}
            </button>
            <Link href={`/tracks/${trackSlug}`} className="btn-ghost">
              {t("backToTrack")}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <>
        {leaveGuard}
        <div className="flex min-h-[12rem] items-center justify-center py-10">
          <PageLoader />
        </div>
      </>
    );
  }

  if (error && !questions.length) {
    return (
      <>
        {leaveGuard}
        <div className="space-y-4">
          <p className="text-danger">{error}</p>
          <Link href={`/tracks/${trackSlug}`} className="text-accent hover:underline">
            {t("backToTrack")}
          </Link>
        </div>
      </>
    );
  }

  if (submitting) {
    return (
      <>
        {leaveGuard}
        <div
          className="flex min-h-[18rem] flex-col items-center justify-center gap-5 py-12 text-center"
          aria-live="polite"
        >
          <PageLoader />
          <p className="max-w-md text-sm text-ink-muted">{t("analyzing")}</p>
        </div>
      </>
    );
  }

  if (result) {
    return (
      <div className="exam-result-page space-y-6 pb-28">
        <div
          className={`exam-result-hero ${
            result.passed ? "is-pass" : "is-fail"
          }`}
        >
          <p className="exam-result-kicker">{t("result")}</p>
          <p className="exam-result-score">
            {result.score}
            <span>/100</span>
          </p>
          <p className="exam-result-status">
            {result.passed
              ? t("passed", { pass: result.passScore })
              : t("failed", { pass: result.passScore })}
          </p>
        </div>

        {result.report ? (
          <div className="space-y-6">
            <section className="exam-report-card exam-report-card-in">
              <h2 className="font-[family-name:var(--font-display)] text-xl">
                {t("reportSummary")}
              </h2>
              <p className="mt-2 leading-7 text-ink-muted">
                {result.report.summary}
              </p>
            </section>

            <div className="grid gap-4 md:grid-cols-2">
              <section
                className="exam-report-card exam-report-card-in is-strength"
                style={{ animationDelay: "60ms" }}
              >
                <h2 className="font-medium text-teal">{t("strengths")}</h2>
                <ul className="mt-3 list-disc space-y-2 ps-5 text-sm">
                  {result.report.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </section>
              <section
                className="exam-report-card exam-report-card-in is-weak"
                style={{ animationDelay: "110ms" }}
              >
                <h2 className="font-medium text-danger">{t("weaknesses")}</h2>
                <ul className="mt-3 list-disc space-y-2 ps-5 text-sm">
                  {result.report.weaknesses.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="space-y-4">
              {result.report.items.map((item, index) => (
                <article
                  key={item.id}
                  className={`exam-report-item exam-report-card-in ${
                    item.correct ? "is-correct" : "is-wrong"
                  }`}
                  style={{ animationDelay: `${Math.min(index, 8) * 45 + 140}ms` }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">
                      {t("questionN", { n: index + 1 })} · {item.score}/100
                    </p>
                    <span
                      className={`text-xs font-medium ${
                        item.correct ? "text-teal" : "text-danger"
                      }`}
                    >
                      {item.correct ? t("correct") : t("needsImprovement")}
                    </span>
                  </div>
                  <h3 className="mt-3 font-medium leading-7">{item.prompt}</h3>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div>
                      <dt className="text-xs font-medium text-ink-muted">
                        {t("yourAnswer")}
                      </dt>
                      <dd className="mt-1 whitespace-pre-wrap">{item.userAnswer}</dd>
                    </div>
                    {item.correctAnswer !== null ? (
                      <div>
                        <dt className="text-xs font-medium text-ink-muted">
                          {t("correctAnswer")}
                        </dt>
                        <dd className="mt-1 text-teal">{item.correctAnswer}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt className="text-xs font-medium text-ink-muted">
                        {t("why")}
                      </dt>
                      <dd className="mt-1 leading-6">{item.why}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-ink-muted">
                        {t("improvement")}
                      </dt>
                      <dd className="mt-1 leading-6">{item.improvement}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {result.feedback.map((f, i) => (
              <li key={f.id} className="exam-report-card px-4 py-3 text-sm">
                <p className="text-ink-muted">
                  {t("questionN", { n: i + 1 })} · {f.score}/100
                </p>
                <p className="mt-1">{f.feedback}</p>
              </li>
            ))}
          </ul>
        )}

        <ResultActions />
      </div>
    );
  }

  const answeredCount = questions.reduce((n, q) => {
    const a = answers[q.id];
    if (q.kind === "mcq") return n + (typeof a === "number" ? 1 : 0);
    return n + (typeof a === "string" && a.trim().length > 0 ? 1 : 0);
  }, 0);
  const allAnswered =
    questions.length > 0 && answeredCount === questions.length;
  const progressPct =
    questions.length > 0
      ? Math.round((answeredCount / questions.length) * 100)
      : 0;

  return (
    <>
      {leaveGuard}
      <form onSubmit={onSubmit} className="exam-taking space-y-7 pb-28">
        <div className="exam-taking-header surface-panel">
          <div className="exam-taking-meta">
            <span className="exam-meta-pill">
              {format === "mixed"
                ? t("formatMixed")
                : format === "mcq"
                  ? t("formatMcq")
                  : t("formatWritten")}
            </span>
            <span className="exam-meta-dot" aria-hidden>·</span>
            <span className="exam-meta-stage">{stageTitle}</span>
            <span className="exam-meta-dot" aria-hidden>·</span>
            <span className="exam-meta-count">
              {t("questionCount", { n: questions.length })}
            </span>
          </div>
          <div className="exam-taking-progress" aria-hidden>
            <span style={{ width: `${progressPct}%` }} />
          </div>
          <p className="exam-taking-progress-label">
            {t("answeredProgress", {
              answered: answeredCount,
              total: questions.length,
            })}
          </p>
        </div>

        <div className="exam-question-list">
          {questions.map((q, i) => (
          <fieldset key={q.id} className="exam-question-card">
            <legend className="sr-only">
              {t("questionN", { n: i + 1 })}
            </legend>
            <div className="exam-question-head">
              <span className="exam-question-num" aria-hidden>
                {i + 1}
              </span>
              <p className="exam-question-prompt">{q.prompt}</p>
            </div>
            {q.kind === "mcq" && q.options ? (
              <div className="quiz-choices">
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={`quiz-choice ${
                      answers[q.id] === oi ? "is-selected" : ""
                    }`}
                    style={{ animationDelay: `${40 + oi * 50}ms` }}
                  >
                    <span className="quiz-choice-index" aria-hidden>
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <input
                      type="radio"
                      name={q.id}
                      required
                      value={oi}
                      checked={answers[q.id] === oi}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, [q.id]: oi }))
                      }
                      className="sr-only"
                    />
                    <span className="quiz-choice-text">{opt}</span>
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
                className="quiz-written"
                placeholder={t("writtenPlaceholder")}
              />
            )}
          </fieldset>
          ))}
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="exam-submit-dock" role="region" aria-label={t("submit")}>
          <div className="exam-submit-dock-bar">
            <div className="exam-submit-meta">
              <div className="exam-submit-progress" aria-hidden>
                <span style={{ width: `${progressPct}%` }} />
              </div>
              <p className="exam-submit-count">
                {t("answeredProgress", {
                  answered: answeredCount,
                  total: questions.length,
                })}
              </p>
              <p className="exam-submit-hint">{t("aiGradeHint")}</p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`exam-submit-btn${allAnswered ? " is-ready" : ""}`}
            >
              <span className="exam-submit-btn-label">
                {submitting ? t("grading") : t("submit")}
              </span>
              <span className="exam-submit-btn-ico" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8.5 6.2 11.7 13 4.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
