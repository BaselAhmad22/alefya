"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useRealtimeSocket } from "@/hooks/useRealtimeSocket";
import { FRIENDS_BADGE_EVENT } from "@/lib/friends-badge";

export function FriendsNavLink() {
  const t = useTranslations("nav");
  const { data: session } = useSession();
  const pathname = usePathname();
  const [count, setCount] = useState(0);
  const { socket } = useRealtimeSocket();

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/friends");
      if (!res.ok) return;
      const data = await res.json().catch(() => ({}));
      setCount(Number(data.incomingCount) || 0);
    } catch {
      // Server briefly unavailable (HMR / restart) — keep last count.
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    void load();
    const id = window.setInterval(() => void load(), 60000);
    return () => window.clearInterval(id);
  }, [session?.user, load]);

  useEffect(() => {
    if (pathname?.startsWith("/friends")) void load();
  }, [pathname, load]);

  useEffect(() => {
    const onBadge = () => void load();
    window.addEventListener(FRIENDS_BADGE_EVENT, onBadge);
    return () => window.removeEventListener(FRIENDS_BADGE_EVENT, onBadge);
  }, [load]);

  useEffect(() => {
    if (!socket) return;
    const onNotif = (n: { type?: string }) => {
      if (
        !n?.type ||
        n.type === "friend_request" ||
        n.type === "friend_accepted" ||
        n.type === "friend_rejected"
      ) {
        void load();
      }
    };
    socket.on("notification:new", onNotif);
    return () => {
      socket.off("notification:new", onNotif);
    };
  }, [socket, load]);

  if (!session?.user) return null;

  const active =
    pathname === "/friends" || Boolean(pathname?.startsWith("/friends/"));

  return (
    <Link
      href="/friends"
      className={`site-nav-link is-social${active ? " is-active" : ""}`}
    >
      {t("friends")}
      {count > 0 ? (
        <span className="friends-nav-badge">{count > 9 ? "9+" : count}</span>
      ) : null}
    </Link>
  );
}
