"use client";

/** Pass-through — remounting the tree on every route made navigations feel laggy. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <div className="page-shell">{children}</div>;
}
