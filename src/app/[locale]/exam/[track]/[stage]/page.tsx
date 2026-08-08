import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BackLink } from "@/components/BackLink";
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
    <main className="ay-page ay-page-focus exam-page min-h-[calc(100vh-4rem)]">
      <div className="ay-page-ambient" aria-hidden />
      <BackLink href={`/tracks/${trackSlug}`}>{t("backToTrack")}</BackLink>
      <header className="page-hero">
        <p className="page-kicker">{tl(track.title, loc)}</p>
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-sub">
          {t("subtitle", {
            stage: tl(stage.title, loc),
            pass: PASS_SCORE,
          })}
        </p>
        {passedStages.has(stageSlug) && (
          <p className="exam-passed-badge">{t("alreadyPassed")}</p>
        )}
        <hr className="page-hero-rule" />
      </header>
      <div className="exam-body">
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
