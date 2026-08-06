"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useRealtimeSocket } from "@/hooks/useRealtimeSocket";

export function MessagesNavLink() {
  const t = useTranslations("nav");
  const { data: session } = useSession();
  const pathname = usePathname();
  const [count, setCount] = useState(0);
  const { socket } = useRealtimeSocket();

  const load = useCallback(async () => {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unread-count" }),
    });
    if (!res.ok) return;
    const data = await res.json().catch(() => ({}));
    setCount(Number(data.unreadMessages) || 0);
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    void load();
    const id = window.setInterval(() => void load(), 60000);
    return () => window.clearInterval(id);
  }, [session?.user, load]);

  useEffect(() => {
    if (pathname?.startsWith("/messages")) void load();
  }, [pathname, load]);

  useEffect(() => {
    const onBadge = () => void load();
    window.addEventListener("alefya:messages-badge", onBadge);
    return () => window.removeEventListener("alefya:messages-badge", onBadge);
  }, [load]);

  useEffect(() => {
    if (!socket) return;
    const refresh = () => void load();
    socket.on("message:new", refresh);
    socket.on("messages:badge", refresh);
    socket.on("message:deleted", refresh);
    return () => {
      socket.off("message:new", refresh);
      socket.off("messages:badge", refresh);
      socket.off("message:deleted", refresh);
    };
  }, [socket, load]);

  if (!session?.user) return null;

  const active =
    pathname === "/messages" || Boolean(pathname?.startsWith("/messages/"));

  return (
    <Link
      href="/messages"
      className={`site-nav-link is-social${active ? " is-active" : ""}`}
    >
      {t("messages")}
      {count > 0 ? (
        <span className="messages-nav-badge">{count > 9 ? "9+" : count}</span>
      ) : null}
    </Link>
  );
}
