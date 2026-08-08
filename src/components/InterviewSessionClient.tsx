"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { BackLink } from "@/components/BackLink";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { InterviewResultDock } from "@/components/InterviewResultDock";
import { LeaveGuard } from "@/components/LeaveGuard";
import { PageLoader } from "@/components/PageLoader";

type PublicQ = {
  id: string;
  kind: string;
  difficulty: string;
  topic: string;
  prompt: string;
  options: string[];
  competency?: string;
  interviewStage?: string;
};

type ResultItem = {
  id: string;
  kind: string;
  difficulty: string;
  topic: string;
  prompt: string;
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
  correct: boolean;
  explanation: string;
  why: string;
  improvement: string;
  competency?: string;
  interviewStage?: string;
  whyAsked?: string;
  recruiterIntent?: string;
  modelAnswer?: string;
  redFlags?: string[];
  passTip?: string;
};

type DifficultyChoice = "junior" | "mid" | "senior" | "mixed";

type Props = {
  domain?: "tech" | "hr";
  trackSlug: string;
  trackTitle: string;
  categorySlug: string;
  bankSize: number;
};

export function InterviewSessionClient({
  domain = "tech",
  trackSlug,
  trackTitle,
  categorySlug,
  bankSize,
}: Props) {
  const t = useTranslations("interviews");
  const th = useTranslations("hrInterviews");
  const isHr = domain === "hr";
  const apiPath = isHr ? "/api/interviews/hr" : "/api/interviews";
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
    verdict?: "strong" | "ok" | "weak";
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
      const res = await fetch(apiPath, {
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
      const res = await fetch(apiPath, {
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

  function kindLabel(kind: string) {
    if (!isHr) return t(`kind_${kind as "mcq" | "scenario"}`);
    return th(`kind_${kind as "behavioral" | "situational" | "motivational" | "judgment"}`);
  }

  function diffLabel(diff: string) {
    if (!isHr) return t(`diff_${diff as "junior" | "mid" | "senior"}`);
    if (diff === "entry") return th("diff_entry");
    if (diff === "executive") return th("diff_executive");
    return th(`diff_${diff as "mid" | "senior"}`);
  }

  if (phase === "setup" || (phase === "quiz" && loading)) {
    const levels: { id: DifficultyChoice; title: string; hint: string }[] = [
      {
        id: "junior",
        title: isHr ? th("diff_entry") : t("diff_junior"),
        hint: isHr ? th("diffHintEntry") : t("diffHintJunior"),
      },
      {
        id: "mid",
        title: isHr ? th("diff_mid") : t("diff_mid"),
        hint: isHr ? th("diffHintMid") : t("diffHintMid"),
      },
      {
        id: "senior",
        title: isHr ? th("diff_senior") : t("diff_senior"),
        hint: isHr ? th("diffHintSenior") : t("diffHintSenior"),
      },
      {
        id: "mixed",
        title: t("diff_mixed"),
        hint: isHr ? th("diffHintMixed") : t("diffHintMixed"),
      },
    ];

    return (
      <>
        {leaveGuard}
        {resetDialog}
      <div className="ay-page ay-page-focus interview-shell">
        <div className="ay-page-ambient" aria-hidden />
        <BackLink
          href={
            isHr
              ? `/interviews/hr/${trackSlug}`
              : `/interviews/${categorySlug}`
          }
        >
          {t("backCategory")}
        </BackLink>
        <header className="page-hero animate-rise">
          <p className="page-kicker">{t("setupLabel")}</p>
          <h1 className="page-title">{trackTitle}</h1>
          <p className="page-sub">{t("setupHint")}</p>
          <hr className="page-hero-rule" />
        </header>

        <div className="interview-diff-grid">
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
      <div className="ay-page ay-page-focus interview-shell interview-shell-result">
        <div className="ay-page-ambient" aria-hidden />
        <div className="interview-result-hero animate-rise">
          <p className="page-kicker">{t("sessionDone")}</p>
          <h1 className="page-title !text-3xl sm:!text-4xl">{trackTitle}</h1>
          <div className="interview-result-score-row">
            <div>
              <p
                className={`interview-result-score ${
                  strong ? "is-strong" : ok ? "is-ok" : "is-weak"
                }`}
              >
                {result.score}
              </p>
              <p className="interview-result-score-label">{t("scoreLabel")}</p>
            </div>
            <div className="interview-result-verdict">
              <p>
                {t("correctCount", {
                  correct: result.correct,
                  total: result.total,
                })}
              </p>
              <p>
                {isHr && result.verdict
                  ? th(`verdict_${result.verdict}`)
                  : strong
                    ? t("verdictStrong")
                    : ok
                      ? t("verdictOk")
                      : t("verdictWeak")}
              </p>
            </div>
          </div>
        </div>

        <div className="interview-review-body">
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

          <h2 className="interview-review-heading">{t("reviewTitle")}</h2>
          {result.items.map((item, i) => (
            <article
              key={item.id}
              className={`interview-review-card ${
                item.correct ? "is-correct" : "is-wrong"
              }`}
              style={{ animationDelay: `${Math.min(i, 12) * 45}ms` }}
            >
              <div className="interview-review-meta">
                <span>{t("questionN", { n: i + 1 })}</span>
                <span aria-hidden>·</span>
                <span>{kindLabel(item.kind)}</span>
                <span aria-hidden>·</span>
                <span>{diffLabel(item.difficulty)}</span>
                {isHr && item.interviewStage ? (
                  <>
                    <span aria-hidden>·</span>
                    <span>{th(`stage_${item.interviewStage}`)}</span>
                  </>
                ) : null}
              </div>
              <p className="interview-review-prompt">{item.prompt}</p>
              <ul className="interview-review-options">
                {item.options.map((opt, oi) => {
                  const isCorrect = oi === item.correctIndex;
                  const isSelected = oi === item.selectedIndex;
                  return (
                    <li
                      key={oi}
                      className={`interview-review-option ${
                        isCorrect
                          ? "is-correct"
                          : isSelected
                            ? "is-wrong"
                            : ""
                      }`}
                    >
                      {opt}
                      {isCorrect && (
                        <span className="interview-review-tag is-correct">{t("correctTag")}</span>
                      )}
                      {isSelected && !isCorrect && (
                        <span className="interview-review-tag is-wrong">{t("yourAnswer")}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
              {isHr ? (
                <dl className="interview-review-dl hr-result-sections">
                  {item.whyAsked ? (
                    <div className="hr-result-section">
                      <dt>{th("whyAsked")}</dt>
                      <dd>{item.whyAsked}</dd>
                    </div>
                  ) : null}
                  {item.recruiterIntent ? (
                    <div className="hr-result-section">
                      <dt>{th("recruiterIntent")}</dt>
                      <dd>{item.recruiterIntent}</dd>
                    </div>
                  ) : null}
                  {item.modelAnswer ? (
                    <div className="hr-result-section is-highlight">
                      <dt>{th("modelAnswer")}</dt>
                      <dd>{item.modelAnswer}</dd>
                    </div>
                  ) : null}
                  {item.redFlags?.length ? (
                    <div className="hr-result-section">
                      <dt>{th("redFlags")}</dt>
                      <dd>
                        <ul className="list-disc ps-5">
                          {item.redFlags.map((flag, fi) => (
                            <li key={fi}>{flag}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  ) : null}
                  {item.passTip ? (
                    <div className="hr-result-section is-pass">
                      <dt>{th("passTip")}</dt>
                      <dd>{item.passTip}</dd>
                    </div>
                  ) : null}
                  <div className="hr-result-section">
                    <dt>{t("why")}</dt>
                    <dd>{item.why || item.explanation}</dd>
                  </div>
                  <div className="hr-result-section">
                    <dt>{t("improvement")}</dt>
                    <dd>{item.improvement}</dd>
                  </div>
                </dl>
              ) : (
              <dl className="interview-review-dl">
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
              )}
            </article>
          ))}

          <InterviewResultDock
            score={result.score}
            scoreLabel={t("scoreLabel")}
            retryLabel={t("retry")}
            backCategoryLabel={t("backCategory")}
            backAllLabel={t("backAll")}
            nextLabel={t("resultNext")}
            categorySlug={isHr ? "hr" : categorySlug}
            onRetry={resetToSetup}
            tone={tone}
          />
        </div>
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
    <div className="ay-page ay-page-focus interview-shell">
      <div className="ay-page-ambient" aria-hidden />
      <div className="interview-quiz-header">
        <div>
          <BackLink onClick={requestReset}>{t("changeDifficulty")}</BackLink>
          <h1 className="page-title !mt-3 !text-2xl sm:!text-3xl">{trackTitle}</h1>
          <p className="interview-quiz-progress">
            {t("progressLabel", {
              current: index + 1,
              total: questions.length,
              answered: answeredCount,
            })}
          </p>
        </div>
        <div className="interview-quiz-badges">
          <span className="exam-meta-pill">{kindLabel(current.kind)}</span>
          <span className="exam-meta-pill is-accent">{diffLabel(current.difficulty)}</span>
        </div>
      </div>

      <div className="interview-progress" aria-hidden>
        <span style={{ width: `${progress}%` }} />
      </div>

      {error && <p className="interview-quiz-error">{error}</p>}

      <div key={current.id} className="interview-question">
        <p className="interview-question-kicker">
          {t("questionN", { n: index + 1 })}
        </p>
        <h2 className="interview-question-title">{current.prompt}</h2>

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

        <div className="interview-quiz-nav">
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
          <p className="interview-quiz-hint">{t("answerAll")}</p>
        )}
      </div>
    </div>
    </>
  );
}
