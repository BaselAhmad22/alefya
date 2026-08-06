"use client";

import { SessionProvider as Provider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider refetchOnWindowFocus={false} refetchInterval={0}>
      {children}
    </Provider>
  );
}
