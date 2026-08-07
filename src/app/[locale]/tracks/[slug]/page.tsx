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
import { LeaveTrackButton } from "@/components/LeaveTrackButton";
import { ClassmatesPanel } from "@/components/ClassmatesPanel";
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
    continueHref = `/exam/${track.slug}/${continueTarget.stageSlug}`;
  }

  return (
    <div className="ay-page track-detail">
      <div className="ay-page-ambient" aria-hidden />

      {category && (
        <Link
          href={`/categories/${category.slug}`}
          className="inline-flex text-sm text-ink-muted transition-colors hover:text-accent"
        >
          ← {tl(category.title, loc)}
        </Link>
      )}

      <header className="track-detail-hero page-hero mt-6">
        <div className="track-detail-hero-grid">
          <div className="track-detail-hero-copy">
            <p className="page-kicker">
              {track.stages.length} {t("stages")} · {total} {t("lessons")}
            </p>
            <h1 className="page-title">{tl(track.title, loc)}</h1>
            <p className="page-sub">{tl(track.description, loc)}</p>
            <p className="track-detail-hint">{t("linearHint")}</p>
            <hr className="page-hero-rule" />
          </div>
          <div className="track-detail-hero-actions">
            {session?.user && enrolled && (
              <div className="track-detail-progress">
                <div className="track-detail-progress-head">
                  <span>{t("progress")}</span>
                  <span>
                    {completedCount}/{total} · {pct}%
                  </span>
                </div>
                <div className="track-detail-progress-bar" aria-hidden>
                  <span style={{ width: `${pct}%` }} />
                </div>
              </div>
            )}
            {firstLesson && (
              <div className="track-detail-cta-row">
                <StartTrackButton
                  trackSlug={track.slug}
                  continueHref={continueHref}
                  alreadyStarted={enrolled}
                  labelStart={t("start")}
                  labelContinue={
                    continueTarget.type === "exam" ? te("takeExam") : t("continue")
                  }
                />
                {session?.user && enrolled ? (
                  <LeaveTrackButton trackSlug={track.slug} />
                ) : null}
              </div>
            )}
            {!session?.user && (
              <p className="track-detail-hint">{t("needAccount")}</p>
            )}
          </div>
        </div>
      </header>

      <div className="track-layout mt-10">
        <ol className="track-stages">
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
                <li className="track-stage">
                  <div className="track-stage-head">
                    <span className="track-stage-index">
                      {String(stageIndex + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h2 className="track-stage-title">{tl(stage.title, loc)}</h2>
                      <p className="track-stage-desc">{tl(stage.description, loc)}</p>
                    </div>
                  </div>
                  <ol className="track-stage-lessons">
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
                        <span className="track-lesson-row">
                          <span className="track-lesson-main">
                            <span
                              className={`track-lesson-dot ${done ? "is-done" : unlocked ? "is-unlocked" : "is-locked"}`}
                            />
                            <span
                              className={`track-lesson-title ${
                                done
                                  ? "is-done"
                                  : !unlocked && enrolled
                                    ? "is-locked"
                                    : ""
                              }`}
                            >
                              {tl(lesson.title, loc)}
                              {!unlocked && enrolled ? ` · ${t("locked")}` : ""}
                            </span>
                          </span>
                          <span className="track-lesson-duration">{lesson.duration}m</span>
                        </span>
                      );

                      return (
                        <li key={lesson.slug} className="track-lesson-item">
                          {unlocked ? (
                            <Link
                              href={`/learn/${track.slug}/${lesson.slug}`}
                              className="track-lesson-link"
                            >
                              {inner}
                            </Link>
                          ) : (
                            <div className="track-lesson-link is-disabled">{inner}</div>
                          )}
                        </li>
                      );
                    })}
                    <li className="track-exam-item">
                      {examPassed ? (
                        <span className="track-exam-row is-passed">
                          <span className="track-lesson-dot is-done" />
                          {te("examPassedBadge")}
                        </span>
                      ) : examUnlocked && enrolled ? (
                        <Link
                          href={`/exam/${track.slug}/${stage.slug}`}
                          className="track-exam-row is-unlocked"
                        >
                          <span className="track-lesson-dot is-exam" />
                          {te("takeExam")} · {PASS_SCORE}+
                        </Link>
                      ) : (
                        <span className="track-exam-row is-locked">
                          <span className="track-lesson-dot is-locked" />
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

        {session?.user ? (
          <aside className="track-learners-rail">
            <ClassmatesPanel trackSlug={track.slug} />
          </aside>
        ) : null}
      </div>
    </div>
  );
}

