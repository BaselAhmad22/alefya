import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { StageExamClient } from "@/components/StageExamClient";
import { auth } from "@/lib/auth";
import { getTrack, t as tl } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/config";
import {
  getCompletedLessonSlugs,
  getPassedStages,
  isStageExamUnlocked,
  nextStage,
  PASS_SCORE,
} from "@/lib/progress-gates";

type Props = {
  params: Promise<{ locale: string; track: string; stage: string }>;
};

export default async function ExamPage({ params }: Props) {
  const { locale, track: trackSlug, stage: stageSlug } = await params;
  setRequestLocale(locale);
  const track = getTrack(trackSlug);
  if (!track) notFound();
  const stage = track.stages.find((item) => item.slug === stageSlug);
  if (!stage) notFound();

  const session = await auth();
  if (!session?.user?.id) {
    redirect(
      `/${locale}/login?next=${encodeURIComponent(`/${locale}/exam/${trackSlug}/${stageSlug}`)}`,
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
  const loc = locale as Locale;
  const next = nextStage(track, stageSlug);
  const nextHref = next
    ? `/learn/${trackSlug}/${next.lessons[0]?.slug}`
    : `/tracks/${trackSlug}`;

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-4xl px-4 py-10 sm:px-6">
      <Link
        href={`/tracks/${trackSlug}`}
        className="text-sm text-ink-muted transition-colors hover:text-accent"
      >
        ← {t("backToTrack")}
      </Link>
      <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-2 text-ink-muted">
        {t("subtitle", {
          stage: tl(stage.title, loc),
          pass: PASS_SCORE,
        })}
      </p>
      {passedStages.has(stageSlug) && (
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
    </main>
  );
}
