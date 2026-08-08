"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ToastProvider";
import { defaultAppErrorMessage, notifyAppError } from "@/lib/app-error";
import { hideNavLoader } from "@/lib/nav-loader";

function humanizeRawError(raw: string, fallback: string): string {
  const text = raw.trim();
  if (!text) return fallback;
  if (/abort|cancel|NEXT_REDIRECT|NEXT_NOT_FOUND/i.test(text)) return "";
  if (/failed to fetch|networkerror|load failed|ernet/i.test(text)) {
    return "";
  }
  if (/^\s*at\s+|webpack|node_modules|__next/i.test(text)) return fallback;
  if (text.length > 180) return `${text.slice(0, 177)}…`;
  return text;
}

/**
 * Global safety net: unhandled errors / rejections → clear loader + toast.
 * Shows a concrete message when available (not only a generic line).
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
      const reason = e.reason;
      const text =
        typeof reason === "string"
          ? reason
          : reason instanceof Error
            ? reason.message
            : "";

      if (/abort|cancel|NEXT_REDIRECT|NEXT_NOT_FOUND/i.test(text)) return;
      if (/failed to fetch|networkerror|load failed/i.test(text)) {
        e.preventDefault?.();
        show(t("network"));
        return;
      }

      e.preventDefault?.();
      const human = humanizeRawError(text, t("generic"));
      if (!human) return;
      show(human === t("generic") ? t("generic") : `${t("generic")} — ${human}`);
    }

    function onWindowError(e: ErrorEvent) {
      if (!e.message || e.message === "Script error.") return;
      if (/ResizeObserver/i.test(e.message)) return;
      if (/Loading chunk|ChunkLoadError/i.test(e.message)) {
        show(t("chunk"), true);
        return;
      }
      const human = humanizeRawError(e.message, t("generic"));
      show(human === t("generic") ? t("generic") : `${t("generic")} — ${human}`);
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
