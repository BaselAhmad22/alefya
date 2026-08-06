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
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          AlefYa
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-2 text-ink-muted">{t("pageSubtitle")}</p>
      </header>
      <Suspense
        fallback={
          <div className="flex justify-center py-16">
            <PageLoader />
          </div>
        }
      >
        <FriendsClient />
      </Suspense>
    </main>
  );
}
