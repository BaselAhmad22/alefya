import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTrack, getAllLessons, countLessons, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import { getContinueTarget, getPassedStages } from "@/lib/progress-gates";
import { DashboardFilters } from "@/components/CatalogFilters";

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
  const tTracks = await getTranslations("tracks");
  const loc = locale as Locale;

  const [enrollments, progress] = await Promise.all([
    prisma.trackEnrollment.findMany({
      where: { userId: session.user.id },
      orderBy: { startedAt: "desc" },
    }),
    prisma.progress.findMany({
      where: { userId: session.user.id },
      orderBy: { completedAt: "desc" },
    }),
  ]);

  const byTrack = new Map<string, Set<string>>();
  for (const row of progress) {
    if (!byTrack.has(row.trackSlug)) byTrack.set(row.trackSlug, new Set());
    byTrack.get(row.trackSlug)!.add(row.lessonSlug);
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
      let href = `/${locale}/tracks/${track.slug}`;
      if (target.type === "lesson") {
        href = `/${locale}/learn/${track.slug}/${target.lessonSlug}`;
      } else if (target.type === "exam") {
        href = `/${locale}/exam/${track.slug}/${target.stageSlug}`;
      } else if (all[0]) {
        href = `/${locale}/learn/${track.slug}/${all[0].slug}`;
      }
      return {
        slug: track.slug,
        title: tl(track.title, loc),
        done,
        total,
        href,
        resumeLabel: t("resume"),
        completedLabel: t("completedLessons"),
      };
    }),
  );

  const visibleCards = cards.filter(
    (x): x is NonNullable<(typeof cards)[number]> => Boolean(x),
  );

  const trackCount = visibleCards.length;
  const totalLessons = visibleCards.reduce((s, c) => s + c.total, 0);
  const totalDone = visibleCards.reduce((s, c) => s + c.done, 0);
  const overallPct =
    totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0;

  return (
    <div className="ay-page dashboard-page">
      <div className="ay-page-ambient" aria-hidden />

      <header className="page-hero">
        <div className="page-hero-row">
          <div className="page-hero-copy">
            <p className="page-kicker">AlefYa</p>
            <h1 className="page-title">{t("title")}</h1>
            <p className="page-sub">{t("subtitle")}</p>
          </div>
          {trackCount > 0 ? (
            <ul className="page-stats" aria-label={tTracks("progress")}>
              <li>
                <span className="page-stat-value">{trackCount}</span>
                <span className="page-stat-label">{tTracks("statTracks")}</span>
              </li>
              <li>
                <span className="page-stat-value">
                  {totalDone}
                  <em>/{totalLessons || 0}</em>
                </span>
                <span className="page-stat-label">{tTracks("statLessons")}</span>
              </li>
              <li>
                <span className="page-stat-value">{overallPct}%</span>
                <span className="page-stat-label">{tTracks("progress")}</span>
              </li>
            </ul>
          ) : null}
        </div>
        <hr className="page-hero-rule" />
        <div className="page-actions">
          <Link href="/start" className="btn-primary">
            {t("startZero")}
          </Link>
          <Link href="/categories" className="btn-ghost">
            {t("browse")}
          </Link>
        </div>
      </header>

      {visibleCards.length === 0 ? (
        <div className="catalog-empty dashboard-empty">
          <p className="text-ink-muted">{t("empty")}</p>
          <div className="page-actions mt-5">
            <Link href="/categories" className="btn-primary">
              {t("browse")}
            </Link>
            <Link href="/start" className="btn-ghost">
              {t("startZero")}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <section className="dashboard-tracks-wrap" aria-label={t("title")}>
            <DashboardFilters
              cards={visibleCards}
              labels={{
                search: t("filterSearch"),
                status: t("filterStatus"),
                all: t("filterAll"),
                inProgress: t("filterInProgress"),
                completed: t("filterCompleted"),
                sort: t("filterSort"),
                sortRecent: t("sortRecent"),
                sortName: t("sortName"),
                sortProgress: t("sortProgress"),
                emptyFiltered: t("emptyFiltered"),
                clear: t("filterClear"),
              }}
            />
          </section>
        </>
      )}
    </div>
  );
}
