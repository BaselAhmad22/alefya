"use client";

import { useEffect } from "react";
import "./globals.css";
import { BrandLogo } from "@/components/BrandLogo";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[AlefYa global error]", error);
    try {
      document.documentElement.classList.remove("is-page-loading");
      const overlay = document.getElementById("alefya-nav-loader");
      if (overlay) {
        overlay.hidden = true;
        (overlay as HTMLElement).style.display = "none";
      }
      const bar = document.getElementById("alefya-nav-bar");
      bar?.classList.remove("is-on");
    } catch {
      /* ignore */
    }
  }, [error]);

  const isAr =
    typeof document !== "undefined" &&
    (document.documentElement.lang || "").startsWith("ar");

  const copy = isAr
    ? {
        brand: "AlefYa",
        status: "توقّف مؤقت",
        title: "حدث خطأ غير متوقع",
        body: "الموقع ما علّق. جرّب إعادة المحاولة، أو ارجع للرئيسية وكمل من هناك.",
        retry: "إعادة المحاولة",
        home: "الرئيسية",
        ref: "مرجع",
      }
    : {
        brand: "AlefYa",
        status: "Temporary interruption",
        title: "Something went wrong",
        body: "The site isn’t frozen. Try again, or go home and continue from there.",
        retry: "Try again",
        home: "Home",
        ref: "Reference",
      };

  return (
    <html lang={isAr ? "ar" : "en"} dir={isAr ? "rtl" : "ltr"}>
      <body className="ay-global-error-body">
        <div className="ay-error-page ay-error-page--fault ay-error-page--standalone">
          <div className="ay-error-ambient" aria-hidden>
            <span className="ay-error-orb ay-error-orb--a" />
            <span className="ay-error-orb ay-error-orb--b" />
            <span className="ay-error-grid" />
          </div>

          <div className="ay-error-shell" role="alert">
            <header className="ay-error-brand">
              <BrandLogo size={48} className="ay-error-logo border border-line" />
              <div className="ay-error-brand-copy">
                <p className="ay-error-brand-name font-brand" lang="ar">
                  ألف ياء
                </p>
                <p className="ay-error-brand-en">{copy.brand}</p>
              </div>
            </header>

            <div className="ay-error-main">
              <span className="ay-error-mark" aria-hidden>
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <circle
                    cx="22"
                    cy="22"
                    r="20"
                    stroke="currentColor"
                    strokeOpacity="0.22"
                    strokeWidth="1.25"
                  />
                  <path
                    d="M12 22.5c3.2-6.2 7-9.3 10-9.3 2.2 0 4.1 1.4 5.6 3.6"
                    stroke="var(--accent)"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeDasharray="2.4 3.2"
                  />
                  <path
                    d="M28.5 22.5c-1.1 4.4-3.6 8.3-6.5 8.3-2.6 0-5-2.2-7.1-5.6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    opacity="0.55"
                  />
                  <circle cx="22" cy="22.5" r="2.35" fill="var(--accent)" />
                </svg>
              </span>
              <p className="ay-error-status">{copy.status}</p>
              <h1 className="ay-error-title">{copy.title}</h1>
              <p className="ay-error-body">{copy.body}</p>
              <div className="ay-error-actions">
                <button type="button" className="btn-primary" onClick={reset}>
                  {copy.retry}
                </button>
                <a href="/" className="btn-ghost">
                  {copy.home}
                </a>
              </div>
            </div>

            {error.digest ? (
              <p className="ay-error-digest">
                <span>{copy.ref}</span>
                <code>{error.digest}</code>
              </p>
            ) : null}
          </div>
        </div>
      </body>
    </html>
  );
}
