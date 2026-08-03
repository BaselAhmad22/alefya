import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTrack, getAllLessons, countLessons, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import {
  getContinueTarget,
  getCompletedLessonSlugs,
  getPassedStages,
} from "@/lib/progress-gates";

type Props = { params: Promise<{ locale: string }> };

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  if (!session?.user?.id) {
    redirect(
      `/${locale}/login?next=${encodeURIComponent(`/${locale}/dashboard`)}`,
    );
  }

  const t = await getTranslations("dashboard");
  const tr = await getTranslations("roadmap");
  const loc = locale as Locale;

  const [enrollments, progress, roadmap] = await Promise.all([
    prisma.trackEnrollment.findMany({
      where: { userId: session.user.id },
      orderBy: { startedAt: "desc" },
    }),
    prisma.progress.findMany({
      where: { userId: session.user.id },
      orderBy: { completedAt: "desc" },
    }),
    prisma.userRoadmap.findUnique({ where: { userId: session.user.id } }),
  ]);

  const byTrack = new Map<string, Set<string>>();
  for (const row of progress) {
    if (!byTrack.has(row.trackSlug)) byTrack.set(row.trackSlug, new Set());
    byTrack.get(row.trackSlug)!.add(row.lessonSlug);
  }

  let roadmapContinue: string | null = null;
  if (roadmap) {
    const track = getTrack(roadmap.currentTrackSlug);
    if (track) {
      const [completed, passed] = await Promise.all([
        getCompletedLessonSlugs(session.user.id, track.slug),
        getPassedStages(session.user.id, track.slug),
      ]);
      const target = getContinueTarget(track, completed, passed);
      if (target.type === "lesson") {
        roadmapContinue = `/learn/${track.slug}/${target.lessonSlug}`;
      } else if (target.type === "exam") {
        roadmapContinue = `/learn/${track.slug}/exam/${target.stageSlug}`;
      } else {
        const sequence = JSON.parse(roadmap.trackSequence) as string[];
        const idx = sequence.indexOf(track.slug);
        const nextSlug = idx >= 0 ? sequence[idx + 1] : null;
        if (nextSlug) {
          await prisma.trackEnrollment.upsert({
            where: {
              userId_trackSlug: {
                userId: session.user.id,
                trackSlug: nextSlug,
              },
            },
            create: { userId: session.user.id, trackSlug: nextSlug },
            update: {},
          });
          await prisma.userRoadmap.update({
            where: { userId: session.user.id },
            data: { currentTrackSlug: nextSlug },
          });
          const nextTrack = getTrack(nextSlug);
          const first = nextTrack?.stages[0]?.lessons[0];
          roadmapContinue = first
            ? `/learn/${nextSlug}/${first.slug}`
            : `/tracks/${nextSlug}`;
        }
      }
    }
  }

  const cards = await Promise.all(
    enrollments.map(async (e) => {
      const track = getTrack(e.trackSlug);
      if (!track) return null;
      const completed = byTrack.get(track.slug) ?? new Set();
      const all = getAllLessons(track);
      const total = countLessons(track);
      const done = all.filter((l) => completed.has(l.slug)).length;
      const passed = await getPassedStages(session.user.id, track.slug);
      const target = getContinueTarget(track, completed, passed);
      let href = `/tracks/${track.slug}`;
      if (target.type === "lesson") {
        href = `/learn/${track.slug}/${target.lessonSlug}`;
      } else if (target.type === "exam") {
        href = `/learn/${track.slug}/exam/${target.stageSlug}`;
      } else if (all[0]) {
        href = `/learn/${track.slug}/${all[0].slug}`;
      }
      return { track, done, total, href };
    }),
  );

  const visibleCards = cards.filter(
    (x): x is NonNullable<(typeof cards)[number]> => Boolean(x),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">
        {t("title")}
      </h1>
      <p className="mt-2 text-ink-muted">{t("subtitle")}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        {roadmapContinue ? (
          <Link href={roadmapContinue} className="btn-primary">
            {tr("continue")}
          </Link>
        ) : (
          <Link href="/start" className="btn-primary">
            {t("startZero")}
          </Link>
        )}
        <Link href="/categories" className="btn-ghost">
          {t("browse")}
        </Link>
      </div>

      {visibleCards.length === 0 ? (
        <div className="mt-10 border border-line bg-bg-elevated/40 p-8">
          <p className="text-ink-muted">{t("empty")}</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-4">
          {visibleCards.map(({ track, done, total, href }) => {
            const pct = total ? Math.round((done / total) * 100) : 0;
            return (
              <Link
                key={track.slug}
                href={href}
                className="group relative block overflow-hidden rounded-[calc(var(--radius)+2px)] border border-line/80 bg-bg-elevated/55 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal/40 hover:bg-bg-elevated sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink transition-colors group-hover:text-teal-bright">
                      {tl(track.title, loc)}
                    </h2>
                    <p className="mt-1 text-sm text-ink-muted">
                      {done}/{total} {t("completedLessons")} · {pct}%
                    </p>
                    <div className="mt-3 h-1.5 w-52 max-w-full overflow-hidden rounded-full bg-bg-soft">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal to-accent transition-[width] duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-bg/50 px-3.5 py-2 text-sm text-ink-muted transition-all group-hover:border-accent/40 group-hover:text-accent sm:self-center">
                    {t("resume")}
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-accent rtl:rotate-180"
                      aria-hidden
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
