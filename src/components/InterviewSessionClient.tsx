"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { InterviewResultDock } from "@/components/InterviewResultDock";
import { LeaveGuard } from "@/components/LeaveGuard";
import { PageLoader } from "@/components/PageLoader";

type PublicQ = {
  id: string;
  kind: "mcq" | "scenario";
  difficulty: "junior" | "mid" | "senior";
  topic: string;
  prompt: string;
  options: string[];
};

type ResultItem = {
  id: string;
  kind: "mcq" | "scenario";
  difficulty: "junior" | "mid" | "senior";
  topic: string;
  prompt: string;
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
  correct: boolean;
  explanation: string;
  why: string;
  improvement: string;
};

type DifficultyChoice = "junior" | "mid" | "senior" | "mixed";

type Props = {
  trackSlug: string;
  trackTitle: string;
  categorySlug: string;
  bankSize: number;
};

export function InterviewSessionClient({
  trackSlug,
  trackTitle,
  categorySlug,
  bankSize,
}: Props) {
  const t = useTranslations("interviews");
  const locale = useLocale() as "ar" | "en";
  const [phase, setPhase] = useState<"setup" | "quiz" | "result">("setup");
  const [difficulty, setDifficulty] = useState<DifficultyChoice>("mixed");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PublicQ[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{
    score: number;
    total: number;
    correct: number;
    strengths?: string[];
    weaknesses?: string[];
    summary?: string;
    items: ResultItem[];
  } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const inQuiz = phase === "quiz" && questions.length > 0;

  async function startSession(chosen: DifficultyChoice = difficulty) {
    setLoading(true);
    setError(null);
    setResult(null);
    setAnswers({});
    setIndex(0);
    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          trackSlug,
          locale,
          difficulty: chosen,
          count: Math.min(20, Math.max(12, bankSize)),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(t("startError"));
        setQuestions([]);
        setPhase("setup");
        return;
      }
      setQuestions(data.questions || []);
      setPhase("quiz");
    } catch {
      setError(t("startError"));
      setPhase("setup");
    } finally {
      setLoading(false);
    }
  }

  const current = questions[index];
  const progress = questions.length
    ? Math.round(((index + 1) / questions.length) * 100)
    : 0;
  const answeredCount = useMemo(
    () => questions.filter((q) => answers[q.id] !== undefined).length,
    [questions, answers],
  );
  const selected = current ? answers[current.id] : undefined;
  const canFinish =
    questions.length > 0 &&
    questions.every((q) => answers[q.id] !== undefined);

  function selectOption(optionIndex: number) {
    if (!current || submitting || phase !== "quiz") return;
    setAnswers((prev) => ({ ...prev, [current.id]: optionIndex }));
  }

  function goPrev() {
    if (index <= 0) return;
    setIndex((i) => i - 1);
  }

  function goNext() {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      return;
    }
    if (canFinish) void submitAll();
  }

  async function submitAll() {
    if (!canFinish) {
      setError(t("answerAll"));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit",
          trackSlug,
          locale,
          questionIds: questions.map((q) => q.id),
          answers,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(t("submitError"));
        return;
      }
      setResult(data);
      setPhase("result");
    } catch {
      setError(t("submitError"));
    } finally {
      setSubmitting(false);
    }
  }

  function resetToSetup() {
    setPhase("setup");
    setQuestions([]);
    setAnswers({});
    setIndex(0);
    setResult(null);
    setError(null);
    setConfirmReset(false);
  }

  function requestReset() {
    if (inQuiz && Object.keys(answers).length > 0) {
      setConfirmReset(true);
      return;
    }
    if (inQuiz) {
      setConfirmReset(true);
      return;
    }
    resetToSetup();
  }

  const leaveGuard = (
    <LeaveGuard
      active={inQuiz || submitting}
      title={t("leaveTitle")}
      description={t("leaveDesc")}
      confirmLabel={t("leaveConfirm")}
      cancelLabel={t("leaveCancel")}
    />
  );

  const resetDialog = (
    <ConfirmDialog
      open={confirmReset}
      title={t("leaveTitle")}
      description={t("leaveDesc")}
      confirmLabel={t("leaveConfirm")}
      cancelLabel={t("leaveCancel")}
      tone="warn"
      onConfirm={resetToSetup}
      onCancel={() => setConfirmReset(false)}
    />
  );

  if (phase === "setup" || (phase === "quiz" && loading)) {
    const levels: { id: DifficultyChoice; title: string; hint: string }[] = [
      { id: "junior", title: t("diff_junior"), hint: t("diffHintJunior") },
      { id: "mid", title: t("diff_mid"), hint: t("diffHintMid") },
      { id: "senior", title: t("diff_senior"), hint: t("diffHintSenior") },
      { id: "mixed", title: t("diff_mixed"), hint: t("diffHintMixed") },
    ];

    return (
      <>
        {leaveGuard}
        {resetDialog}
      <div className="interview-shell mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href={`/interviews/${categorySlug}`}
          className="text-sm text-ink-muted transition-colors hover:text-accent"
        >
          ← {t("backCategory")}
        </Link>
        <div className="mt-6 animate-rise">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">
            {t("setupLabel")}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
            {trackTitle}
          </h1>
          <p className="mt-3 max-w-xl text-ink-muted">{t("setupHint")}</p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {levels.map((level, i) => (
            <button
              key={level.id}
              type="button"
              onClick={() => setDifficulty(level.id)}
              style={{ animationDelay: `${70 + i * 50}ms` }}
              className={`interview-diff-card text-start ${
                difficulty === level.id ? "is-active" : ""
              }`}
            >
              <p className="font-[family-name:var(--font-display)] text-xl">
                {level.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {level.hint}
              </p>
            </button>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        <button
          type="button"
          disabled={loading}
          className="btn-primary mt-8 disabled:opacity-50"
          onClick={() => void startSession(difficulty)}
        >
          {loading ? "…" : t("startSession")}
        </button>
      </div>
      </>
    );
  }

  if (submitting) {
    return (
      <>
        {leaveGuard}
        {resetDialog}
        <div
          className="flex min-h-[18rem] flex-col items-center justify-center gap-5 px-4 py-16 text-center"
          aria-live="polite"
        >
          <PageLoader />
          <p className="max-w-md text-sm text-ink-muted">{t("analyzing")}</p>
        </div>
      </>
    );
  }

  if (phase === "result" && result) {
    const strong = result.score >= 80;
    const ok = result.score >= 60;
    const tone = strong ? "strong" : ok ? "ok" : "weak";
    return (
      <div className="interview-shell interview-shell-result mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="interview-result animate-rise">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">
            {t("sessionDone")}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
            {trackTitle}
          </h1>
          <div className="mt-8 flex flex-wrap items-end gap-6">
            <div>
              <p
                className={`font-[family-name:var(--font-display)] text-6xl tabular-nums ${
                  strong ? "text-teal" : ok ? "text-accent" : "text-danger"
                }`}
              >
                {result.score}
              </p>
              <p className="mt-1 text-sm text-ink-muted">{t("scoreLabel")}</p>
            </div>
            <div className="text-sm text-ink-muted">
              <p>
                {t("correctCount", {
                  correct: result.correct,
                  total: result.total,
                })}
              </p>
              <p className="mt-1">
                {strong ? t("verdictStrong") : ok ? t("verdictOk") : t("verdictWeak")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-4 pb-[7.5rem]">
          {result.summary ? (
            <section className="exam-report-card exam-report-card-in">
              <h2 className="font-[family-name:var(--font-display)] text-xl">
                {t("reportSummary")}
              </h2>
              <p className="mt-2 leading-7 text-ink-muted">{result.summary}</p>
            </section>
          ) : null}

          {(result.strengths?.length || result.weaknesses?.length) ? (
            <div className="grid gap-4 md:grid-cols-2">
              <section className="exam-report-card exam-report-card-in is-strength">
                <h2 className="font-medium text-teal">{t("strengths")}</h2>
                <ul className="mt-3 list-disc space-y-2 ps-5 text-sm">
                  {(result.strengths || []).map((strength, i) => (
                    <li key={i}>{strength}</li>
                  ))}
                </ul>
              </section>
              <section
                className="exam-report-card exam-report-card-in is-weak"
                style={{ animationDelay: "60ms" }}
              >
                <h2 className="font-medium text-danger">{t("weaknesses")}</h2>
                <ul className="mt-3 list-disc space-y-2 ps-5 text-sm">
                  {(result.weaknesses || []).map((weakness, i) => (
                    <li key={i}>{weakness}</li>
                  ))}
                </ul>
              </section>
            </div>
          ) : null}

          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            {t("reviewTitle")}
          </h2>
          {result.items.map((item, i) => (
            <article
              key={item.id}
              className={`interview-review-card ${
                item.correct ? "is-correct" : "is-wrong"
              }`}
              style={{ animationDelay: `${Math.min(i, 12) * 45}ms` }}
            >
              <div className="flex flex-wrap items-center gap-2 text-[0.7rem] uppercase tracking-wide text-ink-muted">
                <span>{t("questionN", { n: i + 1 })}</span>
                <span>·</span>
                <span>{t(`kind_${item.kind}`)}</span>
                <span>·</span>
                <span>{t(`diff_${item.difficulty}`)}</span>
              </div>
              <p className="mt-3 text-base leading-relaxed">{item.prompt}</p>
              <ul className="mt-4 space-y-2">
                {item.options.map((opt, oi) => {
                  const isCorrect = oi === item.correctIndex;
                  const isSelected = oi === item.selectedIndex;
                  return (
                    <li
                      key={oi}
                      className={`rounded border px-3 py-2 text-sm ${
                        isCorrect
                          ? "border-teal/50 bg-teal/10 text-ink"
                          : isSelected
                            ? "border-danger/40 bg-danger/10"
                            : "border-line/60 text-ink-muted"
                      }`}
                    >
                      {opt}
                      {isCorrect && (
                        <span className="ms-2 text-xs text-teal">{t("correctTag")}</span>
                      )}
                      {isSelected && !isCorrect && (
                        <span className="ms-2 text-xs text-danger">{t("yourAnswer")}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <dl className="mt-4 space-y-3 border-t border-line/50 pt-3 text-sm">
                <div>
                  <dt className="text-xs font-medium text-ink-muted">{t("why")}</dt>
                  <dd className="mt-1 leading-6 text-ink-muted">
                    {item.why || item.explanation}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-ink-muted">
                    {t("improvement")}
                  </dt>
                  <dd className="mt-1 leading-6 text-ink-muted">
                    {item.improvement}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <InterviewResultDock
          score={result.score}
          scoreLabel={t("scoreLabel")}
          retryLabel={t("retry")}
          backCategoryLabel={t("backCategory")}
          backAllLabel={t("backAll")}
          categorySlug={categorySlug}
          onRetry={resetToSetup}
          tone={tone}
        />
      </div>
    );
  }

  if (!current) {
    return (
      <>
        {leaveGuard}
        {resetDialog}
        <div className="interview-shell mx-auto max-w-xl px-4 py-16 text-center">
          <p className="text-ink-muted">{error || t("startError")}</p>
          <button type="button" className="btn-primary mt-6" onClick={resetToSetup}>
            {t("retry")}
          </button>
        </div>
      </>
    );
  }

  const isLast = index >= questions.length - 1;

  return (
    <>
      {leaveGuard}
      {resetDialog}
    <div className="interview-shell mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={requestReset}
            className="text-sm text-ink-muted transition-colors hover:text-accent"
          >
            ← {t("changeDifficulty")}
          </button>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
            {trackTitle}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {t("progressLabel", {
              current: index + 1,
              total: questions.length,
              answered: answeredCount,
            })}
          </p>
        </div>
        <div className="text-end text-xs uppercase tracking-wide text-ink-muted">
          <p>{t(`kind_${current.kind}`)}</p>
          <p className="mt-1 text-accent">{t(`diff_${current.difficulty}`)}</p>
        </div>
      </div>

      <div className="interview-progress mt-6" aria-hidden>
        <span style={{ width: `${progress}%` }} />
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <div key={current.id} className="interview-question mt-8">
        <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
          {t("questionN", { n: index + 1 })}
        </p>
        <h2 className="mt-3 text-xl leading-relaxed sm:text-2xl">{current.prompt}</h2>

        <div className="mt-8 space-y-3">
          {current.options.map((opt, oi) => {
            const isSelected = selected === oi;
            return (
              <button
                key={oi}
                type="button"
                disabled={submitting}
                onClick={() => selectOption(oi)}
                className={`interview-option ${isSelected ? "is-selected" : ""}`}
                style={{ animationDelay: `${60 + oi * 55}ms` }}
              >
                <span className="interview-option-index">
                  {String.fromCharCode(65 + oi)}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            disabled={index === 0 || submitting}
            onClick={goPrev}
            className="btn-ghost disabled:opacity-40"
          >
            {t("prev")}
          </button>
          <button
            type="button"
            disabled={
              submitting ||
              (isLast ? !canFinish : selected === undefined)
            }
            onClick={goNext}
            className="btn-primary disabled:opacity-50"
          >
            {submitting ? "…" : isLast ? t("finish") : t("next")}
          </button>
        </div>
        {isLast && !canFinish && (
          <p className="mt-3 text-sm text-ink-muted">{t("answerAll")}</p>
        )}
      </div>
    </div>
    </>
  );
}
