import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getHrInterviewQuestionCount } from "@/lib/interview-counts";
import { getHrTrack } from "@/lib/hr-tracks";
import type { Locale } from "@/i18n/config";
import { InterviewSessionClient } from "@/components/InterviewSessionClient";

type Props = { params: Promise<{ locale: string; track: string }> };

export default async function HrQuizPage({ params }: Props) {
  const { locale, track: trackSlug } = await params;
  setRequestLocale(locale);
  const track = getHrTrack(trackSlug);
  const bankSize = getHrInterviewQuestionCount(trackSlug);
  if (!track || bankSize === 0) notFound();

  return (
    <InterviewSessionClient
      domain="hr"
      trackSlug={track.slug}
      trackTitle={track.title[locale as Locale]}
      categorySlug="hr"
      bankSize={bankSize}
    />
  );
}
