import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getCategory } from "@/lib/categories";
import { getTrack, t as tl } from "@/lib/content";
import { getInterviewQuestionCount } from "@/lib/interview-counts";
import type { Locale } from "@/i18n/config";
import { InterviewSessionClient } from "@/components/InterviewSessionClient";

type Props = {
  params: Promise<{ locale: string; category: string; track: string }>;
};

export default async function InterviewSessionPage({ params }: Props) {
  const { locale, category: categorySlug, track: trackSlug } = await params;
  setRequestLocale(locale);
  const category = getCategory(categorySlug);
  const track = getTrack(trackSlug);
  if (!category || !track || !category.trackSlugs.includes(trackSlug)) {
    notFound();
  }
  const bankSize = getInterviewQuestionCount(trackSlug);
  if (bankSize === 0) notFound();

  return (
    <InterviewSessionClient
      trackSlug={track.slug}
      trackTitle={tl(track.title, locale as Locale)}
      categorySlug={categorySlug}
      bankSize={bankSize}
    />
  );
}
