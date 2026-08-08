"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function HomeCtas({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("home");
  const { data: session } = useSession();
  const loggedIn = Boolean(session?.user);

  return (
    <div className={`ay-cta-row ${compact ? "is-compact" : ""}`}>
      <Link href="/start" className="btn-primary ay-magnetic home-cinema-btn">
        <span>{t("ctaStart")}</span>
      </Link>
      <Link href="/categories" className="btn-ghost ay-magnetic home-cinema-btn">
        <span>{t("cta")}</span>
      </Link>
      {!compact ? (
        <>
          <Link
            href="/interviews"
            className="btn-ghost ay-magnetic home-cinema-btn"
          >
            <span>{t("ctaInterviews")}</span>
          </Link>
          {!loggedIn ? (
            <Link
              href="/register"
              className="btn-ghost ay-magnetic home-cinema-btn"
            >
              <span>{t("ctaSecondary")}</span>
            </Link>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
