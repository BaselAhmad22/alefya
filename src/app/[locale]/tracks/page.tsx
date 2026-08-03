import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTrack, countLessons, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/Reveal";

type Props = { params: Promise<{ locale: string }> };

export default async function TracksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/${locale}/login?next=${encodeURIComponent(`/${locale}/tracks`)}`);
  }

  const t = await getTranslations("tracks");
  const loc = locale as Locale;

  const enrollments = await prisma.trackEnrollment.findMany({
    where: { userId: session.user.id },
    orderBy: { startedAt: "desc" },
  });

  const tracks = enrollments
    .map((e) => getTrack(e.trackSlug))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="animate-rise max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-accent">AlefYa</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-ink sm:text-5xl">
          {t("myTitle")}
        </h1>
        <p className="mt-3 text-lg text-ink-muted">{t("mySubtitle")}</p>
        <div className="accent-rule mt-6 max-w-xs" />
      </div>

      {tracks.length === 0 ? (
        <div className="mt-12 border border-line bg-bg-elevated/40 p-8">
          <p className="text-ink-muted">{t("myEmpty")}</p>
          <Link href="/categories" className="btn-primary mt-4 inline-flex">
            {t("browseCategories")}
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-5">
          {tracks.map((track, i) => {
            const lessons = countLessons(track);
            return (
              <Reveal key={track.slug} delay={i * 80}>
                <Link
                  href={`/tracks/${track.slug}`}
                  className="surface-panel flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="mt-1 h-12 w-1.5 shrink-0"
                      style={{ background: track.color }}
                    />
                    <div>
                      <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">
                        {tl(track.title, loc)}
                      </h2>
                      <p className="mt-2 max-w-2xl text-ink-muted">
                        {tl(track.description, loc)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-4 text-sm text-ink-muted sm:flex-col sm:items-end sm:gap-1.5">
                    <span>
                      {track.stages.length} {t("stages")}
                    </span>
                    <span>
                      {lessons} {t("lessons")}
                    </span>
                    <span>
                      ~{track.estimatedHours} {t("hours")}
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
