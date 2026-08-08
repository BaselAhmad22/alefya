import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllCategories } from "@/lib/categories";
import { trackExists, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import { CategoriesFilters } from "@/components/CatalogFilters";

/** Public catalog — rebuild at most once per hour. */
export const revalidate = 3600;

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
      color: cat.color || "#14b8a6",
      href: `/${locale}/categories/${cat.slug}`,
      tracksLabel: t("tracksCount"),
      comingSoon: t("comingSoon"),
    };
  });

  return (
    <div className="ay-page categories-index-page">
      <div className="ay-page-ambient categories-index-ambient" aria-hidden />

      <header className="page-hero categories-index-hero">
        <p className="page-kicker">AlefYa</p>
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-sub">{t("subtitle")}</p>
        <hr className="page-hero-rule" />
      </header>

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
