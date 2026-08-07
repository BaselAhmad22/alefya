import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllCategories } from "@/lib/categories";
import { trackExists } from "@/lib/content";
import {
  getInterviewQuestionCount,
  getTotalHrQuestionCount,
} from "@/lib/interview-counts";
import { getAllHrTracks, HR_CATEGORY } from "@/lib/hr-tracks";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/routing";
import { Reveal } from "@/components/Reveal";

type Props = { params: Promise<{ locale: string }> };

function getTechStats() {
  const categories = getAllCategories();
  let tracks = 0;
  let questions = 0;
  for (const cat of categories) {
    const slugs = cat.trackSlugs.filter((s) => trackExists(s));
    tracks += slugs.length;
    questions += slugs.reduce((sum, s) => sum + getInterviewQuestionCount(s), 0);
  }
  return { categories: categories.length, tracks, questions };
}

export default async function InterviewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("interviews");
  const th = await getTranslations("hrInterviews");
  const loc = locale as Locale;
  const tech = getTechStats();
  const hrQuestionCount = getTotalHrQuestionCount();
  const hrTrackCount = getAllHrTracks().length;

  return (
    <div className="ay-page interview-hub interview-hub-root">
      <div className="ay-page-ambient" aria-hidden />

      <header className="page-hero">
        <p className="page-kicker">{t("label")}</p>
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-sub">{t("hubHint")}</p>
        <hr className="page-hero-rule" />
      </header>

      <div className="interview-hub-grid">
        <Reveal delay={0} className="h-full">
          <Link href="/interviews/tech" className="interview-section-card is-tech h-full">
            <span className="interview-section-kicker">TECH</span>
            <h2 className="interview-section-title">{th("techSectionTitle")}</h2>
            <p className="interview-section-desc">{t("techSectionDesc")}</p>
            <ul className="interview-section-points">
              <li>{t("techSectionPoint1")}</li>
              <li>{t("techSectionPoint2")}</li>
            </ul>
            <span className="interview-section-meta">
              {t("sectionMeta", {
                categories: tech.categories,
                tracks: tech.tracks,
                questions: tech.questions,
              })}
            </span>
            <span className="interview-section-go">
              {t("exploreSection")}
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

        <Reveal delay={80} className="h-full">
          <Link href="/interviews/hr" className="interview-section-card is-hr h-full">
            <span className="interview-section-kicker">HR</span>
            <h2 className="interview-section-title">{th("hrSectionTitle")}</h2>
            <p className="interview-section-desc">{HR_CATEGORY.description[loc]}</p>
            <ul className="interview-section-points">
              <li>{t("hrSectionPoint1")}</li>
              <li>{t("hrSectionPoint2")}</li>
            </ul>
            <span className="interview-section-meta">
              {t("catMeta", {
                tracks: hrTrackCount,
                questions: hrQuestionCount,
              })}
            </span>
            <span className="interview-section-go">
              {t("exploreSection")}
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
      </div>
    </div>
  );
}
