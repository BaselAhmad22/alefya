import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getLesson, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import type { Metadata } from "next";

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
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-accent">AlefYa</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl">
        {tl(lesson.title, loc)}
      </h1>
      <p className="mt-2 text-ink-muted">{tl(track.title, loc)}</p>
      <p className="mt-6 text-lg leading-relaxed text-ink-muted">
        {tl(lesson.summary, loc)}
      </p>
      <Link
        href={`/learn/${trackSlug}/${lessonSlug}`}
        className="btn-primary mt-8 inline-flex"
      >
        {t("share")} →
      </Link>
    </div>
  );
}
