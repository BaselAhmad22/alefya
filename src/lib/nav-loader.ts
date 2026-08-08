/** Imperative nav feedback — top bar only. Never blocks clicks. */

const BAR_ID = "alefya-nav-bar";
const LOADING_CLASS = "is-page-loading";

let hideTimer: number | null = null;
let barOn = false;

function clearLocks(): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove(LOADING_CLASS);
  document.documentElement.classList.remove("is-lusion-loading");
  // Kill any leftover full-screen loaders from older builds.
  const legacy = document.getElementById("alefya-nav-loader");
  if (legacy) {
    legacy.hidden = true;
    legacy.style.display = "none";
    legacy.style.pointerEvents = "none";
    legacy.remove();
  }
  document.querySelectorAll(".page-loader-overlay").forEach((el) => {
    if (el.id !== "alefya-nav-loader") {
      (el as HTMLElement).style.pointerEvents = "none";
      el.remove();
    }
  });
}

function ensureBar(): HTMLElement {
  let el = document.getElementById(BAR_ID);
  if (el) return el;
  el = document.createElement("div");
  el.id = BAR_ID;
  el.className = "ay-nav-bar";
  el.setAttribute("aria-hidden", "true");
  document.body.appendChild(el);
  return el;
}

function clearTimers(): void {
  if (hideTimer) {
    window.clearTimeout(hideTimer);
    hideTimer = null;
  }
}

/**
 * Thin top progress only — never a full-screen blocking overlay.
 */
export function showNavLoader(maxMs = 6000): void {
  if (typeof document === "undefined") return;
  clearLocks();
  const el = ensureBar();
  el.classList.add("is-on");
  barOn = true;
  clearTimers();
  hideTimer = window.setTimeout(() => {
    hideNavLoader();
    const lang = document.documentElement.lang || "";
    const msg = lang.startsWith("ar")
      ? "الصفحة أخذت وقت طويل. جرّب مرة ثانية أو حدّث الصفحة."
      : "This page took too long. Try again or refresh.";
    window.dispatchEvent(
      new CustomEvent("alefya:app-error", {
        detail: { message: msg, code: "nav-timeout", sticky: false },
      }),
    );
  }, maxMs);
}

export function hideNavLoader(): void {
  if (typeof document === "undefined") return;
  clearTimers();
  barOn = false;
  clearLocks();
  const bar = document.getElementById(BAR_ID);
  if (bar) bar.classList.remove("is-on");
}

export function isNavLoaderVisible(): boolean {
  return barOn;
}

function isExemptControl(el: Element): boolean {
  if (el.closest("[data-no-loader]")) return true;
  if (
    el.closest(
      '[role="dialog"], .confirm-overlay, .confirm-shell, .profile-modal-shell',
    )
  ) {
    return true;
  }
  return false;
}

function isSamePageAnchor(anchor: HTMLAnchorElement): boolean {
  if (anchor.target && anchor.target !== "_self") return true;
  if (anchor.hasAttribute("download")) return true;
  const href = anchor.getAttribute("href");
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("javascript:")
  ) {
    return true;
  }
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return true;
    const current = new URL(window.location.href);
    return url.pathname === current.pathname && url.search === current.search;
  } catch {
    return true;
  }
}

export function shouldShowNavLoaderForTarget(
  target: EventTarget | null,
): boolean {
  if (!(target instanceof Element)) return false;
  if (isExemptControl(target)) return false;

  if (target.closest("[data-nav-loader]")) {
    const btn = target.closest("button, [role='button'], a");
    if (btn instanceof HTMLButtonElement && btn.disabled) return false;
    if (btn?.getAttribute("aria-disabled") === "true") return false;
    return true;
  }

  const anchor = target.closest("a");
  if (!(anchor instanceof HTMLAnchorElement)) return false;
  return !isSamePageAnchor(anchor);
}

export function isHardNavigationTarget(target: EventTarget | null): boolean {
  return shouldShowNavLoaderForTarget(target);
}
