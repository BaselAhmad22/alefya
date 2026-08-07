"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { routing, useRouter } from "@/i18n/routing";
import { showNavLoader } from "@/lib/nav-loader";

type Props = {
  active: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
};

function toAppPath(href: string): string {
  const url = new URL(href, window.location.href);
  let path = url.pathname;
  for (const locale of routing.locales) {
    const prefix = `/${locale}`;
    if (path === prefix) {
      path = "/";
      break;
    }
    if (path.startsWith(`${prefix}/`)) {
      path = path.slice(prefix.length) || "/";
      break;
    }
  }
  return `${path}${url.search}${url.hash}` || "/";
}

/**
 * Blocks in-app link navigation and tab close/refresh while `active`.
 * Uses ConfirmDialog for same-origin links; native dialog for beforeunload.
 */
export function LeaveGuard({
  active,
  title,
  description,
  confirmLabel,
  cancelLabel,
}: Props) {
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const allowNextRef = useRef(false);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (active) {
      document.documentElement.dataset.leaveGuardActive = "true";
    } else {
      delete document.documentElement.dataset.leaveGuardActive;
      setPendingHref(null);
      allowNextRef.current = false;
    }
    return () => {
      delete document.documentElement.dataset.leaveGuardActive;
    };
  }, [active]);

  useEffect(() => {
    const onProgrammatic = (e: Event) => {
      if (!activeRef.current) return;
      const detail = (e as CustomEvent<{ href?: string }>).detail;
      const href = detail?.href;
      if (!href) return;
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        window.dispatchEvent(new Event("alefya:nav-cancel"));
        setPendingHref(url.href);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("alefya:confirm-nav", onProgrammatic);
    return () =>
      window.removeEventListener("alefya:confirm-nav", onProgrammatic);
  }, []);

  useEffect(() => {
    if (!active) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      // Intentional leave via our confirm dialog — do not double-prompt the browser.
      if (allowNextRef.current || !activeRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [active]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!activeRef.current) return;
      if (allowNextRef.current) {
        allowNextRef.current = false;
        return;
      }
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const el = (e.target as HTMLElement | null)?.closest?.("a");
      if (!el) return;
      if (el.target && el.target !== "_self") return;
      if (el.hasAttribute("download")) return;
      if (el.dataset.leaveOk === "true") return;

      const href = el.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        const current = new URL(window.location.href);
        if (
          url.pathname === current.pathname &&
          url.search === current.search &&
          url.hash === current.hash
        ) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(new Event("alefya:nav-cancel"));
        setPendingHref(url.href);
      } catch {
        /* ignore */
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  const onCancel = useCallback(() => {
    setPendingHref(null);
    allowNextRef.current = false;
    window.dispatchEvent(new Event("alefya:nav-cancel"));
  }, []);

  const onConfirm = useCallback(() => {
    if (!pendingHref) return;
    const href = pendingHref;
    setPendingHref(null);
    // Disable guards before navigating so the browser does not show a second prompt.
    allowNextRef.current = true;
    activeRef.current = false;
    window.dispatchEvent(new Event("alefya:nav-start"));
    showNavLoader();
    router.push(toAppPath(href));
  }, [pendingHref, router]);

  return (
    <ConfirmDialog
      open={Boolean(pendingHref)}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      tone="warn"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
