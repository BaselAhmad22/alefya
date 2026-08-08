"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";

const SESSION_KEY = "alefya-lusion-intro-v3";
const DONE_EVENT = "ay:lusion-done";

function pad3(n: number) {
  return String(Math.max(0, Math.min(100, Math.round(n)))).padStart(3, "0");
}

function markReady() {
  document.documentElement.classList.remove("is-lusion-loading");
  document.documentElement.classList.add("is-lusion-ready");
  window.dispatchEvent(new CustomEvent(DONE_EVENT));
}

/**
 * Lusion-inspired intro. Visual only — never locks pointer-events on the app.
 * Survives React Strict Mode remounts without leaving the UI stuck.
 */
export function LusionIntro() {
  const pathname = usePathname();
  const locale = useLocale();
  const isHome = pathname === "/";
  const [active, setActive] = useState(false);
  const [digits, setDigits] = useState("000");
  const [opening, setOpening] = useState(false);
  const gen = useRef(0);

  useLayoutEffect(() => {
    if (!isHome) {
      markReady();
      setActive(false);
      return;
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const seen = sessionStorage.getItem(SESSION_KEY) === "1";

    if (prefersReduced || seen) {
      markReady();
      setActive(false);
      return;
    }

    const myGen = ++gen.current;
    const timers: number[] = [];
    let raf = 0;

    // Visual flag only — do NOT rely on pointer-events locks.
    document.documentElement.classList.add("is-lusion-loading");
    document.documentElement.classList.remove("is-lusion-ready");
    setActive(true);
    setOpening(false);
    setDigits("000");

    const finish = () => {
      if (gen.current !== myGen) return;
      sessionStorage.setItem(SESSION_KEY, "1");
      markReady();
      setOpening(true);
      timers.push(
        window.setTimeout(() => {
          if (gen.current === myGen) setActive(false);
        }, 700) as unknown as number,
      );
    };

    const duration = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      if (gen.current !== myGen) return;
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      const value = t < 0.9 ? eased * 96 : 96 + ((t - 0.9) / 0.1) * 4;
      setDigits(pad3(value));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDigits("100");
        timers.push(
          window.setTimeout(() => {
            setOpening(true);
            timers.push(
              window.setTimeout(finish, 900) as unknown as number,
            );
          }, 200) as unknown as number,
        );
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
      // Strict Mode remount: always clear locks so the app never stays frozen.
      document.documentElement.classList.remove("is-lusion-loading");
      if (!document.documentElement.classList.contains("is-lusion-ready")) {
        document.documentElement.classList.add("is-lusion-ready");
      }
    };
  }, [isHome]);

  if (!active) return null;

  const brand = locale === "ar" ? "ألف ياء" : "AlefYa";

  return (
    <div
      className={`ay-lusion ${opening ? "is-opening" : ""}`}
      aria-live="polite"
      aria-busy={!opening}
      role="status"
    >
      <div className="ay-lusion-panel ay-lusion-panel--top" aria-hidden />
      <div className="ay-lusion-panel ay-lusion-panel--bottom" aria-hidden />
      <div className="ay-lusion-seam" aria-hidden />
      <div className="ay-lusion-center">
        <p className="ay-lusion-brand" lang={locale === "ar" ? "ar" : undefined}>
          {brand}
        </p>
        <div className="ay-lusion-percent" aria-label={`${Number(digits)}%`}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="ay-lusion-digit" data-digit={digits[i]}>
              {digits[i]}
            </span>
          ))}
          <span className="ay-lusion-suffix">%</span>
        </div>
        <div className="ay-lusion-bar" aria-hidden>
          <span style={{ width: `${Number(digits)}%` }} />
        </div>
      </div>
    </div>
  );
}
