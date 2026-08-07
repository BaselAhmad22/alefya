import { getTranslations, setRequestLocale } from "next-intl/server";
import type { CSSProperties } from "react";
import { Link } from "@/i18n/routing";
import { getAllCategories } from "@/lib/categories";
import { trackExists, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/Reveal";
import { BrandLogo } from "@/components/BrandLogo";
import { auth } from "@/lib/auth";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("categories");
  const categories = getAllCategories();
  const loc = locale as Locale;
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);

  return (
    <div>
      <section className="home-hero relative border-b border-line/80">
        <div className="home-hero-glow home-hero-glow-a" aria-hidden />
        <div className="home-hero-glow home-hero-glow-b" aria-hidden />

        <div className="page-container relative grid min-h-[86vh] items-center gap-12 py-20 lg:grid-cols-[1.12fr_0.88fr]">
          <div>
            <div className="animate-rise mb-6 inline-flex items-center gap-4">
              <BrandLogo
                size={76}
                priority
                className="border border-accent/35 shadow-[0_0_48px_rgba(232,165,75,0.22)]"
              />
              <span className="hidden text-xs tracking-[0.18em] text-ink-muted uppercase sm:block">
                Alef → Ya
              </span>
            </div>
            <p
              className={`animate-clip font-brand text-accent ${
                loc === "ar"
                  ? "text-[clamp(3.4rem,11vw,6.75rem)] leading-[1.05]"
                  : "font-[family-name:var(--font-display)] text-[clamp(4.75rem,14vw,9.75rem)] leading-[0.84] tracking-tight"
              }`}
            >
              {t("brand")}
            </p>
            <div className="mt-3 h-px w-28 origin-start bg-gradient-to-r from-teal-bright via-accent to-transparent animate-rise-delay" />
            <h1
              className={`animate-rise-delay mt-7 max-w-xl font-medium text-ink-heading ${
                loc === "ar"
                  ? "text-xl leading-[1.55] sm:text-2xl"
                  : "text-2xl leading-snug sm:text-3xl"
              }`}
            >
              {t("headline")}
            </h1>
            <p
              className={`animate-rise-delay-2 mt-4 max-w-lg text-ink-muted ${
                loc === "ar"
                  ? "text-base leading-[1.75]"
                  : "text-lg leading-relaxed"
              }`}
            >
              {t("sub")}
            </p>
            <div className="animate-rise-delay-3 mt-10 flex flex-wrap items-center gap-2.5">
              <Link href="/start" className="btn-primary">
                {t("ctaStart")}
              </Link>
              <Link href="/categories" className="btn-ghost">
                {t("cta")}
              </Link>
              <Link href="/interviews" className="btn-ghost">
                {t("ctaInterviews")}
              </Link>
              {!isLoggedIn ? (
                <Link href="/register" className="btn-ghost">
                  {t("ctaSecondary")}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="home-cat-preview animate-rise-delay-2 hidden lg:block">
            <div className="surface-panel home-cat-preview-panel p-8">
              <div className="mb-5 flex items-center gap-3">
                <BrandLogo size={44} className="border border-line" />
                <p className="page-kicker" style={{ letterSpacing: "0.14em" }}>
                  {tc("label")}
                </p>
              </div>
              <ol className="mt-6 space-y-4">
                {categories.slice(0, 5).map((cat, i) => (
                  <li
                    key={cat.slug}
                    className="journey-row !grid-cols-[auto_minmax(0,1fr)] !gap-4 !p-3.5"
                  >
                    <span className="journey-row-index">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-[family-name:var(--font-display)] text-xl text-ink-heading">
                        {tl(cat.title, loc)}
                      </p>
                      <p className="text-sm text-ink-muted">
                        {cat.trackSlugs.length > 0
                          ? `${cat.trackSlugs.length} ${tc("tracksCount")}`
                          : tc("comingSoon")}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="home-cat-preview-badge" aria-hidden>
                <BrandLogo size={56} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ay-page">
        <div className="ay-page-ambient" aria-hidden />
        <Reveal>
          <header className="page-hero !mb-8">
            <p className="page-kicker">{tc("label")}</p>
            <h2 className="page-title">{tc("title")}</h2>
            <hr className="page-hero-rule" />
          </header>
        </Reveal>
        <div className="catalog-grid">
          {categories.map((cat, i) => {
            const trackCount = cat.trackSlugs.filter((s) => trackExists(s)).length;
            return (
              <Reveal key={cat.slug} delay={i * 70} className="h-full">
                <Link
                  href={`/categories/${cat.slug}`}
                  className="catalog-card h-full"
                  style={
                    {
                      ["--card-accent"]:
                        i % 3 === 0
                          ? "var(--teal)"
                          : i % 3 === 1
                            ? "var(--accent)"
                            : "#2dd4bf",
                    } as CSSProperties
                  }
                >
                  <p className="catalog-card-meta">
                    {trackCount > 0
                      ? `${trackCount} ${tc("tracksCount")}`
                      : tc("comingSoon")}
                  </p>
                  <h3 className="catalog-card-title">{tl(cat.title, loc)}</h3>
                  <p
                    className={`catalog-card-desc line-clamp-2 ${
                      loc === "ar" ? "leading-[1.7]" : ""
                    }`}
                  >
                    {tl(cat.description, loc)}
                  </p>
                  <span className="catalog-card-go">
                    {tc("title")}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
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
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="home-interview">
        <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-gutter)] py-16 sm:py-20">
          <Reveal className="home-interview-reveal">
            <div className="home-interview-panel">
              <div className="home-interview-glow" aria-hidden />
              <div className="home-interview-copy">
                <h2 className="home-interview-title home-interview-anim">
                  {t("interviewsTitle")}
                </h2>
                <p className="home-interview-sub home-interview-anim">
                  {t("interviewsSub")}
                </p>
                <div className="home-interview-actions home-interview-anim">
                  <Link
                    href="/interviews"
                    className="btn-primary home-interview-btn"
                  >
                    {t("interviewsCta")}
                  </Link>
                  <Link
                    href="/categories"
                    className="btn-ghost home-interview-btn"
                  >
                    {t("cta")}
                  </Link>
                </div>
              </div>
              <ul
                className="home-interview-points home-interview-anim"
                aria-label={t("interviewsTitle")}
              >
                <li style={{ ["--i" as string]: 0 }}>
                  <span className="home-interview-point-mark" aria-hidden />
                  {t("interviewsPoint1")}
                </li>
                <li style={{ ["--i" as string]: 1 }}>
                  <span className="home-interview-point-mark" aria-hidden />
                  {t("interviewsPoint2")}
                </li>
                <li style={{ ["--i" as string]: 2 }}>
                  <span className="home-interview-point-mark" aria-hidden />
                  {t("interviewsPoint3")}
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
