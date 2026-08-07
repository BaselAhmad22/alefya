import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getHrInterviewQuestionCount } from "@/lib/interview-counts";
import { getHrTrack } from "@/lib/hr-tracks";
import type { Locale } from "@/i18n/config";
import { HrStudyClient } from "@/components/HrStudyClient";

type Props = { params: Promise<{ locale: string; track: string }> };

export default async function HrStudyPage({ params }: Props) {
  const { locale, track: trackSlug } = await params;
  setRequestLocale(locale);
  const track = getHrTrack(trackSlug);
  const bankSize = getHrInterviewQuestionCount(trackSlug);
  if (!track || bankSize === 0) notFound();

  return (
    <HrStudyClient
      trackSlug={track.slug}
      trackTitle={track.title[locale as Locale]}
      bankSize={bankSize}
    />
  );
}
