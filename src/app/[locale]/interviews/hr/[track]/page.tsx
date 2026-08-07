import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getHrInterviewQuestionCount } from "@/lib/interview-counts";
import { getAllHrTracks, getHrTrack } from "@/lib/hr-tracks";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/Reveal";

type Props = { params: Promise<{ locale: string; track: string }> };

export default async function HrTrackHubPage({ params }: Props) {
  const { locale, track: trackSlug } = await params;
  setRequestLocale(locale);
  const track = getHrTrack(trackSlug);
  if (!track || getHrInterviewQuestionCount(trackSlug) === 0) notFound();

  const t = await getTranslations("hrInterviews");
  const ti = await getTranslations("interviews");
  const loc = locale as Locale;
  const bankSize = getHrInterviewQuestionCount(trackSlug);
  const trackIndex = getAllHrTracks().findIndex((tr) => tr.slug === trackSlug);

  return (
    <div className="ay-page interview-hub">
      <div className="ay-page-ambient" aria-hidden />

      <Link
        href="/interviews/hr"
        className="exam-back-link"
      >
        <span className="exam-back-chip rtl:rotate-180" aria-hidden>
          ←
        </span>
        {t("backHrCategory")}
      </Link>

      <header className="page-hero mt-6">
        <p className="page-kicker">
          {String(trackIndex + 1).padStart(2, "0")} · {t("trackLabel")}
        </p>
        <h1 className="page-title">{track.title[loc]}</h1>
        <p className="page-sub">{track.description[loc]}</p>
        <p className="mt-2 text-sm text-accent">
          {ti("bankSize", { count: bankSize })}
        </p>
        <hr className="page-hero-rule" />
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Reveal delay={0}>
          <Link
            href={`/interviews/hr/${trackSlug}/quiz`}
            className="hr-mode-card group"
          >
            <p className="hr-mode-card-kicker">{t("quizModeKicker")}</p>
            <h2 className="hr-mode-card-title">{t("quizModeTitle")}</h2>
            <p className="hr-mode-card-desc">{t("quizModeDesc")}</p>
            <span className="btn-primary mt-6 inline-flex">{t("startQuiz")}</span>
          </Link>
        </Reveal>
        <Reveal delay={80}>
          <Link
            href={`/interviews/hr/${trackSlug}/study`}
            className="hr-mode-card group is-study"
          >
            <p className="hr-mode-card-kicker">{t("studyModeKicker")}</p>
            <h2 className="hr-mode-card-title">{t("studyModeTitle")}</h2>
            <p className="hr-mode-card-desc">{t("studyModeDesc")}</p>
            <span className="btn-ghost mt-6 inline-flex border border-line">
              {t("openStudy")}
            </span>
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
