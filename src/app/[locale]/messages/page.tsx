import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { MessagesClient } from "@/components/MessagesClient";
import { PageLoader } from "@/components/PageLoader";

type Props = { params: Promise<{ locale: string }> };

export default async function MessagesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/${locale}/login?next=${encodeURIComponent(`/${locale}/messages`)}`);
  }
  const t = await getTranslations("messages");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-4">
        <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted">{t("subtitle")}</p>
      </header>
      <Suspense
        fallback={
          <div className="flex justify-center py-16">
            <PageLoader />
          </div>
        }
      >
        <MessagesClient />
      </Suspense>
    </div>
  );
}
