"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Home cinema stage: scroll progress, mouse parallax, magnetic CTAs.
 * Activates after Lusion intro (`ay:lusion-done` / is-lusion-ready).
 * No custom cursor — uses the native pointer.
 */
export function HomeCinema({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const reduceRef = useRef(false);

  useEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const mark = () => setLive(true);
    if (document.documentElement.classList.contains("is-lusion-ready")) {
      mark();
      return;
    }
    window.addEventListener("ay:lusion-done", mark);
    const fallback = window.setTimeout(() => {
      if (document.documentElement.classList.contains("is-lusion-ready")) mark();
    }, 80);
    return () => {
      window.removeEventListener("ay:lusion-done", mark);
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!live || reduceRef.current) return;
    const root = rootRef.current;
    if (!root) return;

    document.documentElement.classList.add("ay-home-cinema");

    const progress = root.querySelector<HTMLElement>(".ay-scroll-progress");
    const layers = [
      ...root.querySelectorAll<HTMLElement>("[data-parallax]"),
    ];

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (progress) progress.style.transform = `scaleX(${p})`;
    };

    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      layers.forEach((el) => {
        const depth = Number(el.dataset.parallax || 12);
        el.style.transform = `translate3d(${nx * depth}px, ${ny * depth}px, 0)`;
      });
    };

    const magnets = [...root.querySelectorAll<HTMLElement>(".ay-magnetic")];
    const onMagMove = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate3d(${x * 0.18}px, ${y * 0.18}px, 0)`;
    };
    const onMagLeave = (e: PointerEvent) => {
      (e.currentTarget as HTMLElement).style.transform = "";
    };

    magnets.forEach((el) => {
      el.addEventListener("pointermove", onMagMove);
      el.addEventListener("pointerleave", onMagLeave);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    onScroll();

    return () => {
      document.documentElement.classList.remove("ay-home-cinema");
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      magnets.forEach((el) => {
        el.removeEventListener("pointermove", onMagMove);
        el.removeEventListener("pointerleave", onMagLeave);
      });
    };
  }, [live]);

  return (
    <div
      ref={rootRef}
      className={`home-cinema ay-home-stage ${live ? "is-live" : ""}`}
    >
      <div className="ay-scroll-progress" aria-hidden />
      <div className="ay-noise" aria-hidden />
      {children}
    </div>
  );
}
