import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/BrandLogo";

export async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-line py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 text-sm text-ink-muted sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-3">
          <BrandLogo size={32} className="border border-line" />
          <p>{t("tagline")}</p>
        </div>
        <p className="font-[family-name:var(--font-display)] text-base text-ink/70">
          أ ← ي
        </p>
      </div>
    </footer>
  );
}
