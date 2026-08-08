import type { ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";

type Props = {
  brand: string;
  status: string;
  title: string;
  body: string;
  actions: ReactNode;
  digest?: string;
  digestLabel?: string;
  /** Visual tone: soft amber for faults, teal for missing routes */
  tone?: "fault" | "missing";
};

function FaultMark({ tone }: { tone: "fault" | "missing" }) {
  const stroke = tone === "fault" ? "var(--accent)" : "var(--teal-bright)";
  return (
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
          stroke={stroke}
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
        <circle cx="22" cy="22.5" r="2.35" fill={stroke} />
      </svg>
    </span>
  );
}

/** Shared recovery surface for page errors and 404. */
export function AppFaultScreen({
  brand,
  status,
  title,
  body,
  actions,
  digest,
  digestLabel,
  tone = "fault",
}: Props) {
  return (
    <div className={`ay-error-page ay-error-page--${tone}`}>
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
            <p className="ay-error-brand-en">{brand}</p>
          </div>
        </header>

        <div className="ay-error-main">
          <FaultMark tone={tone} />
          <p className="ay-error-status">{status}</p>
          <h1 className="ay-error-title">{title}</h1>
          <p className="ay-error-body">{body}</p>
          <div className="ay-error-actions">{actions}</div>
        </div>

        {digest ? (
          <p className="ay-error-digest">
            <span>{digestLabel}</span>
            <code>{digest}</code>
          </p>
        ) : null}
      </div>
    </div>
  );
}
