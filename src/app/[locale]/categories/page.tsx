import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllCategories } from "@/lib/categories";
import { trackExists, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import { CategoriesFilters } from "@/components/CatalogFilters";

type Props = { params: Promise<{ locale: string }> };

export default async function CategoriesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("categories");
  const categories = getAllCategories();
  const loc = locale as Locale;

  const cards = categories.map((cat) => {
    const count = cat.trackSlugs.filter((s) => trackExists(s)).length;
    return {
      slug: cat.slug,
      title: tl(cat.title, loc),
      description: tl(cat.description, loc),
      trackCount: count,
      href: `/${locale}/categories/${cat.slug}`,
      tracksLabel: t("tracksCount"),
      comingSoon: t("comingSoon"),
    };
  });

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

      <CategoriesFilters
        cards={cards}
        labels={{
          search: t("filterSearch"),
          availability: t("filterAvailability"),
          all: t("filterAll"),
          withTracks: t("filterWithTracks"),
          comingSoon: t("comingSoon"),
          emptyFiltered: t("emptyFiltered"),
          clear: t("filterClear"),
        }}
      />
    </div>
  );
}
