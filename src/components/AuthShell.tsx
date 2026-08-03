import { Link } from "@/i18n/routing";
import { BrandLogo } from "@/components/BrandLogo";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  brandLine: string;
  brandSub: string;
};

export function AuthShell({
  title,
  subtitle,
  children,
  brandLine,
  brandSub,
}: Props) {
  return (
    <div className="relative mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="relative hidden overflow-hidden border-e border-line lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div
          className="pointer-events-none absolute -start-20 top-10 h-72 w-72 rounded-full bg-teal/25 blur-3xl animate-ambient"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -end-10 bottom-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl animate-ambient"
          style={{ animationDelay: "1.5s" }}
          aria-hidden
        />
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <BrandLogo
              size={52}
              className="border border-teal/30 shadow-[0_0_32px_rgba(20,184,166,0.25)]"
            />
            <span>
              <span
                className="block font-[family-name:var(--font-display)] text-2xl text-ink"
                lang="ar"
              >
                ألف ياء
              </span>
              <span className="text-[10px] uppercase tracking-[0.28em] text-ink-muted">
                AlefYa
              </span>
            </span>
          </Link>
        </div>
        <div className="relative z-10 max-w-md animate-rise">
          <p className="font-[family-name:var(--font-display)] text-4xl leading-tight text-ink sm:text-5xl">
            {brandLine}
          </p>
          <div className="accent-rule mt-5 max-w-[9rem]" />
          <p className="mt-5 text-base leading-relaxed text-ink-muted">
            {brandSub}
          </p>
        </div>
        <p className="relative z-10 text-xs text-ink-muted/70">
          Alef → Ya · ordered learning
        </p>
      </aside>

      <section className="relative flex items-center justify-center px-4 py-12 sm:px-8">
        <div
          className="pointer-events-none absolute inset-0 lg:hidden"
          aria-hidden
        >
          <div className="absolute start-0 top-0 h-48 w-48 rounded-full bg-teal/20 blur-3xl" />
          <div className="absolute end-0 bottom-20 h-40 w-40 rounded-full bg-accent/15 blur-3xl" />
        </div>
        <div className="glass-card relative z-10 w-full max-w-md animate-rise p-7 sm:p-9">
          <div className="mb-6 lg:hidden">
            <BrandLogo size={44} className="border border-line" />
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl leading-tight text-ink">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {subtitle}
          </p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </div>
  );
}
