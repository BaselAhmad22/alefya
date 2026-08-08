import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { AppFaultScreen } from "@/components/AppFaultScreen";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "errors" });

  return (
    <AppFaultScreen
      brand={t("kicker")}
      status={t("notFoundStatus")}
      title={t("notFoundTitle")}
      body={t("notFoundBody")}
      tone="missing"
      actions={
        <>
          <Link href="/" className="btn-primary">
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
