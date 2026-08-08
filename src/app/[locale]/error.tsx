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

export default function LocaleError({ error, reset }: Props) {
  const t = useTranslations("errors");

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
        </>
      }
    />
  );
}
