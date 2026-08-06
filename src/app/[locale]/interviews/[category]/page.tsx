import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getCategory } from "@/lib/categories";
import { getTrackMeta, t as tl } from "@/lib/content";
import { getInterviewQuestionCount } from "@/lib/interview-counts";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/Reveal";

type Props = { params: Promise<{ locale: string; category: string }> };

export default async function InterviewCategoryPage({ params }: Props) {
  const { locale, category: categorySlug } = await params;
  setRequestLocale(locale);
  const category = getCategory(categorySlug);
  if (!category) notFound();

  const t = await getTranslations("interviews");
  const loc = locale as Locale;
  const tracks = category.trackSlugs
    .map((s) => getTrackMeta(s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <div className="interview-hub mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/interviews"
        className="text-sm text-ink-muted transition-colors hover:text-accent"
      >
        ← {t("backAll")}
      </Link>

      <div className="mt-6 animate-rise">
        <div className="accent-rule mb-4 max-w-[4rem]" />
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
          {tl(category.title, loc)}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-muted">
          {t("categoryHint")}
        </p>
      </div>

      {tracks.length === 0 ? (
        <div className="mt-12 border border-line bg-bg-elevated/40 p-8">
          <p className="text-ink-muted">{t("emptyCategory")}</p>
        </div>
      ) : (
        <div className="mt-12 grid gap-5">
          {tracks.map((track, i) => {
            const q = getInterviewQuestionCount(track.slug);
            return (
              <Reveal key={track.slug} delay={i * 70}>
                <div className="surface-panel flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-[family-name:var(--font-display)] text-2xl">
                      {tl(track.title, loc)}
                    </h2>
                    <p className="mt-2 text-ink-muted">{tl(track.tagline, loc)}</p>
                    <p className="mt-3 text-sm text-accent">
                      {t("bankSize", { count: q })}
                    </p>
                  </div>
                  <Link
                    href={`/interviews/${categorySlug}/${track.slug}`}
                    className="btn-primary shrink-0 self-start sm:self-center"
                  >
                    {t("startSession")}
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
