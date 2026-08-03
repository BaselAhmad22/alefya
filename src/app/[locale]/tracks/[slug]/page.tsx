import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getTrack,
  getAllLessons,
  countLessons,
  t as tl,
} from "@/lib/content";
import { getCategoryForTrack } from "@/lib/categories";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/Reveal";
import { StartTrackButton } from "@/components/StartTrackButton";
import {
  getContinueTarget,
  isLessonUnlocked,
  isStageExamUnlocked,
  PASS_SCORE,
} from "@/lib/progress-gates";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function TrackPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const track = getTrack(slug);
  if (!track) notFound();

  const t = await getTranslations("tracks");
  const te = await getTranslations("exam");
  const loc = locale as Locale;
  const session = await auth();
  const allLessons = getAllLessons(track);
  const total = countLessons(track);
  const category = getCategoryForTrack(slug);
  const firstLesson = allLessons[0];

  let completedSlugs = new Set<string>();
  let passedStages = new Set<string>();
  let enrolled = false;
  if (session?.user?.id) {
    const [rows, enrollment, exams] = await Promise.all([
      prisma.progress.findMany({
        where: { userId: session.user.id, trackSlug: slug },
        select: { lessonSlug: true },
      }),
      prisma.trackEnrollment.findUnique({
        where: {
          userId_trackSlug: {
            userId: session.user.id,
            trackSlug: slug,
          },
        },
      }),
      prisma.examAttempt.findMany({
        where: { userId: session.user.id, trackSlug: slug, passed: true },
        select: { stageSlug: true },
      }),
    ]);
    completedSlugs = new Set(rows.map((r) => r.lessonSlug));
    passedStages = new Set(exams.map((e) => e.stageSlug));
    enrolled = Boolean(enrollment);
  }

  const completedCount = allLessons.filter((l) =>
    completedSlugs.has(l.slug),
  ).length;
  const pct = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  const continueTarget = getContinueTarget(track, completedSlugs, passedStages);
  let continueHref = firstLesson
    ? `/learn/${track.slug}/${firstLesson.slug}`
    : `/tracks/${track.slug}`;
  if (continueTarget.type === "lesson") {
    continueHref = `/learn/${track.slug}/${continueTarget.lessonSlug}`;
  } else if (continueTarget.type === "exam") {
    continueHref = `/learn/${track.slug}/exam/${continueTarget.stageSlug}`;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {category && (
        <Link
          href={`/categories/${category.slug}`}
          className="text-sm text-ink-muted transition-colors hover:text-accent"
        >
          ← {tl(category.title, loc)}
        </Link>
      )}

      <div className="mt-4 animate-rise flex flex-col gap-8 border-b border-line pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div
            className="mb-4 h-1.5 w-16"
            style={{ background: track.color }}
          />
          <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
            {track.stages.length} {t("stages")} · {total} {t("lessons")}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
            {tl(track.title, loc)}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            {tl(track.description, loc)}
          </p>
          <p className="mt-3 text-sm text-ink-muted">{t("linearHint")}</p>
        </div>
        <div className="flex flex-col items-start gap-3 lg:items-end">
          {session?.user && enrolled && (
            <div className="w-full min-w-[220px]">
              <div className="mb-1.5 flex justify-between text-xs text-ink-muted">
                <span>{t("progress")}</span>
                <span>
                  {completedCount}/{total} · {pct}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden bg-bg-soft">
                <div
                  className="h-full bg-teal transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
          {firstLesson && (
            <StartTrackButton
              trackSlug={track.slug}
              continueHref={continueHref}
              alreadyStarted={enrolled}
              labelStart={t("start")}
              labelContinue={
                continueTarget.type === "exam" ? te("takeExam") : t("continue")
              }
            />
          )}
          {!session?.user && (
            <p className="max-w-xs text-xs text-ink-muted">{t("needAccount")}</p>
          )}
        </div>
      </div>

      <ol className="mt-12 space-y-12">
        {track.stages.map((stage, stageIndex) => {
          const examUnlocked = isStageExamUnlocked(
            track,
            stage.slug,
            completedSlugs,
            passedStages,
          );
          const examPassed = passedStages.has(stage.slug);

          return (
            <Reveal key={stage.slug} delay={stageIndex * 40}>
              <li>
                <div className="mb-5 flex items-baseline gap-3">
                  <span className="font-mono text-sm text-accent">
                    {String(stageIndex + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="font-[family-name:var(--font-display)] text-2xl">
                      {tl(stage.title, loc)}
                    </h2>
                    <p className="text-sm text-ink-muted">
                      {tl(stage.description, loc)}
                    </p>
                  </div>
                </div>
                <ol className="space-y-1 border-s border-line ms-3 ps-5">
                  {stage.lessons.map((lesson) => {
                    const done = completedSlugs.has(lesson.slug);
                    const unlocked =
                      enrolled &&
                      Boolean(session?.user) &&
                      isLessonUnlocked(
                        track,
                        lesson.slug,
                        completedSlugs,
                        passedStages,
                      );
                    const inner = (
                      <span className="flex w-full items-center justify-between gap-4 py-2.5">
                        <span className="flex items-center gap-3">
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${
                              done ? "bg-teal" : "bg-line"
                            }`}
                          />
                          <span
                            className={
                              done
                                ? "text-ink-muted"
                                : !unlocked && enrolled
                                  ? "text-ink-muted/50"
                                  : ""
                            }
                          >
                            {tl(lesson.title, loc)}
                            {!unlocked && enrolled ? ` · ${t("locked")}` : ""}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs text-ink-muted">
                          {lesson.duration}m
                        </span>
                      </span>
                    );

                    return (
                      <li key={lesson.slug}>
                        {unlocked ? (
                          <Link
                            href={`/learn/${track.slug}/${lesson.slug}`}
                            className="group block transition-colors hover:text-accent"
                          >
                            {inner}
                          </Link>
                        ) : (
                          <div className="opacity-70">{inner}</div>
                        )}
                      </li>
                    );
                  })}
                  <li className="pt-2">
                    {examPassed ? (
                      <span className="flex items-center gap-3 py-2.5 text-sm text-teal">
                        <span className="h-2 w-2 rounded-full bg-teal" />
                        {te("examPassedBadge")}
                      </span>
                    ) : examUnlocked && enrolled ? (
                      <Link
                        href={`/learn/${track.slug}/exam/${stage.slug}`}
                        className="flex items-center gap-3 py-2.5 text-sm text-accent hover:underline"
                      >
                        <span className="h-2 w-2 rounded-full bg-accent" />
                        {te("takeExam")} · {PASS_SCORE}+
                      </Link>
                    ) : (
                      <span className="flex items-center gap-3 py-2.5 text-sm text-ink-muted/50">
                        <span className="h-2 w-2 rounded-full bg-line" />
                        {te("examLocked")}
                      </span>
                    )}
                  </li>
                </ol>
              </li>
            </Reveal>
          );
        })}
      </ol>
    </div>
  );
}
