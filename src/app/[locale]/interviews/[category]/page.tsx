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
    <div className="ay-page interview-hub">
      <div className="ay-page-ambient" aria-hidden />

      <Link href="/interviews/tech" className="exam-back-link">
        <span className="exam-back-chip rtl:rotate-180" aria-hidden>
          ←
        </span>
        {t("backTechSection")}
      </Link>

      <header className="page-hero mt-6">
        <p className="page-kicker">{t("label")}</p>
        <h1 className="page-title">{tl(category.title, loc)}</h1>
        <p className="page-sub">{t("categoryHint")}</p>
        <hr className="page-hero-rule" />
      </header>

      {tracks.length === 0 ? (
        <div className="catalog-empty mt-10 rounded-2xl">
          <p className="text-ink-muted">{t("emptyCategory")}</p>
        </div>
      ) : (
        <div className="mt-10 journey-grid">
          {tracks.map((track, i) => {
            const q = getInterviewQuestionCount(track.slug);
            return (
              <Reveal key={track.slug} delay={i * 70}>
                <Link
                  href={`/interviews/${categorySlug}/${track.slug}`}
                  className="journey-row interview-track-row"
                >
                  <span className="journey-row-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="journey-row-body min-w-0">
                    <h2 className="journey-row-title">{tl(track.title, loc)}</h2>
                    <p className="journey-row-meta">{tl(track.tagline, loc)}</p>
                    <p className="journey-row-meta !mt-1 !text-accent">
                      {t("bankSize", { count: q })}
                    </p>
                  </div>
                  <span className="btn-primary interview-track-cta shrink-0 self-start sm:self-center">
                    {t("startSession")}
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}

