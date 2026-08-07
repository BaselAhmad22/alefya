import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTrack, getAllLessons, countLessons, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import {
  getContinueTarget,
  getPassedStages,
} from "@/lib/progress-gates";

type Props = { params: Promise<{ locale: string }> };

export default async function TracksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) {
    redirect(
      `/${locale}/login?next=${encodeURIComponent(`/${locale}/tracks`)}`,
    );
  }

  const t = await getTranslations("tracks");
  const loc = locale as Locale;
  const userId = session.user.id;

  const [enrollments, progressRows] = await Promise.all([
    prisma.trackEnrollment.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
    }),
    prisma.progress.findMany({
      where: { userId },
      select: { trackSlug: true, lessonSlug: true },
    }),
  ]);

  const byTrack = new Map<string, Set<string>>();
  for (const row of progressRows) {
    if (!byTrack.has(row.trackSlug)) byTrack.set(row.trackSlug, new Set());
    byTrack.get(row.trackSlug)!.add(row.lessonSlug);
  }

  const items = (
    await Promise.all(
      enrollments.map(async (e, index) => {
        const track = getTrack(e.trackSlug);
        if (!track) return null;
        const completed = byTrack.get(track.slug) ?? new Set();
        const all = getAllLessons(track);
        const total = countLessons(track);
        const done = all.filter((l) => completed.has(l.slug)).length;
        const passed = await getPassedStages(userId, track.slug);
        const target = getContinueTarget(track, completed, passed);
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;

        let continueHref = `/tracks/${track.slug}`;
        let continueKind: "lesson" | "exam" | "plan" | "done" = "plan";
        if (target.type === "lesson") {
          continueHref = `/learn/${track.slug}/${target.lessonSlug}`;
          continueKind = "lesson";
        } else if (target.type === "exam") {
          continueHref = `/exam/${track.slug}/${target.stageSlug}`;
          continueKind = "exam";
        } else {
          continueKind = "done";
        }

        return {
          index,
          slug: track.slug,
          title: tl(track.title, loc),
          tagline: tl(track.tagline, loc),
          description: tl(track.description, loc),
          color: track.color || "#14b8a6",
          stages: track.stages.length,
          lessons: total,
          hours: track.estimatedHours,
          done,
          pct,
          continueHref,
          continueKind,
          startedAt: e.startedAt,
        };
      }),
    )
  ).filter((x): x is NonNullable<typeof x> => Boolean(x));

  const totalLessons = items.reduce((s, i) => s + i.lessons, 0);
  const totalDone = items.reduce((s, i) => s + i.done, 0);
  const overallPct =
    totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0;

  const focus =
    items.find((i) => i.continueKind !== "done") ?? items[0] ?? null;

  return (
    <div className="my-tracks">
      <div className="my-tracks-ambient" aria-hidden />

      <header className="my-tracks-hero">
        <p className="my-tracks-kicker">AlefYa</p>
        <div className="my-tracks-hero-row">
          <div className="my-tracks-hero-copy">
            <h1 className="my-tracks-title">{t("myTitle")}</h1>
            <p className="my-tracks-sub">{t("mySubtitle")}</p>
          </div>
          {items.length > 0 ? (
            <ul className="my-tracks-stats" aria-label={t("progress")}>
              <li>
                <span className="my-tracks-stat-value">{items.length}</span>
                <span className="my-tracks-stat-label">{t("statTracks")}</span>
              </li>
              <li>
                <span className="my-tracks-stat-value">
                  {totalDone}
                  <em>/{totalLessons || 0}</em>
                </span>
                <span className="my-tracks-stat-label">{t("statLessons")}</span>
              </li>
              <li>
                <span className="my-tracks-stat-value">{overallPct}%</span>
                <span className="my-tracks-stat-label">{t("progress")}</span>
              </li>
            </ul>
          ) : null}
        </div>
      </header>

      {items.length === 0 ? (
        <section className="my-tracks-empty">
          <div className="my-tracks-empty-glow" aria-hidden />
          <p className="my-tracks-empty-kicker">{t("emptyKicker")}</p>
          <h2 className="my-tracks-empty-title">{t("myEmpty")}</h2>
          <p className="my-tracks-empty-hint">{t("emptyHint")}</p>
          <div className="my-tracks-empty-actions">
            <Link href="/categories" className="btn-primary">
              {t("browseCategories")}
            </Link>
            <Link href="/start" className="btn-ghost">
              {t("emptyStart")}
            </Link>
          </div>
        </section>
      ) : (
        <>
          {focus ? (
            <section className="my-tracks-focus" aria-labelledby="my-tracks-focus-title">
              <div
                className="my-tracks-focus-panel"
                style={{ ["--track-accent" as string]: focus.color }}
              >
                <div className="my-tracks-focus-copy">
                  <p className="my-tracks-focus-label">{t("focusLabel")}</p>
                  <h2 id="my-tracks-focus-title" className="my-tracks-focus-title">
                    {focus.title}
                  </h2>
                  <p className="my-tracks-focus-tag">{focus.tagline}</p>
                  <div className="my-tracks-focus-bar" aria-hidden>
                    <span style={{ width: `${focus.pct}%` }} />
                  </div>
                  <p className="my-tracks-focus-meta">
                    {focus.done}/{focus.lessons} {t("lessons")} · {focus.pct}%
                  </p>
                  <div className="my-tracks-focus-actions">
                    <Link href={focus.continueHref} className="btn-primary">
                      {focus.continueKind === "exam"
                        ? t("continueExam")
                        : focus.continueKind === "done"
                          ? t("viewTrack")
                          : t("continue")}
                    </Link>
                    <Link
                      href={`/tracks/${focus.slug}`}
                      className="btn-ghost"
                    >
                      {t("viewPlan")}
                    </Link>
                  </div>
                </div>
                <div className="my-tracks-focus-ring" aria-hidden>
                  <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" className="my-tracks-ring-bg" />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      className="my-tracks-ring-fg"
                      style={{
                        strokeDasharray: `${(focus.pct / 100) * 327} 327`,
                      }}
                    />
                  </svg>
                  <span>{focus.pct}%</span>
                </div>
              </div>
            </section>
          ) : null}

          <section className="my-tracks-list" aria-label={t("myTitle")}>
            <div className="my-tracks-list-head">
              <h2 className="my-tracks-list-title">{t("allTracks")}</h2>
              <p className="my-tracks-list-hint">{t("linearHint")}</p>
            </div>

            <ol className="my-tracks-rows">
              {items.map((item, i) => (
                <li
                  key={item.slug}
                  className={`my-tracks-row ${item.continueKind === "done" ? "is-done" : ""}`}
                  style={{
                    ["--track-accent" as string]: item.color,
                    ["--i" as string]: i,
                  }}
                >
                  <Link href={item.continueHref} className="my-tracks-row-main">
                    <span className="my-tracks-row-index" aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="my-tracks-row-body">
                      <span className="my-tracks-row-top">
                        <span className="my-tracks-row-title">{item.title}</span>
                        <span
                          className={`my-tracks-row-badge is-${item.continueKind}`}
                        >
                          {item.continueKind === "done"
                            ? t("statusDone")
                            : item.continueKind === "exam"
                              ? t("statusExam")
                              : t("statusActive")}
                        </span>
                      </span>
                      <span className="my-tracks-row-tag">{item.tagline}</span>
                      <span className="my-tracks-row-progress" aria-hidden>
                        <span style={{ width: `${item.pct}%` }} />
                      </span>
                      <span className="my-tracks-row-meta">
                        <span>
                          {item.stages} {t("stages")}
                        </span>
                        <span>
                          {item.done}/{item.lessons} {t("lessons")}
                        </span>
                        <span>
                          ~{item.hours} {t("hours")}
                        </span>
                      </span>
                    </span>
                    <span className="my-tracks-row-cta">
                      <span className="my-tracks-row-pct">{item.pct}%</span>
                      <span className="my-tracks-row-go">
                        {item.continueKind === "exam"
                          ? t("continueExam")
                          : item.continueKind === "done"
                            ? t("viewPlan")
                            : t("continue")}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path
                            d="M3.5 8h9M8.5 4l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </span>
                  </Link>
                  <Link
                    href={`/tracks/${item.slug}`}
                    className="my-tracks-row-plan"
                    data-no-loader
                  >
                    {t("viewPlan")}
                  </Link>
                </li>
              ))}
            </ol>

            <div className="my-tracks-footer">
              <Link href="/categories" className="btn-ghost">
                {t("browseCategories")}
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
