import { Suspense } from "react";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
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

  return (
    <div className="messages-app">
      <Suspense
        fallback={
          <div className="messages-app-loading">
            <PageLoader />
          </div>
        }
      >
        <MessagesClient />
      </Suspense>
    </div>
  );
}
