import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getAllHrTracks, HR_CATEGORY } from "@/lib/hr-tracks";
import { getHrInterviewQuestionCount } from "@/lib/interview-counts";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/Reveal";

type Props = { params: Promise<{ locale: string }> };

export default async function HrInterviewsCategoryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hrInterviews");
  const ti = await getTranslations("interviews");
  const loc = locale as Locale;
  const tracks = getAllHrTracks();

  return (
    <div className="ay-page interview-hub">
      <div className="ay-page-ambient" aria-hidden />

      <Link href="/interviews" className="exam-back-link">
        <span className="exam-back-chip rtl:rotate-180" aria-hidden>
          ←
        </span>
        {ti("backHub")}
      </Link>

      <header className="page-hero mt-6">
        <p className="page-kicker">{ti("label")}</p>
        <h1 className="page-title">{HR_CATEGORY.title[loc]}</h1>
        <p className="page-sub">{t("categoryHint")}</p>
        <hr className="page-hero-rule" />
      </header>

      <div className="mt-10 journey-grid">
        {tracks.map((track, i) => {
          const q = getHrInterviewQuestionCount(track.slug);
          return (
            <Reveal key={track.slug} delay={i * 70}>
              <Link
                href={`/interviews/hr/${track.slug}`}
                className="journey-row interview-track-row"
              >
                <span className="journey-row-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="journey-row-body min-w-0">
                  <h2 className="journey-row-title">{track.title[loc]}</h2>
                  <p className="journey-row-meta">{track.tagline[loc]}</p>
                  <p className="journey-row-meta !mt-1 !text-accent">
                    {ti("bankSize", { count: q })}
                  </p>
                </div>
                <span className="btn-primary interview-track-cta shrink-0 self-start sm:self-center">
                  {t("openTrack")}
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
