import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getCategory } from "@/lib/categories";
import { getTrack, countLessons, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/Reveal";

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
    <div className="ay-page">
      <div className="ay-page-ambient" aria-hidden />

      <Link
        href="/categories"
        className="inline-flex text-sm text-ink-muted transition-colors hover:text-accent"
      >
        ← {t("back")}
      </Link>

      <header className="page-hero mt-6">
        <p className="page-kicker">AlefYa</p>
        <h1 className="page-title">{tl(category.title, loc)}</h1>
        <p className="page-sub">{tl(category.description, loc)}</p>
        <hr className="page-hero-rule" />
      </header>

      {tracks.length === 0 ? (
        <div className="catalog-empty mt-10 rounded-2xl">
          <p className="text-ink-muted">{t("emptyCategory")}</p>
          <Link href="/categories" className="btn-ghost mt-4 inline-flex">
            {t("back")}
          </Link>
        </div>
      ) : (
        <div className="mt-10 journey-grid">
          {tracks.map((track, i) => (
            <Reveal key={track.slug} delay={i * 70}>
              <Link href={`/tracks/${track.slug}`} className="journey-row group">
                <span className="journey-row-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="journey-row-body min-w-0">
                  <h2 className="journey-row-title">{tl(track.title, loc)}</h2>
                  <p className="journey-row-meta">{tl(track.tagline, loc)}</p>
                </div>
                <div className="journey-row-aside text-end">
                  <p className="journey-row-meta !text-xs">
                    {track.stages.length} {tt("stages")} · {countLessons(track)}{" "}
                    {tt("lessons")}
                  </p>
                  <p className="journey-row-go !mt-1">{tt("viewTrack")}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

