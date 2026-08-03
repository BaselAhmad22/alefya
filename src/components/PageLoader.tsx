type Props = {
  /** Full-viewport overlay during route waits */
  overlay?: boolean;
  className?: string;
};

/** Visual-only loader — no copy. Brand pulse + orbit. */
export function PageLoader({ overlay = false, className = "" }: Props) {
  const body = (
    <div
      className={`page-loader ${className}`}
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="page-loader-orbit" aria-hidden>
        <span className="page-loader-ring" />
        <span className="page-loader-ring page-loader-ring-delay" />
        <span className="page-loader-core" />
      </div>
      <div className="page-loader-bars" aria-hidden>
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );

  if (!overlay) return body;

  return <div className="page-loader-overlay">{body}</div>;
}
