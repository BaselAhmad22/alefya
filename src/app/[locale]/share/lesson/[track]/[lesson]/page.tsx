import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getLesson, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import type { Metadata } from "next";

/** Public share pages — long-lived content cache. */
export const revalidate = 86400;

type Props = {
  params: Promise<{ locale: string; track: string; lesson: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, track: trackSlug, lesson: lessonSlug } = await params;
  const found = getLesson(trackSlug, lessonSlug);
  if (!found) return { title: "AlefYa" };
  const loc = locale as Locale;
  return {
    title: tl(found.lesson.title, loc),
    description: tl(found.lesson.summary, loc),
    openGraph: {
      title: tl(found.lesson.title, loc),
      description: tl(found.lesson.summary, loc),
      type: "article",
    },
  };
}

export default async function ShareLessonPage({ params }: Props) {
  const { locale, track: trackSlug, lesson: lessonSlug } = await params;
  setRequestLocale(locale);
  const found = getLesson(trackSlug, lessonSlug);
  if (!found) notFound();
  const loc = locale as Locale;
  const t = await getTranslations("social");
  const { track, lesson } = found;

  return (
    <div className="ay-page share-lesson-page">
      <div className="ay-page-ambient" aria-hidden />
      <header className="page-hero">
        <p className="page-kicker">AlefYa</p>
        <h1 className="page-title">{tl(lesson.title, loc)}</h1>
        <p className="page-sub">{tl(track.title, loc)}</p>
        <hr className="page-hero-rule" />
      </header>
      <div className="share-lesson-card surface-panel">
        <p className="share-lesson-summary">{tl(lesson.summary, loc)}</p>
        <Link
          href={`/learn/${trackSlug}/${lessonSlug}`}
          className="btn-primary share-lesson-cta"
        >
          {t("share")} →
        </Link>
      </div>
    </div>
  );
}
