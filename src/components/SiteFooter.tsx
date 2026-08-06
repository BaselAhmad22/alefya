import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { BrandLogo } from "@/components/BrandLogo";

export async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="site-footer border-t border-line/70 py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-4 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <BrandLogo
            size={32}
            className="border border-line transition-transform duration-300 group-hover:rotate-[-3deg] group-hover:border-teal/50"
          />
          <span className="transition-colors group-hover:text-teal">
            {t("tagline")}
          </span>
        </Link>

        <Link href="/faq" className="footer-faq-link">
          <span className="footer-faq-ico" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle
                cx="8"
                cy="8"
                r="6.25"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M6.35 6.2a1.65 1.65 0 0 1 3.2.7c0 .95-.85 1.3-1.35 1.65-.3.2-.5.45-.5.85"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <circle cx="8" cy="11.35" r="0.7" fill="currentColor" />
            </svg>
          </span>
          <span className="footer-faq-copy">
            <span className="footer-faq-label">{t("faq")}</span>
            <span className="footer-faq-hint">{t("faqHint")}</span>
          </span>
          <span className="footer-faq-shine" aria-hidden />
          <span className="footer-faq-arrow" aria-hidden>
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      </div>
    </footer>
  );
}
