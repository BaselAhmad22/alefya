"use client";

/**
 * PageLoader used inside forms / panels.
 * IMPORTANT: overlay mode is disabled — it previously blocked all navigation.
 */
export function PageLoader({
  overlay: _overlay = false,
  className = "",
}: {
  overlay?: boolean;
  className?: string;
}) {
  return (
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
}
