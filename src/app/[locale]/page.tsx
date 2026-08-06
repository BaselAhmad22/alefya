import { getTranslations, setRequestLocale } from "next-intl/server";
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
      <section className="relative overflow-hidden border-b border-line">
        <div
          className="pointer-events-none absolute -start-24 top-16 h-72 w-72 rounded-full opacity-30 blur-3xl animate-float"
          style={{ background: "rgba(232,165,75,0.25)" }}
        />
        <div
          className="pointer-events-none absolute -end-16 bottom-10 h-64 w-64 rounded-full opacity-25 blur-3xl animate-float"
          style={{ background: "rgba(61,186,156,0.2)", animationDelay: "1.2s" }}
        />

        <div className="relative mx-auto grid min-h-[82vh] max-w-6xl items-center gap-10 px-4 py-20 lg:grid-cols-[1.15fr_0.85fr] sm:px-6">
          <div>
            <div className="animate-rise mb-6 inline-flex items-center gap-4">
              <BrandLogo
                size={72}
                priority
                className="border border-accent/30 shadow-[0_0_40px_rgba(232,165,75,0.18)]"
              />
              <span className="hidden text-xs text-ink-muted sm:block">
                Alef → Ya
              </span>
            </div>
            <p
              className={`animate-clip font-brand text-accent ${
                loc === "ar"
                  ? "text-[clamp(3.25rem,11vw,6.5rem)] leading-[1.05]"
                  : "font-[family-name:var(--font-display)] text-[clamp(4.5rem,14vw,9.5rem)] leading-[0.85] tracking-tight"
              }`}
            >
              {t("brand")}
            </p>
            <div className="mt-3 h-px w-24 origin-start bg-teal animate-rise-delay" />
            <h1
              className={`animate-rise-delay mt-7 max-w-xl font-medium text-ink ${
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

          <div className="animate-rise-delay-2 relative hidden lg:block">
            <div className="surface-panel relative p-8">
              <div className="mb-5 flex items-center gap-3">
                <BrandLogo size={44} className="border border-line" />
                  <p className="text-xs text-ink-muted">
                    {tc("label")}
                  </p>
              </div>
              <ol className="mt-6 space-y-4">
                {categories.slice(0, 5).map((cat, i) => (
                  <li key={cat.slug} className="flex items-start gap-4">
                    <span className="font-mono text-sm text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-[family-name:var(--font-display)] text-xl">
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
              <div className="pointer-events-none absolute -bottom-3 -end-3 border border-accent/40 bg-bg p-1 shadow-lg">
                <BrandLogo size={56} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink sm:text-4xl">
            {tc("title")}
          </h2>
        </Reveal>
        <div className="mt-8 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => {
            const trackCount = cat.trackSlugs.filter((s) => trackExists(s)).length;
            return (
              <Reveal key={cat.slug} delay={i * 70} className="h-full">
                <Link
                  href={`/categories/${cat.slug}`}
                  className="surface-panel group relative flex h-full min-h-[11.5rem] flex-col overflow-hidden p-6 transition hover:border-teal/40"
                >
                  <p className="text-xs text-ink-muted">
                    {trackCount > 0
                      ? `${trackCount} ${tc("tracksCount")}`
                      : tc("comingSoon")}
                  </p>
                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-ink transition-colors group-hover:text-accent">
                    {tl(cat.title, loc)}
                  </h3>
                  <p
                    className={`mt-2 line-clamp-2 min-h-[2.75rem] text-sm text-ink-muted ${
                      loc === "ar" ? "leading-[1.7]" : "leading-relaxed"
                    }`}
                  >
                    {tl(cat.description, loc)}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="home-interview">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
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
