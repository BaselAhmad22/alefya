import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTrack, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import {
  getCompletedLessonSlugs,
  getPassedStages,
  isLessonUnlocked,
  isStageExamUnlocked,
  nextStage,
  PASS_SCORE,
} from "@/lib/progress-gates";
import { StageExamClient } from "@/components/StageExamClient";
import { LessonOutline } from "@/components/LessonOutline";
import { AiHelper } from "@/components/AiHelper";

type Props = {
  params: Promise<{ locale: string; track: string; stage: string }>;
};

export default async function StageExamPage({ params }: Props) {
  const { locale, track: trackSlug, stage: stageSlug } = await params;
  setRequestLocale(locale);
  const track = getTrack(trackSlug);
  if (!track) notFound();
  const stage = track.stages.find((s) => s.slug === stageSlug);
  if (!stage) notFound();

  const session = await auth();
  if (!session?.user?.id) {
    redirect(
      `/${locale}/login?next=${encodeURIComponent(`/${locale}/learn/${trackSlug}/exam/${stageSlug}`)}`,
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
  if (!enrollment) redirect(`/${locale}/tracks/${trackSlug}`);

  const [completed, passedStages] = await Promise.all([
    getCompletedLessonSlugs(session.user.id, trackSlug),
    getPassedStages(session.user.id, trackSlug),
  ]);

  if (!isStageExamUnlocked(track, stageSlug, completed, passedStages)) {
    redirect(`/${locale}/tracks/${trackSlug}`);
  }

  const t = await getTranslations("exam");
  const tlLesson = await getTranslations("lesson");
  const loc = locale as Locale;
  const nxt = nextStage(track, stageSlug);
  const nextHref = nxt
    ? `/learn/${trackSlug}/${nxt.lessons[0]?.slug}`
    : `/tracks/${trackSlug}`;

  const alreadyPassed = passedStages.has(stageSlug);

  return (
    <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[270px_1fr] lg:items-start sm:px-6">
      <LessonOutline
        backHref={`/tracks/${trackSlug}`}
        backLabel={t("backToTrack")}
        outlineLabel={tlLesson("outline")}
        stageTitle={tl(stage.title, loc)}
        lockedLabel={tlLesson("locked")}
        items={stage.lessons.map((item) => {
          const unlocked = isLessonUnlocked(
            track,
            item.slug,
            completed,
            passedStages,
          );
          const done = completed.has(item.slug);
          const status = done
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
        })}
        exam={{
          href: `/learn/${trackSlug}/exam/${stageSlug}`,
          label: t("title"),
          active: true,
        }}
      />

      <div className="relative min-w-0">
        <div className="ai-helper-rail">
          <div className="ai-helper-sticky">
            <AiHelper
              trackSlug={trackSlug}
              lessonSlug={`exam-${stageSlug}`}
              lessonTitle={tl(stage.title, loc)}
            />
          </div>
        </div>

        <div className="min-w-0 lg:pe-20">
        <Link
          href={`/tracks/${trackSlug}`}
          className="text-sm text-ink-muted hover:text-accent lg:hidden"
        >
          ← {t("backToTrack")}
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:mt-0">
          {t("title")}
        </h1>
        <p className="mt-2 text-ink-muted">
          {t("subtitle", {
            stage: tl(stage.title, loc),
            pass: PASS_SCORE,
          })}
        </p>
        {alreadyPassed && (
          <p className="mt-4 text-sm text-teal">{t("alreadyPassed")}</p>
        )}
        <div className="mt-10">
          <StageExamClient
            trackSlug={trackSlug}
            stageSlug={stageSlug}
            stageTitle={tl(stage.title, loc)}
            nextHref={nextHref}
          />
        </div>
        </div>
      </div>
    </div>
  );
}
