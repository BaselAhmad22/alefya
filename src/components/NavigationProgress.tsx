"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";
import {
  hideNavLoader,
  shouldShowNavLoaderForTarget,
  showNavLoader,
} from "@/lib/nav-loader";

/**
 * Route-change feedback only (top bar + delayed full overlay).
 * Local UI (filters, FAQ, messenger, toggles) does not trigger the loader.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    hideNavLoader();
  }, [pathname, locale]);

  useEffect(() => {
    hideNavLoader();
    // Clear any stuck lock from a previous session / HMR.
    document.documentElement.classList.remove("is-page-loading");
    document.documentElement.classList.remove("is-lusion-loading");

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!shouldShowNavLoaderForTarget(e.target)) return;
      showNavLoader();
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) {
        hideNavLoader();
        return;
      }
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!shouldShowNavLoaderForTarget(e.target)) return;
      showNavLoader();
    };

    const onStart = () => showNavLoader();
    const onCancel = () => hideNavLoader();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hideNavLoader();
    };
    const onPageShow = () => hideNavLoader();

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("click", onClick, true);
    window.addEventListener("alefya:nav-start", onStart);
    window.addEventListener("alefya:nav-cancel", onCancel);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("alefya:nav-start", onStart);
      window.removeEventListener("alefya:nav-cancel", onCancel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pageshow", onPageShow);
      hideNavLoader();
    };
  }, []);

  return null;
}
