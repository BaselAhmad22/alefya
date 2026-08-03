"use client";

import { useLocale, useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import { Link, usePathname } from "@/i18n/routing";
import { BrandLogo } from "@/components/BrandLogo";

const navLink =
  "inline-flex h-9 items-center rounded-[var(--radius)] px-3 text-[0.9375rem] font-medium leading-none text-ink-muted transition-all duration-200 hover:bg-bg-soft hover:text-ink";

export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const { data: session } = useSession();
  const otherLocale = locale === "ar" ? "en" : "ar";

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <BrandLogo
            size={40}
            priority
            className="border border-line transition-transform duration-300 group-hover:rotate-[-3deg] group-hover:border-teal/50"
          />
          <span className="leading-none">
            <span
              className="font-brand block text-xl text-ink transition-colors group-hover:text-teal"
              lang="ar"
            >
              ألف ياء
            </span>
            <span className="mt-1 block text-xs tracking-wide text-ink-muted">
              AlefYa
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link href="/start" className={navLink}>
            {t("start")}
          </Link>
          <Link href="/categories" className={navLink}>
            {t("categories")}
          </Link>
          <Link href="/tracks" className={navLink}>
            {t("tracks")}
          </Link>
          {session?.user ? (
            <>
              <Link href="/dashboard" className={navLink}>
                {t("dashboard")}
              </Link>
              <button type="button" onClick={() => signOut({ callbackUrl: `/${locale}` })} className={navLink}>
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={navLink}>
                {t("login")}
              </Link>
              <Link
                href="/register"
                className="btn-primary ms-1 inline-flex h-9 items-center px-3.5 text-[0.9375rem]"
              >
                {t("register")}
              </Link>
            </>
          )}
          <Link
            href={pathname || "/"}
            locale={otherLocale}
            className="ms-1.5 inline-flex h-9 min-w-9 items-center justify-center rounded-[var(--radius)] border border-line px-3 text-[0.8125rem] font-semibold tracking-wide text-ink-muted transition-all duration-200 hover:border-accent hover:text-accent"
          >
            {otherLocale.toUpperCase()}
          </Link>
        </nav>
      </div>
      <div className="accent-rule opacity-70" />
    </header>
  );
}
