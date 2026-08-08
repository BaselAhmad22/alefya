import { getTranslations, setRequestLocale } from "next-intl/server";
import type { CSSProperties } from "react";
import { Link } from "@/i18n/routing";
import { getAllCategories } from "@/lib/categories";
import { trackExists, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/Reveal";
import { BrandLogo } from "@/components/BrandLogo";
import { HomeCinema } from "@/components/HomeCinema";
import { HomePrefetch } from "@/components/HomePrefetch";
import { HomeCtas } from "@/components/HomeCtas";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("categories");
  const categories = getAllCategories();
  const loc = locale as Locale;
  const liveCategories = categories.filter(
    (c) => c.trackSlugs.filter((s) => trackExists(s)).length > 0,
  );
  const featured = (liveCategories.length ? liveCategories : categories).slice(
    0,
    6,
  );

  return (
    <HomeCinema>
      <HomePrefetch />

      {/* —— HERO —— */}
      <section className="ay-hero">
        <div className="ay-hero-void" aria-hidden>
          <span className="ay-hero-orb ay-hero-orb-a" data-parallax="18" />
          <span className="ay-hero-orb ay-hero-orb-b" data-parallax="10" />
          <span className="ay-hero-orb ay-hero-orb-c" data-parallax="26" />
          <span className="ay-hero-grid" data-parallax="6" />
          <span className="ay-hero-scan" />
        </div>

        <div className="page-container ay-hero-inner">
          <div className="ay-hero-copy">
            <span className="ay-hero-watermark" aria-hidden data-parallax="8">
              {loc === "ar" ? "أ" : "A"}
            </span>

            <div className="home-cinema-line ay-hero-kicker">
              <BrandLogo
                size={64}
                priority
                className="ay-hero-logo border border-accent/40"
              />
              <span>Alef → Ya</span>
            </div>

            <p
              className={`home-cinema-title ay-hero-brand font-brand ${
                loc === "ar"
                  ? "is-ar"
                  : "font-[family-name:var(--font-display)] is-en"
              }`}
            >
              {t("brand")}
            </p>

            <div className="home-cinema-line ay-hero-rule" aria-hidden />

            <h1 className="home-cinema-line home-cinema-headline ay-hero-headline">
              {t("headline")}
            </h1>
            <p className="home-cinema-line home-cinema-sub ay-hero-sub">
              {t("sub")}
            </p>

            <div className="home-cinema-line home-cinema-cta ay-hero-actions">
              <HomeCtas />
            </div>
          </div>

          <aside className="ay-hero-stage home-cinema-panel" aria-hidden={false}>
            <div className="ay-hero-stage-frame">
              <div className="ay-hero-stage-meta">
                <span>{tc("label")}</span>
                <span className="ay-dot" />
                <span>{featured.length}</span>
              </div>
              <ol className="ay-hero-stage-list">
                {featured.slice(0, 5).map((cat, i) => {
                  const count = cat.trackSlugs.filter((s) =>
                    trackExists(s),
                  ).length;
                  return (
                    <li
                      key={cat.slug}
                      className="home-cinema-cat-row"
                      style={{ ["--i" as string]: i }}
                    >
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="ay-hero-stage-link"
                      >
                        <span className="ay-hero-stage-idx">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="ay-hero-stage-body">
                          <strong>{tl(cat.title, loc)}</strong>
                          <em>
                            {count > 0
                              ? `${count} ${tc("tracksCount")}`
                              : tc("comingSoon")}
                          </em>
                        </span>
                        <span className="ay-hero-stage-go" aria-hidden>
                          →
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>
        </div>

        <div className="ay-scroll-cue" aria-hidden>
          <span>{t("scrollCue")}</span>
          <i />
        </div>
      </section>

      {/* —— MANIFESTO —— */}
      <section className="ay-manifest">
        <div className="page-container">
          <Reveal>
            <p className="ay-section-kicker">{t("manifestKicker")}</p>
            <h2 className="ay-manifest-title">{t("manifestTitle")}</h2>
            <p className="ay-manifest-body">{t("manifestBody")}</p>
          </Reveal>
        </div>
      </section>

      {/* —— FEATURED WORK (Lusion-style rows) —— */}
      <section className="ay-featured">
        <div className="page-container">
          <Reveal>
            <header className="ay-featured-head">
              <div>
                <p className="ay-section-kicker">{t("featuredKicker")}</p>
                <h2 className="ay-featured-title">{t("featuredTitle")}</h2>
              </div>
              <Link href="/categories" className="ay-text-link ay-magnetic">
                {t("featuredSeeAll")}
              </Link>
            </header>
          </Reveal>

          <div className="ay-feature-list">
            {featured.map((cat, i) => {
              const count = cat.trackSlugs.filter((s) => trackExists(s)).length;
              return (
                <Reveal key={cat.slug} delay={i * 60}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="ay-feature-row"
                    style={
                      {
                        ["--card-accent"]: cat.color || "var(--teal)",
                        ["--i" as string]: i,
                      } as CSSProperties
                    }
                  >
                    <span className="ay-feature-idx">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="ay-feature-copy">
                      <strong>{tl(cat.title, loc)}</strong>
                      <em className={loc === "ar" ? "leading-[1.7]" : ""}>
                        {tl(cat.description, loc)}
                      </em>
                    </span>
                    <span className="ay-feature-meta">
                      {count > 0
                        ? `${count} ${tc("tracksCount")}`
                        : tc("comingSoon")}
                    </span>
                    <span className="ay-feature-arrow" aria-hidden>
                      →
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* —— INTERVIEWS —— */}
      <section className="home-interview ay-interview">
        <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-gutter)] py-16 sm:py-24">
          <Reveal className="home-interview-reveal">
            <div className="home-interview-panel ay-interview-panel">
              <div className="home-interview-glow" aria-hidden />
              <div className="home-interview-copy">
                <p className="ay-section-kicker">{t("ctaInterviews")}</p>
                <h2 className="home-interview-title home-interview-anim">
                  {t("interviewsTitle")}
                </h2>
                <p className="home-interview-sub home-interview-anim">
                  {t("interviewsSub")}
                </p>
                <div className="home-interview-actions home-interview-anim">
                  <Link
                    href="/interviews"
                    className="btn-primary home-interview-btn ay-magnetic"
                  >
                    {t("interviewsCta")}
                  </Link>
                  <Link
                    href="/categories"
                    className="btn-ghost home-interview-btn ay-magnetic"
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

      {/* —— FINALE —— */}
      <section className="ay-finale">
        <div className="page-container ay-finale-inner">
          <Reveal>
            <h2 className="ay-finale-title">{t("finaleTitle")}</h2>
            <p className="ay-finale-sub">{t("finaleSub")}</p>
            <HomeCtas compact />
          </Reveal>
        </div>
      </section>
    </HomeCinema>
  );
}
