import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SessionProvider } from "@/components/SessionProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteFooterGate } from "@/components/SiteFooterGate";
import { PageTransition } from "@/components/PageTransition";
import { NavigationProgress } from "@/components/NavigationProgress";
import { LazyMessenger } from "@/components/LazyMessenger";
import { ToastProvider } from "@/components/ToastProvider";
import { GlobalErrorWatcher } from "@/components/GlobalErrorWatcher";
import { LusionIntro } from "@/components/LusionIntro";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <NextIntlClientProvider messages={messages}>
      <SessionProvider>
        <ToastProvider>
          <GlobalErrorWatcher />
          <div
            lang={locale}
            dir={dir}
            className="flex min-h-screen flex-col"
            style={
              {
                /* AR UI: Noto Sans for clean headings; Naskh reserved for .font-brand */
                "--font-display":
                  locale === "ar"
                    ? "var(--font-body-arabic), var(--font-display-arabic)"
                    : "var(--font-display-latin), var(--font-display-arabic)",
                "--font-body":
                  locale === "ar"
                    ? "var(--font-body-arabic), var(--font-body-latin)"
                    : "var(--font-body-latin), var(--font-body-arabic)",
                fontFamily: "var(--font-body), system-ui, sans-serif",
              } as React.CSSProperties
            }
          >
            <NavigationProgress />
            <LusionIntro />
            <SiteHeader />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <SiteFooterGate>
              <SiteFooter />
            </SiteFooterGate>
            <LazyMessenger />
          </div>
        </ToastProvider>
      </SessionProvider>
    </NextIntlClientProvider>
  );
}
