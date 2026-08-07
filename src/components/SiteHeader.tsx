"use client";

import { signOut, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { BrandLogo } from "@/components/BrandLogo";
import { NotificationsBell } from "@/components/NotificationsBell";
import { FriendsNavLink } from "@/components/FriendsNavLink";
import { MessagesNavLink } from "@/components/MessagesNavLink";

export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const { data: session } = useSession();
  const otherLocale = locale === "ar" ? "en" : "ar";

  function navClass(base: string, href: string) {
    const active =
      pathname === href ||
      (href !== "/" && Boolean(pathname?.startsWith(`${href}/`)));
    return `${base}${active ? " is-active" : ""}`;
  }

  return (
    <header className="site-header sticky top-0 z-40">
      <div className="site-header-inner page-container flex h-[4.25rem] items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3.5">
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

          {session?.user ? (
            <>
              <span className="notif-brand-sep" aria-hidden />
              <div className="site-nav-social">
                <NotificationsBell />
                <MessagesNavLink />
                <FriendsNavLink />
              </div>
            </>
          ) : null}
        </div>

        <nav className="flex items-center gap-0.5 sm:gap-1">
          <div className="site-nav-learn hidden items-center gap-0.5 sm:flex">
            <Link href="/start" className={navClass("site-nav-link is-learn", "/start")}>
              {t("start")}
            </Link>
            <Link
              href="/categories"
              className={navClass("site-nav-link is-learn", "/categories")}
            >
              {t("categories")}
            </Link>
            <Link href="/tracks" className={navClass("site-nav-link is-learn", "/tracks")}>
              {t("tracks")}
            </Link>
            <Link
              href="/interviews"
              className={navClass("site-nav-link is-learn", "/interviews")}
            >
              {t("interviews")}
            </Link>
          </div>

          {session?.user ? (
            <>
              <span className="site-nav-sep hidden sm:block" aria-hidden />
              <Link
                href="/dashboard"
                className={navClass("site-nav-link is-account", "/dashboard")}
              >
                {t("dashboard")}
              </Link>
              <Link
                href="/profile"
                className={navClass("site-nav-link is-account", "/profile")}
              >
                {t("profile")}
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: `/${locale}` })}
                className="site-nav-link is-account"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={navClass("site-nav-link is-account", "/login")}>
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
            className="site-nav-locale ms-1.5"
          >
            {otherLocale.toUpperCase()}
          </Link>
        </nav>
      </div>

      {/* Mobile learning links */}
      <div className="site-nav-learn-mobile sm:hidden">
        <Link href="/start" className={navClass("site-nav-link is-learn", "/start")}>
          {t("start")}
        </Link>
        <Link
          href="/categories"
          className={navClass("site-nav-link is-learn", "/categories")}
        >
          {t("categories")}
        </Link>
        <Link href="/tracks" className={navClass("site-nav-link is-learn", "/tracks")}>
          {t("tracks")}
        </Link>
        <Link
          href="/interviews"
          className={navClass("site-nav-link is-learn", "/interviews")}
        >
          {t("interviews")}
        </Link>
      </div>
      <div className="accent-rule opacity-70" />
    </header>
  );
}
