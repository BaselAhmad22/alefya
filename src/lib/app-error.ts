import { hideNavLoader } from "@/lib/nav-loader";

export type AppErrorDetail = {
  message?: string;
  /** Optional machine code for callers that map their own copy. */
  code?: string;
  sticky?: boolean;
};

const DEFAULT_AR =
  "حدث خطأ غير متوقع. الموقع ما علّق — جرّب مرة ثانية أو حدّث الصفحة.";
const DEFAULT_EN =
  "Something went wrong. The site isn’t frozen — try again or refresh the page.";

export function defaultAppErrorMessage(locale?: string | null): string {
  const lang =
    locale ||
    (typeof document !== "undefined" ? document.documentElement.lang : "") ||
    "";
  return lang.startsWith("ar") ? DEFAULT_AR : DEFAULT_EN;
}

/**
 * Show a clear user-facing error and clear any stuck page loader.
 * Safe to call from event handlers, catch blocks, and non-React code.
 */
export function notifyAppError(detail?: string | AppErrorDetail): void {
  if (typeof window === "undefined") return;

  hideNavLoader();

  const payload: AppErrorDetail =
    typeof detail === "string" ? { message: detail } : detail || {};

  const message = (payload.message || "").trim() || defaultAppErrorMessage();

  window.dispatchEvent(
    new CustomEvent("alefya:app-error", {
      detail: {
        message,
        code: payload.code,
        sticky: payload.sticky !== false,
      },
    }),
  );
}

/** Prefer a mapped message; fall back to the global default. */
export function notifyAppErrorFromResponse(
  res: Response,
  messages: { unauthorized?: string; generic?: string },
): void {
  if (res.status === 401 || res.status === 403) {
    notifyAppError(messages.unauthorized || defaultAppErrorMessage());
    return;
  }
  notifyAppError(messages.generic || defaultAppErrorMessage());
}
