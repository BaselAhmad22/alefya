import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getCategory } from "@/lib/categories";
import { getTrack, countLessons, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/Reveal";

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
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/categories"
        className="text-sm text-ink-muted transition-colors hover:text-accent"
      >
        ← {t("back")}
      </Link>

      <div className="mt-6 animate-rise">
        <span
          className="mb-4 block h-1.5 w-16"
          style={{ background: category.color }}
        />
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
          {tl(category.title, loc)}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-muted">
          {tl(category.description, loc)}
        </p>
      </div>

      {tracks.length === 0 ? (
        <div className="mt-12 border border-line bg-bg-elevated/40 p-8">
          <p className="text-ink-muted">{t("emptyCategory")}</p>
          <Link href="/categories" className="btn-ghost mt-4 inline-flex">
            {t("back")}
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-5">
          {tracks.map((track, i) => (
            <Reveal key={track.slug} delay={i * 70}>
              <Link
                href={`/tracks/${track.slug}`}
                className="surface-panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl">
                    {tl(track.title, loc)}
                  </h2>
                  <p className="mt-2 text-ink-muted">
                    {tl(track.tagline, loc)}
                  </p>
                </div>
                <div className="text-sm text-ink-muted sm:text-end">
                  <p>
                    {track.stages.length} {tt("stages")} · {countLessons(track)}{" "}
                    {tt("lessons")}
                  </p>
                  <p className="mt-1 text-accent">{tt("viewTrack")}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
