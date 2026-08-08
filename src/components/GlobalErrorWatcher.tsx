"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ToastProvider";
import { defaultAppErrorMessage, notifyAppError } from "@/lib/app-error";
import { hideNavLoader } from "@/lib/nav-loader";

/**
 * Global safety net: unhandled errors / rejections → clear loader + toast.
 * Also bridges `alefya:app-error` custom events into the toast system.
 */
export function GlobalErrorWatcher() {
  const { push } = useToast();
  const t = useTranslations("errors");
  const lastRef = useRef<{ msg: string; at: number }>({ msg: "", at: 0 });

  useEffect(() => {
    function show(message: string, sticky = true) {
      const msg = message.trim() || t("generic");
      const now = Date.now();
      if (msg === lastRef.current.msg && now - lastRef.current.at < 2200) {
        return;
      }
      lastRef.current = { msg, at: now };
      hideNavLoader();
      push({ kind: "error", message: msg, mode: sticky ? "sticky" : "auto" });
    }

    function onAppError(e: Event) {
      const detail = (e as CustomEvent<{ message?: string; sticky?: boolean }>)
        .detail;
      show(detail?.message || t("generic"), detail?.sticky !== false);
    }

    function onUnhandledRejection(e: PromiseRejectionEvent) {
      // Ignore Next.js navigation aborts and benign cancellations.
      const reason = e.reason;
      const text =
        typeof reason === "string"
          ? reason
          : reason instanceof Error
            ? reason.message
            : "";
      if (/abort|cancel|NEXT_REDIRECT|NEXT_NOT_FOUND/i.test(text)) return;

      e.preventDefault?.();
      show(t("generic"));
    }

    function onWindowError(e: ErrorEvent) {
      // Script load / extension noise — skip empty messages.
      if (!e.message || e.message === "Script error.") return;
      if (/ResizeObserver|Loading chunk|ChunkLoadError/i.test(e.message)) {
        show(t("chunk"), true);
        return;
      }
      show(t("generic"));
    }

    window.addEventListener("alefya:app-error", onAppError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    window.addEventListener("error", onWindowError);

    return () => {
      window.removeEventListener("alefya:app-error", onAppError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("error", onWindowError);
    };
  }, [push, t]);

  // Expose default message helper for non-translated callers after mount.
  useEffect(() => {
    (window as unknown as { __alefyaDefaultError?: () => string }).__alefyaDefaultError =
      () => t("generic");
    return () => {
      delete (window as unknown as { __alefyaDefaultError?: () => string })
        .__alefyaDefaultError;
    };
  }, [t]);

  return null;
}

/** Imperative helper that uses live translation when available. */
export function reportClientError(message?: string) {
  const fallback =
    typeof window !== "undefined" &&
    typeof (window as unknown as { __alefyaDefaultError?: () => string })
      .__alefyaDefaultError === "function"
      ? (window as unknown as { __alefyaDefaultError: () => string })
          .__alefyaDefaultError()
      : defaultAppErrorMessage();
  notifyAppError(message || fallback);
}
