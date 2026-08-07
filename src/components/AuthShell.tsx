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
    <div className="auth-shell">
      <aside className="auth-brand">
        <div className="auth-brand-glow auth-brand-glow-a" aria-hidden />
        <div className="auth-brand-glow auth-brand-glow-b" aria-hidden />
        <div className="auth-brand-top">
          <Link href="/" className="auth-brand-logo-link">
            <BrandLogo size={52} className="auth-brand-logo" />
            <span>
              <span className="auth-brand-name" lang="ar">
                ألف ياء
              </span>
              <span className="auth-brand-tag">AlefYa</span>
            </span>
          </Link>
        </div>
        <div className="auth-brand-copy animate-rise">
          <p className="auth-brand-line">{brandLine}</p>
          <div className="page-hero-rule auth-brand-rule" />
          <p className="auth-brand-sub">{brandSub}</p>
        </div>
        <p className="auth-brand-foot">Alef → Ya · ordered learning</p>
      </aside>

      <section className="auth-panel-wrap">
        <div className="auth-panel animate-rise">
          <div className="auth-panel-brand-mobile">
            <BrandLogo size={44} className="auth-brand-logo" />
          </div>
          <header className="auth-panel-head">
            <p className="page-kicker">AlefYa</p>
            <h1 className="auth-panel-title">{title}</h1>
            <p className="auth-panel-sub">{subtitle}</p>
          </header>
          <div className="auth-panel-body">{children}</div>
        </div>
      </section>
    </div>
  );
}
