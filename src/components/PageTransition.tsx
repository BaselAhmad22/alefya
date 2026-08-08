"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/routing";

/**
 * Subtle enter motion on route change without remounting the tree
 * (remounting previously made navigations feel laggy).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [enter, setEnter] = useState(true);

  useEffect(() => {
    setEnter(false);
    const id = window.requestAnimationFrame(() => {
      setEnter(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <div className={`page-shell ${enter ? "is-enter" : "is-swap"}`}>
      {children}
    </div>
  );
}
