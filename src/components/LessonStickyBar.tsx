"use client";

import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export function LessonStickyBar({ children }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`lesson-sticky-wrap sticky z-30 mb-8 ${
        scrolled ? "is-scrolled" : ""
      }`}
    >
      <div className={`lesson-sticky-bar group ${scrolled ? "is-scrolled" : ""}`}>
        {children}
      </div>
    </div>
  );
}
