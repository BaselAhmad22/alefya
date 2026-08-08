"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";

/** Warm critical routes after home settles so CTAs feel instant. */
export function HomePrefetch() {
  const router = useRouter();

  useEffect(() => {
    const run = () => {
      router.prefetch("/start");
      router.prefetch("/categories");
      router.prefetch("/interviews");
    };

    const onDone = () => run();
    if (document.documentElement.classList.contains("is-lusion-ready")) {
      run();
    }
    window.addEventListener("ay:lusion-done", onDone);
    const t = window.setTimeout(run, 2800);
    return () => {
      window.removeEventListener("ay:lusion-done", onDone);
      window.clearTimeout(t);
    };
  }, [router]);

  return null;
}
