/** Imperative nav feedback — only for real route changes / explicit opt-in. */

const OVERLAY_ID = "alefya-nav-loader";
const BAR_ID = "alefya-nav-bar";
const LOADING_CLASS = "is-page-loading";

/** Full overlay only if still navigating after this (avoids flash on instant routes). */
const OVERLAY_DELAY_MS = 180;

let hideTimer: number | null = null;
let overlayTimer: number | null = null;
let visibleOverlay = false;
let barOn = false;

function loadingLabel(): string {
  const lang = document.documentElement.lang || "";
  return lang.startsWith("ar") ? "جاري التحميل…" : "Loading…";
}

function setPageLoadingLock(on: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle(LOADING_CLASS, on);
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

function ensureOverlay(): HTMLElement {
  let el = document.getElementById(OVERLAY_ID);
  if (el) return el;

  el = document.createElement("div");
  el.id = OVERLAY_ID;
  el.className = "page-loader-overlay";
  el.setAttribute("role", "status");
  el.setAttribute("aria-busy", "true");
  el.setAttribute("aria-live", "polite");
  el.hidden = true;
  el.style.display = "none";
  el.style.pointerEvents = "none";

  el.innerHTML = `
    <div class="page-loader" aria-hidden="true">
      <div class="page-loader-orbit">
        <span class="page-loader-ring"></span>
        <span class="page-loader-ring page-loader-ring-delay"></span>
        <span class="page-loader-core"></span>
      </div>
      <p class="page-loader-label"></p>
      <div class="page-loader-bars">
        <span></span><span></span><span></span><span></span>
      </div>
    </div>
  `;

  const block = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };
  for (const type of [
    "pointerdown",
    "pointerup",
    "mousedown",
    "mouseup",
    "click",
    "dblclick",
    "contextmenu",
    "wheel",
    "touchstart",
    "touchend",
  ] as const) {
    el.addEventListener(type, block, true);
  }

  document.body.appendChild(el);
  return el;
}

function paintBar(): void {
  const el = ensureBar();
  el.classList.add("is-on");
  barOn = true;
  setPageLoadingLock(true);
}

function paintOverlay(maxMs: number): void {
  const el = ensureOverlay();
  const label = el.querySelector(".page-loader-label");
  if (label) label.textContent = loadingLabel();
  el.setAttribute("aria-label", loadingLabel());
  el.hidden = false;
  el.style.display = "flex";
  el.style.pointerEvents = "auto";
  paintBar();
  visibleOverlay = true;
  if (hideTimer) window.clearTimeout(hideTimer);
  hideTimer = window.setTimeout(() => hideNavLoader(), maxMs);
}

function clearTimers(): void {
  if (overlayTimer) {
    window.clearTimeout(overlayTimer);
    overlayTimer = null;
  }
  if (hideTimer) {
    window.clearTimeout(hideTimer);
    hideTimer = null;
  }
}

/**
 * Show navigation feedback immediately (top bar), then full overlay if still pending.
 */
export function showNavLoader(maxMs = 12000): void {
  if (typeof document === "undefined") return;
  paintBar();
  if (visibleOverlay) {
    paintOverlay(maxMs);
    return;
  }
  if (overlayTimer) window.clearTimeout(overlayTimer);
  overlayTimer = window.setTimeout(() => {
    overlayTimer = null;
    paintOverlay(maxMs);
  }, OVERLAY_DELAY_MS);
}

export function hideNavLoader(): void {
  if (typeof document === "undefined") return;
  clearTimers();
  visibleOverlay = false;
  barOn = false;
  setPageLoadingLock(false);

  const bar = document.getElementById(BAR_ID);
  if (bar) bar.classList.remove("is-on");

  const el = document.getElementById(OVERLAY_ID);
  if (!el) return;
  el.hidden = true;
  el.style.display = "none";
  el.style.pointerEvents = "none";
}

export function isNavLoaderVisible(): boolean {
  return visibleOverlay || barOn;
}

function isExemptControl(el: Element): boolean {
  if (el.closest("[data-no-loader]")) return true;
  if (el.closest('[role="dialog"], .confirm-overlay, .confirm-shell, .profile-modal-shell')) {
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

/**
 * Loader only for:
 * 1) Same-origin links that actually change the route
 * 2) Explicit opt-in via [data-nav-loader] (buttons that push/replace routes)
 *
 * Filters, accordions, messenger toggle, FAQ, local UI — never trigger.
 */
export function shouldShowNavLoaderForTarget(target: EventTarget | null): boolean {
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

/** Alias kept for callers — same rule set as shouldShowNavLoaderForTarget. */
export function isHardNavigationTarget(target: EventTarget | null): boolean {
  return shouldShowNavLoaderForTarget(target);
}
