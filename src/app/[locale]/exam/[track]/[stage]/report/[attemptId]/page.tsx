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
    <main className="exam-result-page mx-auto max-w-3xl px-4 py-12 pb-28 sm:px-6">
      <div
        className={`exam-result-hero ${attempt.passed ? "is-pass" : "is-fail"}`}
      >
        <p className="exam-result-kicker">{t("reportSummary")}</p>
        <h1 className="exam-result-score !text-4xl sm:!text-5xl">
          {attempt.score}
          <span>/100</span>
        </h1>
        <p className="exam-result-status">
          {stage ? tl(stage.title, loc) : stageSlug}
        </p>
      </div>

      {report ? (
        <div className="mt-8 space-y-6">
          <section className="exam-report-card exam-report-card-in">
            <p className="leading-relaxed text-ink">{report.summary}</p>
          </section>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="exam-report-card exam-report-card-in is-strength">
              <p className="text-xs uppercase tracking-wider text-teal">
                {t("strengths")}
              </p>
              <ul className="mt-2 list-disc ps-5 text-sm">
                {report.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div
              className="exam-report-card exam-report-card-in is-weak"
              style={{ animationDelay: "60ms" }}
            >
              <p className="text-xs uppercase tracking-wider text-accent">
                {t("weaknesses")}
              </p>
              <ul className="mt-2 list-disc ps-5 text-sm">
                {report.weaknesses.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
          <ul className="space-y-4">
            {report.items.map((item, i) => (
              <li
                key={item.id}
                className={`exam-report-item exam-report-card-in ${
                  item.correct ? "is-correct" : "is-wrong"
                }`}
                style={{ animationDelay: `${Math.min(i, 8) * 40 + 100}ms` }}
              >
                <p className="text-xs text-ink-muted">
                  {t("questionN", { n: i + 1 })} · {item.score}/100 ·{" "}
                  {item.correct ? t("correct") : t("needsImprovement")}
                </p>
                <p className="mt-2 font-medium">{item.prompt}</p>
                <p className="mt-2 text-sm text-ink-muted">
                  {t("yourAnswer")}: {item.userAnswer || "—"}
                </p>
                {item.correctAnswer ? (
                  <p className="mt-1 text-sm text-teal">
                    {t("correctAnswer")}: {item.correctAnswer}
                  </p>
                ) : null}
                <p className="mt-3 text-sm">
                  <span className="text-ink-muted">{t("why")}: </span>
                  {item.why}
                </p>
                <p className="mt-2 text-sm">
                  <span className="text-ink-muted">{t("improvement")}: </span>
                  {item.improvement}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-8 text-ink-muted">{t("submitError")}</p>
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
