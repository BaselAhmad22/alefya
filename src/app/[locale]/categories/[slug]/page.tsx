import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { CSSProperties } from "react";
import { Link } from "@/i18n/routing";
import { getCategory } from "@/lib/categories";
import { getTrack, countLessons, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/Reveal";
import { BackLink } from "@/components/BackLink";

/** Public category detail — rebuild at most once per hour. */
export const revalidate = 3600;

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function CategoryDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const category = getCategory(slug);
  if (!category) notFound();

  const t = await getTranslations("categories");
  const tt = await getTranslations("tracks");
  const loc = locale as Locale;
  const tracks = category.trackSlugs
    .map((s) => getTrack(s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <div
      className="ay-page category-page"
      style={{ ["--category-accent" as string]: category.color || "var(--teal)" }}
    >
      <div className="ay-page-ambient category-page-ambient" aria-hidden />

      <BackLink href="/categories" className="category-back">
        {t("back")}
      </BackLink>

      <header className="category-hero">
        <div className="category-hero-panel">
          <p className="category-hero-kicker">{t("label")}</p>
          <h1 className="category-hero-title">{tl(category.title, loc)}</h1>
          <p className="category-hero-sub">{tl(category.description, loc)}</p>
          <div className="category-hero-meta">
            <span className="category-hero-pill">
              {tracks.length > 0
                ? `${tracks.length} ${t("tracksCount")}`
                : t("comingSoon")}
            </span>
            {tracks.length > 0 ? (
              <span className="category-hero-hint">{t("pickTrack")}</span>
            ) : null}
          </div>
        </div>
      </header>

      {tracks.length === 0 ? (
        <div className="category-empty">
          <p className="category-empty-text">{t("emptyCategory")}</p>
          <Link href="/categories" className="btn-ghost">
            {t("back")}
          </Link>
        </div>
      ) : (
        <section className="category-tracks" aria-label={t("tracksCount")}>
          <div className="category-tracks-head">
            <h2 className="category-tracks-title">{t("tracksHeading")}</h2>
            <p className="category-tracks-hint">{tt("linearHint")}</p>
          </div>

          <ol className="category-track-list">
            {tracks.map((track, i) => {
              const lessons = countLessons(track);
              const accent = track.color || category.color || "#14b8a6";
              return (
                <Reveal key={track.slug} delay={i * 55}>
                  <li>
                    <Link
                      href={`/tracks/${track.slug}`}
                      className="category-track-card"
                      style={
                        { ["--track-accent" as string]: accent } as CSSProperties
                      }
                    >
                      <span className="category-track-index" aria-hidden>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="category-track-body">
                        <h3 className="category-track-title">
                          {tl(track.title, loc)}
                        </h3>
                        <p className="category-track-tag">
                          {tl(track.tagline, loc)}
                        </p>
                        <p className="category-track-stats">
                          {track.stages.length} {tt("stages")}
                          <span aria-hidden>·</span>
                          {lessons} {tt("lessons")}
                          <span aria-hidden>·</span>
                          ~{track.estimatedHours}h
                        </p>
                      </div>
                      <span className="category-track-go">
                        {tt("viewPlan")}
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </Link>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </section>
      )}
    </div>
  );
}
