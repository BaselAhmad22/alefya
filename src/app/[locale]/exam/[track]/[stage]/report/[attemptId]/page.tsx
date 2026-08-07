import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTrack, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import type { ExamReport } from "@/lib/exams";
import { nextStage } from "@/lib/progress-gates";
import { ExamResultDock } from "@/components/ExamResultDock";

type Props = {
  params: Promise<{
    locale: string;
    track: string;
    stage: string;
    attemptId: string;
  }>;
};

export default async function ExamReportPage({ params }: Props) {
  const { locale, track: trackSlug, stage: stageSlug, attemptId } =
    await params;
  setRequestLocale(locale);
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const attempt = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
  });
  if (
    !attempt ||
    attempt.userId !== session.user.id ||
    attempt.trackSlug !== trackSlug ||
    attempt.stageSlug !== stageSlug
  ) {
    notFound();
  }

  const track = getTrack(trackSlug);
  const stage = track?.stages.find((s) => s.slug === stageSlug);
  const t = await getTranslations("exam");
  const loc = locale as Locale;

  let report: ExamReport | null = null;
  try {
    const parsed = JSON.parse(attempt.feedbackJson || "null");
    if (parsed && Array.isArray(parsed.items)) report = parsed as ExamReport;
  } catch {
    report = null;
  }

  const nxt = track ? nextStage(track, stageSlug) : null;
  const nextHref =
    attempt.passed && nxt?.lessons[0]
      ? `/learn/${trackSlug}/${nxt.lessons[0].slug}`
      : null;

  return (
    <main className="ay-page ay-page-focus exam-report-page pb-28">
      <div className="ay-page-ambient" aria-hidden />
      <div
        className={`exam-result-hero ${attempt.passed ? "is-pass" : "is-fail"}`}
      >
        <p className="exam-result-kicker">{t("reportSummary")}</p>
        <h1 className="exam-result-score">
          {attempt.score}
          <span>/100</span>
        </h1>
        <p className="exam-result-status">
          {stage ? tl(stage.title, loc) : stageSlug}
        </p>
      </div>

      {report ? (
        <div className="exam-report-body">
          <section className="exam-report-card exam-report-card-in">
            <p className="exam-report-summary">{report.summary}</p>
          </section>
          <div className="exam-report-grid">
            <div className="exam-report-card exam-report-card-in is-strength">
              <p className="exam-report-card-label">{t("strengths")}</p>
              <ul className="exam-report-list">
                {report.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div
              className="exam-report-card exam-report-card-in is-weak"
              style={{ animationDelay: "60ms" }}
            >
              <p className="exam-report-card-label is-weak">{t("weaknesses")}</p>
              <ul className="exam-report-list">
                {report.weaknesses.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
          <ol className="exam-report-notes">
            {report.items.map((item, i) => (
              <li
                key={item.id}
                className={`exam-report-item exam-report-card-in ${
                  item.correct ? "is-correct" : "is-wrong"
                }`}
                style={{ animationDelay: `${Math.min(i, 8) * 40 + 100}ms` }}
              >
                <div className="exam-report-item-head">
                  <span className="exam-report-item-meta">
                    {t("questionN", { n: i + 1 })} · {item.score}/100
                  </span>
                  <span
                    className={`exam-report-item-verdict ${
                      item.correct ? "is-correct" : "is-wrong"
                    }`}
                  >
                    {item.correct ? t("correct") : t("needsImprovement")}
                  </span>
                </div>
                <p className="exam-report-item-prompt">{item.prompt}</p>
                <dl className="exam-report-item-dl">
                  <div>
                    <dt>{t("yourAnswer")}</dt>
                    <dd>{item.userAnswer || "—"}</dd>
                  </div>
                  {item.correctAnswer ? (
                    <div>
                      <dt>{t("correctAnswer")}</dt>
                      <dd className="is-correct-text">{item.correctAnswer}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>{t("why")}</dt>
                    <dd>{item.why}</dd>
                  </div>
                  <div>
                    <dt>{t("improvement")}</dt>
                    <dd>{item.improvement}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <p className="exam-report-empty">{t("submitError")}</p>
      )}

      <ExamResultDock
        trackSlug={trackSlug}
        stageSlug={stageSlug}
        nextHref={nextHref}
        passed={attempt.passed}
        labels={{
          continueNext: t("continueNext"),
          retry: t("retryPractice"),
          backToTrack: t("backToTrack"),
        }}
      />
    </main>
  );
}
