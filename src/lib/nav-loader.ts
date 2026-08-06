/** Imperative full-viewport nav loader — paints before React can lag. */

const OVERLAY_ID = "alefya-nav-loader";
const LOADING_CLASS = "is-page-loading";

/** Only show spinner if navigation is still pending after this delay. */
const SHOW_DELAY_MS = 140;

let hideTimer: number | null = null;
let showTimer: number | null = null;
let visible = false;

function setPageLoadingLock(on: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle(LOADING_CLASS, on);
}

function ensureOverlay(): HTMLElement {
  let el = document.getElementById(OVERLAY_ID);
  if (el) return el;

  el = document.createElement("div");
  el.id = OVERLAY_ID;
  el.className = "page-loader-overlay";
  el.setAttribute("role", "status");
  el.setAttribute("aria-busy", "true");
  el.setAttribute("aria-label", "Loading");
  el.setAttribute("aria-live", "polite");
  // Start with none so the click that triggered navigation still reaches the link.
  // Once visible (after SHOW_DELAY), we switch to auto to block all interaction.
  el.style.cssText = [
    "position:fixed",
    "top:0",
    "left:0",
    "right:0",
    "bottom:0",
    "width:100vw",
    "height:100dvh",
    "display:none",
    "align-items:center",
    "justify-content:center",
    "z-index:9999",
    "margin:0",
    "pointer-events:none",
    "cursor:wait",
  ].join(";");

  el.innerHTML = `
    <div class="page-loader" aria-hidden="true">
      <div class="page-loader-orbit">
        <span class="page-loader-ring"></span>
        <span class="page-loader-ring page-loader-ring-delay"></span>
        <span class="page-loader-core"></span>
      </div>
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

function paintOverlay(maxMs: number): void {
  const el = ensureOverlay();
  el.hidden = false;
  el.style.display = "flex";
  // Navigation click already finished (we delayed SHOW_DELAY_MS) — now lock the UI.
  el.style.pointerEvents = "auto";
  setPageLoadingLock(true);
  visible = true;
  if (hideTimer) {
    window.clearTimeout(hideTimer);
    hideTimer = null;
  }
  hideTimer = window.setTimeout(() => hideNavLoader(), maxMs);
}

/**
 * Schedule the nav loader. Fast local navigations finish before SHOW_DELAY_MS
 * and never flash a full-screen spinner.
 */
export function showNavLoader(maxMs = 10000): void {
  if (typeof document === "undefined") return;
  if (visible) {
    paintOverlay(maxMs);
    return;
  }
  if (showTimer) window.clearTimeout(showTimer);
  showTimer = window.setTimeout(() => {
    showTimer = null;
    paintOverlay(maxMs);
  }, SHOW_DELAY_MS);
}

export function hideNavLoader(): void {
  if (typeof document === "undefined") return;
  if (showTimer) {
    window.clearTimeout(showTimer);
    showTimer = null;
  }
  if (hideTimer) {
    window.clearTimeout(hideTimer);
    hideTimer = null;
  }
  visible = false;
  setPageLoadingLock(false);
  const el = document.getElementById(OVERLAY_ID);
  if (!el) return;
  el.hidden = true;
  el.style.display = "none";
  el.style.pointerEvents = "none";
}

export function isNavLoaderVisible(): boolean {
  return visible;
}

/** True when this control should trigger the instant nav loader. */
export function shouldShowNavLoaderForTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;

  if (target.closest("[data-no-loader]")) return false;

  // Confirm / dialog actions must not flash a loader on Stay/Cancel.
  if (target.closest('[role="dialog"], .confirm-overlay, .confirm-shell')) {
    return false;
  }

  const anchor = target.closest("a");
  if (anchor instanceof HTMLAnchorElement) {
    if (anchor.target && anchor.target !== "_self") return false;
    if (anchor.hasAttribute("download")) return false;
    const href = anchor.getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:")
    ) {
      return false;
    }
    try {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return false;
      const current = new URL(window.location.href);
      if (url.pathname === current.pathname && url.search === current.search) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  // Only buttons that explicitly opt in — not every button on the page.
  const btn = target.closest(
    "button[data-nav-loader], [role='button'][data-nav-loader]",
  );
  if (btn) {
    if (btn instanceof HTMLButtonElement && btn.disabled) return false;
    return true;
  }

  return false;
}
