"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AppFaultScreen } from "@/components/AppFaultScreen";
import { hideNavLoader } from "@/lib/nav-loader";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

function safeDetail(error: Error): string | undefined {
  const msg = (error.message || "").trim();
  if (!msg) return undefined;
  if (/NEXT_REDIRECT|NEXT_NOT_FOUND|digest/i.test(msg)) return undefined;
  if (msg.length > 220) return `${msg.slice(0, 217)}…`;
  return msg;
}

export default function LocaleError({ error, reset }: Props) {
  const t = useTranslations("errors");
  const detail = safeDetail(error);

  useEffect(() => {
    hideNavLoader();
    console.error("[AlefYa page error]", error);
  }, [error]);

  return (
    <AppFaultScreen
      brand={t("kicker")}
      status={t("status")}
      title={t("title")}
      body={t("body")}
      detail={detail}
      detailLabel={t("detail")}
      digest={error.digest}
      digestLabel={t("ref")}
      tone="fault"
      actions={
        <>
          <button type="button" className="btn-primary" onClick={reset}>
            {t("retry")}
          </button>
          <Link href="/" className="btn-ghost">
            {t("home")}
          </Link>
          <Link href="/categories" className="btn-ghost">
            {t("categories")}
          </Link>
        </>
      }
    />
  );
}
