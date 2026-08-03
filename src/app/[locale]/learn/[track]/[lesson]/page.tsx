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
import { LessonOutline } from "@/components/LessonOutline";
import { AiHelper } from "@/components/AiHelper";
import {
  assertCanAccessLesson,
  isLessonUnlocked,
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

  return (
    <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[270px_1fr] lg:items-start sm:px-6">
      <LessonOutline
        backHref={`/tracks/${track.slug}`}
        backLabel={t("backToTrack")}
        outlineLabel={t("outline")}
        stageTitle={tl(stage.title, loc)}
        lockedLabel={t("locked")}
        items={stage.lessons.map((item) => {
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
            href: unlocked
              ? `/learn/${track.slug}/${item.slug}`
              : undefined,
          };
        })}
        exam={
          showExamCta
            ? {
                href: `/learn/${track.slug}/exam/${stage.slug}`,
                label: te("takeExam"),
              }
            : null
        }
      />

      <div className="relative min-w-0">
        <div className="ai-helper-rail">
          <div className="ai-helper-sticky">
            <AiHelper
              trackSlug={trackSlug}
              lessonSlug={lessonSlug}
              lessonTitle={tl(lesson.title, loc)}
            />
          </div>
        </div>

        <article className="animate-rise min-w-0 lg:pe-20">
        <LessonStickyBar>
          <div className="flex items-center justify-between gap-4 px-4 py-3.5">
            <div className="min-w-0">
              <p className="text-xs text-ink-muted">
                {tl(track.title, loc)} · {index + 1}/{total} · {lesson.duration}{" "}
                {t("minutes")}
              </p>
              <h1 className="mt-1 truncate font-[family-name:var(--font-display)] text-lg leading-snug sm:text-xl">
                {tl(lesson.title, loc)}
              </h1>
            </div>
            <LessonActions
              trackSlug={trackSlug}
              lessonSlug={lessonSlug}
              initialCompleted={lessonDone}
            />
          </div>
        </LessonStickyBar>

        <div className="mb-8 border-b border-line pb-5">
          <p className="max-w-2xl text-ink-muted">{tl(lesson.summary, loc)}</p>
        </div>

        <LessonBody
          content={tl(lesson.content, loc)}
          trackSlug={trackSlug}
          lessonSlug={lessonSlug}
          isLoggedIn
        />

        {showExamCta && (
          <div className="mt-10 border border-accent/30 bg-accent/5 px-5 py-4">
            <p className="font-medium">{te("stageReadyTitle")}</p>
            <p className="mt-1 text-sm text-ink-muted">
              {te("stageReadyHint", { pass: PASS_SCORE })}
            </p>
            <Link
              href={`/learn/${track.slug}/exam/${stage.slug}`}
              className="mt-3 inline-block rounded bg-accent px-4 py-2 text-sm font-medium text-bg"
            >
              {te("takeExam")}
            </Link>
          </div>
        )}

        <nav className="lesson-pager" aria-label="Lesson navigation">
          {prev &&
          isLessonUnlocked(track, prev.slug, completed, passedStages) ? (
            <Link
              href={`/learn/${track.slug}/${prev.slug}`}
              className="lesson-pager-btn lesson-pager-prev group"
            >
              <span className="lesson-pager-chip rtl:rotate-180" aria-hidden>
                ←
              </span>
              <span className="lesson-pager-meta">
                <span className="lesson-pager-label">{t("prev")}</span>
                <span className="lesson-pager-title">{tl(prev.title, loc)}</span>
              </span>
            </Link>
          ) : (
            <span className="lesson-pager-empty" aria-hidden />
          )}
          {nextUnlocked && next ? (
            <Link
              href={`/learn/${track.slug}/${next.slug}`}
              className="lesson-pager-btn lesson-pager-next group"
            >
              <span className="lesson-pager-meta">
                <span className="lesson-pager-label">{t("next")}</span>
                <span className="lesson-pager-title">{tl(next.title, loc)}</span>
              </span>
              <span className="lesson-pager-chip rtl:rotate-180" aria-hidden>
                →
              </span>
            </Link>
          ) : showExamCta ? (
            <Link
              href={`/learn/${track.slug}/exam/${stage.slug}`}
              className="lesson-pager-btn lesson-pager-next group"
            >
              <span className="lesson-pager-meta">
                <span className="lesson-pager-label">{te("takeExam")}</span>
                <span className="lesson-pager-title">{tl(stage.title, loc)}</span>
              </span>
              <span className="lesson-pager-chip rtl:rotate-180" aria-hidden>
                →
              </span>
            </Link>
          ) : (
            <Link
              href={`/tracks/${track.slug}`}
              className="lesson-pager-btn lesson-pager-next group"
            >
              <span className="lesson-pager-meta">
                <span className="lesson-pager-label">{t("backToTrack")}</span>
                <span className="lesson-pager-title">{tl(track.title, loc)}</span>
              </span>
              <span className="lesson-pager-chip rtl:rotate-180" aria-hidden>
                →
              </span>
            </Link>
          )}
        </nav>
        </article>
      </div>
    </div>
  );
}
