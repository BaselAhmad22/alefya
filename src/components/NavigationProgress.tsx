"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { PageLoader } from "@/components/PageLoader";

/** Centered loader on internal link navigation — never blocks the click itself. */
export function NavigationProgress() {
  const pathname = usePathname();
  const locale = useLocale();
  const [active, setActive] = useState(false);
  const hideTimer = useRef<number | null>(null);

  function clearTimers() {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }

  function stop() {
    clearTimers();
    setActive(false);
  }

  function start() {
    clearTimers();
    flushSync(() => {
      setActive(true);
    });
    hideTimer.current = window.setTimeout(stop, 8000);
  }

  // Clear when route OR locale changes (locale switch keeps the same pathname)
  useEffect(() => {
    stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, locale]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const el = (e.target as HTMLElement | null)?.closest?.("a");
      if (!el) return;
      if (el.target && el.target !== "_self") return;
      if (el.hasAttribute("download")) return;

      const href = el.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;

        const current = new URL(window.location.href);
        if (url.pathname === current.pathname && url.search === current.search) {
          return;
        }
      } catch {
        return;
      }

      // click (not pointerdown): link navigation already committed; overlay won't steal it
      start();
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!active) return null;

  return (
    <div
      className="page-loader-overlay"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <PageLoader />
    </div>
  );
}
