import { getTranslations, setRequestLocale } from "next-intl/server";
import { FaqPageClient } from "@/components/FaqPageClient";

type Props = { params: Promise<{ locale: string }> };

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  return (
    <main className="ay-page">
      <div className="ay-page-ambient" aria-hidden />

      <header className="page-hero">
        <p className="page-kicker">AlefYa</p>
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-sub">{t("subtitle")}</p>
        <hr className="page-hero-rule" />
      </header>

      <FaqPageClient />
    </main>
  );
}
