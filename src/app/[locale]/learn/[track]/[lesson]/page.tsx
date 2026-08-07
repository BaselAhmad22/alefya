import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getLesson,
  getAdjacentLessons,
  t as tl,
} from "@/lib/content";
import type { Locale } from "@/i18n/config";
import { LessonBody } from "@/components/LessonBody";
import { LessonActions } from "@/components/LessonActions";
import { LessonStickyBar } from "@/components/LessonStickyBar";
import { LessonNav } from "@/components/LessonNav";
import { LessonOutline } from "@/components/LessonOutline";
import { AiHelper } from "@/components/AiHelper";
import { SocialBar } from "@/components/SocialBar";
import {
  assertCanAccessLesson,
  isLessonUnlocked,
  isLastLessonOfStage,
  PASS_SCORE,
} from "@/lib/progress-gates";

type Props = {
  params: Promise<{ locale: string; track: string; lesson: string }>;
};

export default async function LessonPage({ params }: Props) {
  const { locale, track: trackSlug, lesson: lessonSlug } = await params;
  setRequestLocale(locale);
  const found = getLesson(trackSlug, lessonSlug);
  if (!found) notFound();

  const session = await auth();
  if (!session?.user?.id) {
    redirect(
      `/${locale}/login?next=${encodeURIComponent(`/${locale}/learn/${trackSlug}/${lessonSlug}`)}`,
    );
  }

  const enrollment = await prisma.trackEnrollment.findUnique({
    where: {
      userId_trackSlug: {
        userId: session.user.id,
        trackSlug,
      },
    },
  });
  if (!enrollment) {
    redirect(`/${locale}/tracks/${trackSlug}`);
  }

  const access = await assertCanAccessLesson(
    session.user.id,
    trackSlug,
    lessonSlug,
  );
  if (!access.ok) {
    redirect(`/${locale}/tracks/${trackSlug}`);
  }

  const { track, stage, lesson } = found;
  const { prev, next, index, total } = getAdjacentLessons(track, lessonSlug);
  const t = await getTranslations("lesson");
  const te = await getTranslations("exam");
  const loc = locale as Locale;
  const { completed, passedStages } = access;

  let lessonDone = false;
  const row = await prisma.progress.findUnique({
    where: {
      userId_trackSlug_lessonSlug: {
        userId: session.user.id,
        trackSlug,
        lessonSlug,
      },
    },
  });
  lessonDone = Boolean(row);

  const nextUnlocked =
    next && isLessonUnlocked(track, next.slug, completed, passedStages);

  const allStageDone = stage.lessons.every((l) => completed.has(l.slug));
  const showExamCta = allStageDone && !passedStages.has(stage.slug);
  const endingStage = isLastLessonOfStage(track, lessonSlug);

  const completedIfDone = new Set(completed);
  if (!lessonDone) completedIfDone.add(lessonSlug);

  const nextWouldUnlock =
    Boolean(next) &&
    isLessonUnlocked(track, next!.slug, completedIfDone, passedStages);

  const examWouldUnlock =
    !passedStages.has(stage.slug) &&
    stage.lessons.every(
      (l) => l.slug === lessonSlug || completedIfDone.has(l.slug),
    );

  const prevUnlocked =
    prev && isLessonUnlocked(track, prev.slug, completed, passedStages);

  const prevNav =
    prevUnlocked && prev
      ? {
          href: `/learn/${track.slug}/${prev.slug}`,
          label: t("prev"),
          title: tl(prev.title, loc),
        }
      : null;

  let nextNav: {
    href: string;
    label: string;
    title: string;
  } | null = null;
  let nextBlocked = false;

  if (nextUnlocked && next) {
    nextNav = {
      href: `/learn/${track.slug}/${next.slug}`,
      label: t("next"),
      title: tl(next.title, loc),
    };
  } else if (next && nextWouldUnlock) {
    nextNav = {
      href: `/learn/${track.slug}/${next.slug}`,
      label: t("next"),
      title: tl(next.title, loc),
    };
    nextBlocked = true;
  } else if (showExamCta) {
    nextNav = {
      href: `/exam/${track.slug}/${stage.slug}`,
      label: te("takeExam"),
      title: tl(stage.title, loc),
    };
  } else if (endingStage && examWouldUnlock) {
    nextNav = {
      href: `/exam/${track.slug}/${stage.slug}`,
      label: te("takeExam"),
      title: tl(stage.title, loc),
    };
    nextBlocked = !lessonDone;
  } else if (!next) {
    nextNav = {
      href: `/tracks/${track.slug}`,
      label: t("backToTrack"),
      title: tl(track.title, loc),
    };
  } else {
    nextNav = {
      href: `/tracks/${track.slug}`,
      label: t("backToTrack"),
      title: tl(track.title, loc),
    };
  }

  const outlineItems = stage.lessons.map((item) => {
    const unlocked = isLessonUnlocked(
      track,
      item.slug,
      completed,
      passedStages,
    );
    const done = completed.has(item.slug);
    const current = item.slug === lesson.slug;
    const status = current
      ? ("current" as const)
      : done
        ? ("done" as const)
        : unlocked
          ? ("available" as const)
          : ("locked" as const);
    return {
      slug: item.slug,
      title: tl(item.title, loc),
      status,
      href: unlocked ? `/learn/${track.slug}/${item.slug}` : undefined,
    };
  });

  return (
    <div className="ay-page lesson-page lesson-page-wide">
      <div className="ay-page-ambient" aria-hidden />

      <div className="lesson-layout">
        <LessonOutline
          backHref={`/tracks/${track.slug}`}
          backLabel={t("backToTrack")}
          outlineLabel={t("outline")}
          lockedLabel={t("locked")}
          items={outlineItems}
          exam={
            showExamCta
              ? {
                  href: `/exam/${track.slug}/${stage.slug}`,
                  label: te("takeExam"),
                }
              : null
          }
        />

        <div className="lesson-main">
          <div className="ai-helper-rail">
            <div className="ai-helper-sticky">
              <AiHelper
                trackSlug={trackSlug}
                lessonSlug={lessonSlug}
                lessonTitle={tl(lesson.title, loc)}
              />
            </div>
          </div>

          <article className="animate-rise lesson-article">
            <LessonStickyBar>
              <div className="lesson-sticky-head">
                <div className="lesson-sticky-copy">
                  <p className="lesson-sticky-kicker">
                    {tl(track.title, loc)} · {index + 1}/{total} ·{" "}
                    {lesson.duration} {t("minutes")}
                  </p>
                  <h1 className="lesson-sticky-title">
                    {tl(lesson.title, loc)}
                  </h1>
                </div>
                <LessonActions
                  trackSlug={trackSlug}
                  lessonSlug={lessonSlug}
                  initialCompleted={lessonDone}
                />
              </div>
              <LessonNav
                prev={prevNav}
                next={nextNav}
                nextBlocked={nextBlocked}
                blockedMessage={t("nextNeedsComplete")}
                ariaLabel={t("navAria")}
              />
            </LessonStickyBar>

            <div className="lesson-summary">
              <p>{tl(lesson.summary, loc)}</p>
            </div>

            <LessonBody
              content={tl(lesson.content, loc)}
              trackSlug={trackSlug}
              lessonSlug={lessonSlug}
              isLoggedIn
            />

            <SocialBar
              targetType="lesson"
              targetId={`${track.slug}:${lesson.slug}`}
              shareUrl={`/${locale}/share/lesson/${track.slug}/${lesson.slug}`}
              shareTitle={tl(lesson.title, loc)}
            />

            {showExamCta ? (
              <div className="lesson-exam-cta">
                <p className="lesson-exam-cta-title">{te("stageReadyTitle")}</p>
                <p className="lesson-exam-cta-hint">
                  {te("stageReadyHint", { pass: PASS_SCORE })}
                </p>
                <Link
                  href={`/exam/${track.slug}/${stage.slug}`}
                  className="btn-primary lesson-exam-cta-btn"
                >
                  {te("takeExam")}
                </Link>
              </div>
            ) : null}
          </article>
        </div>
      </div>
    </div>
  );
}
