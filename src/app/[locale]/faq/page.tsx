import { getTranslations, setRequestLocale } from "next-intl/server";
import { FaqPageClient } from "@/components/FaqPageClient";

type Props = { params: Promise<{ locale: string }> };

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="faq-page-header">
        <p className="faq-kicker">AlefYa</p>
        <h1 className="faq-page-title">{t("title")}</h1>
        <p className="faq-page-sub">{t("subtitle")}</p>
      </header>
      <FaqPageClient />
    </main>
  );
}
