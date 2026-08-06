"use client";

import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  /** Full-viewport overlay during route waits */
  overlay?: boolean;
  className?: string;
};

const LOADING_CLASS = "is-page-loading";

function blockEvent(e: React.SyntheticEvent) {
  e.preventDefault();
  e.stopPropagation();
}

/** Visual-only loader — no copy. Brand pulse + orbit. */
export function PageLoader({ overlay = false, className = "" }: Props) {
  // Client first paint can portal immediately; SSR has no document.
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(() =>
    typeof document !== "undefined" ? document.body : null,
  );

  useLayoutEffect(() => {
    if (portalTarget !== document.body) {
      setPortalTarget(document.body);
    }
  }, [portalTarget]);

  useLayoutEffect(() => {
    if (!overlay) return;
    document.documentElement.classList.add(LOADING_CLASS);
    return () => {
      document.documentElement.classList.remove(LOADING_CLASS);
    };
  }, [overlay]);

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

  // Never mount the overlay under transformed ancestors (e.g. .page-transition).
  // That breaks position:fixed and parks the spinner at the top of the page.
  if (!portalTarget) return null;

  return createPortal(
    <div
      className="page-loader-overlay"
      role="presentation"
      aria-busy="true"
      onPointerDown={blockEvent}
      onMouseDown={blockEvent}
      onClick={blockEvent}
      onContextMenu={blockEvent}
      onWheel={blockEvent}
      onTouchStart={blockEvent}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        margin: 0,
        pointerEvents: "auto",
        cursor: "wait",
      }}
    >
      {body}
    </div>,
    portalTarget,
  );
}
