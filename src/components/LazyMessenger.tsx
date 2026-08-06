"use client";

import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

const MessengerWidget = dynamic(
  () =>
    import("@/components/MessengerWidget").then((m) => m.MessengerWidget),
  { ssr: false },
);

/** Defer messenger chunk until the user is signed in. */
export function LazyMessenger() {
  const { data: session, status } = useSession();
  if (status !== "authenticated" || !session?.user) return null;
  return <MessengerWidget />;
}
