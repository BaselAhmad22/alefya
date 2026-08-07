import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllCategories } from "@/lib/categories";
import { trackExists, t as tl } from "@/lib/content";
import { getInterviewQuestionCount } from "@/lib/interview-counts";
import type { Locale } from "@/i18n/config";
import type { CSSProperties } from "react";
import { Link } from "@/i18n/routing";
import { Reveal } from "@/components/Reveal";

type Props = { params: Promise<{ locale: string }> };

export default async function TechInterviewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("interviews");
  const th = await getTranslations("hrInterviews");
  const categories = getAllCategories();
  const loc = locale as Locale;

  return (
    <div className="ay-page interview-hub">
      <div className="ay-page-ambient" aria-hidden />

      <Link href="/interviews" className="exam-back-link">
        <span className="exam-back-chip rtl:rotate-180" aria-hidden>
          ←
        </span>
        {t("backHub")}
      </Link>

      <header className="page-hero mt-6">
        <p className="page-kicker">{t("label")}</p>
        <h1 className="page-title">{th("techSectionTitle")}</h1>
        <p className="page-sub">{t("techCategoryHint")}</p>
        <hr className="page-hero-rule" />
      </header>

      <div className="catalog-grid mt-10">
        {categories.map((cat, i) => {
          const tracks = cat.trackSlugs.filter((s) => trackExists(s));
          const qCount = tracks.reduce(
            (sum, s) => sum + getInterviewQuestionCount(s),
            0,
          );
          return (
            <Reveal key={cat.slug} delay={i * 60} className="h-full">
              <Link
                href={`/interviews/${cat.slug}`}
                className="catalog-card interview-cat-card h-full"
                style={
                  {
                    ["--card-accent"]:
                      i % 3 === 0
                        ? "var(--accent)"
                        : i % 3 === 1
                          ? "var(--teal)"
                          : "#2dd4bf",
                  } as CSSProperties
                }
              >
                <p className="catalog-card-meta">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="catalog-card-title">{tl(cat.title, loc)}</h2>
                <p className="catalog-card-desc line-clamp-2">
                  {tl(cat.description, loc)}
                </p>
                <span className="catalog-card-go">
                  {t("catMeta", {
                    tracks: tracks.length,
                    questions: qCount,
                  })}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
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
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
