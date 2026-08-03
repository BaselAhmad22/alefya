import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getAllCategories } from "@/lib/categories";
import { getTrack, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/Reveal";

type Props = { params: Promise<{ locale: string }> };

export default async function CategoriesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("categories");
  const categories = getAllCategories();
  const loc = locale as Locale;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="animate-rise max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-accent">AlefYa</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-lg text-ink-muted">{t("subtitle")}</p>
        <div className="accent-rule mt-6 max-w-xs" />
      </div>

      <div className="mt-12 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => {
          const count = cat.trackSlugs.filter((s) => getTrack(s)).length;
          return (
            <Reveal key={cat.slug} delay={i * 60} className="h-full">
              <Link
                href={`/categories/${cat.slug}`}
                className="surface-panel flex h-full min-h-[11.5rem] flex-col p-6"
              >
                <span
                  className="mb-4 block h-1.5 w-12"
                  style={{ background: cat.color }}
                />
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink">
                  {tl(cat.title, loc)}
                </h2>
                <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-ink-muted">
                  {tl(cat.description, loc)}
                </p>
                <p className="mt-auto pt-4 text-xs uppercase tracking-wider text-accent">
                  {count > 0 ? `${count} ${t("tracksCount")}` : t("comingSoon")}
                </p>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
