import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { FriendsClient } from "@/components/FriendsClient";
import { PageLoader } from "@/components/PageLoader";

type Props = { params: Promise<{ locale: string }> };

export default async function FriendsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  if (!session?.user?.id) {
    redirect(
      `/${locale}/login?next=${encodeURIComponent(`/${locale}/friends`)}`,
    );
  }
  const t = await getTranslations("friends");

  return (
    <main className="ay-page friends-page">
      <div className="ay-page-ambient" aria-hidden />
      <header className="page-hero friends-page-hero">
        <p className="page-kicker">AlefYa</p>
        <h1 className="page-title">{t("pageTitle")}</h1>
        <p className="page-sub">{t("pageSubtitle")}</p>
        <hr className="page-hero-rule" />
      </header>
      <Suspense
        fallback={
          <div className="friends-loading">
            <PageLoader />
          </div>
        }
      >
        <FriendsClient />
      </Suspense>
    </main>
  );
}
