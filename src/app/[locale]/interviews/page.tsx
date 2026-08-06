import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllCategories } from "@/lib/categories";
import { trackExists, t as tl } from "@/lib/content";
import { getInterviewQuestionCount } from "@/lib/interview-counts";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/routing";
import { Reveal } from "@/components/Reveal";

type Props = { params: Promise<{ locale: string }> };

export default async function InterviewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("interviews");
  const categories = getAllCategories();
  const loc = locale as Locale;

  return (
    <div className="interview-hub mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="animate-rise max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-accent">
          {t("label")}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-muted">
          {t("subtitle")}
        </p>
        <div className="accent-rule mt-6 max-w-xs" />
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {categories.map((cat, i) => {
          const tracks = cat.trackSlugs.filter((s) => trackExists(s));
          const qCount = tracks.reduce(
            (sum, s) => sum + getInterviewQuestionCount(s),
            0,
          );
          return (
            <Reveal key={cat.slug} delay={i * 60}>
              <Link
                href={`/interviews/${cat.slug}`}
                className="interview-cat-card surface-panel block p-6"
              >
                <p className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl">
                  {tl(cat.title, loc)}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {tl(cat.description, loc)}
                </p>
                <p className="mt-5 text-sm text-accent">
                  {t("catMeta", {
                    tracks: tracks.length,
                    questions: qCount,
                  })}
                </p>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
