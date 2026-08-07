"use client";

import { usePathname } from "@/i18n/routing";

/** Hides site footer on immersive pages (e.g. full-page messages). */
export function SiteFooterGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hide =
    pathname === "/messages" || Boolean(pathname?.startsWith("/messages/"));
  if (hide) return null;
  return <>{children}</>;
}
