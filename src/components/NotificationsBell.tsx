"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { hideNavLoader, showNavLoader } from "@/lib/nav-loader";
import { dispatchFriendsBadgeRefresh, prefetchFriendsData } from "@/lib/friends-badge";
import { useRealtimeSocket } from "@/hooks/useRealtimeSocket";

type Notif = {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
};

function notifHref(n: Notif): string {
  const p = n.payload;
  const username =
    (p.fromUsername as string) || (p.byUsername as string) || "";
  if (n.type === "friend_request") {
    if (p.resolved) return username ? `/u/${username}` : "/friends";
    return "/friends?tab=requests";
  }
  if (n.type === "friend_accepted" && username) return `/u/${username}`;
  if (n.type === "friend_rejected" && username) return `/u/${username}`;
  if (username) return `/u/${username}`;
  return "/friends";
}

function isPendingRequest(n: Notif): boolean {
  return (
    n.type === "friend_request" &&
    typeof n.payload.requestId === "string" &&
    !n.payload.resolved
  );
}

export function NotificationsBell() {
  const t = useTranslations("notifications");
  const tf = useTranslations("friends");
  const { data: session } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<Notif[]>([]);
  const [busy, setBusy] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { socket } = useRealtimeSocket();

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json().catch(() => ({}));
      setUnread(data.unread || 0);
      setItems(data.notifications || []);
    } catch {
      // Server briefly unavailable (HMR / restart).
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    void load();
    const id = window.setInterval(() => void load(), 12000);
    return () => window.clearInterval(id);
  }, [session?.user, load]);

  useEffect(() => {
    if (!socket) return;
    const onNotif = () => void load();
    socket.on("notification:new", onNotif);
    return () => {
      socket.off("notification:new", onNotif);
    };
  }, [socket, load]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  async function markAllRead() {
    setUnread(0);
    setItems((prev) =>
      prev.map((item) =>
        item.readAt
          ? item
          : { ...item, readAt: new Date().toISOString() },
      ),
    );
    const res = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    const data = await res.json().catch(() => ({}));
    if (typeof data.unread === "number") setUnread(data.unread);
    await load();
  }

  async function toggleBell() {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen) {
      // Opening the bell marks everything read (without entering each item).
      await markAllRead();
    }
  }

  function openNotif(n: Notif) {
    const href = notifHref(n);
    setOpen(false);

    if (n.type === "friend_request" && !n.payload.resolved) {
      prefetchFriendsData();
    }

    const targetPath = href.split("?")[0];
    if (targetPath === pathname) {
      router.push(href);
      hideNavLoader();
      return;
    }

    const leaveGuardActive =
      document.documentElement.dataset.leaveGuardActive === "true";
    if (leaveGuardActive) {
      const absolute = new URL(href, window.location.origin).href;
      window.dispatchEvent(
        new CustomEvent("alefya:confirm-nav", { detail: { href: absolute } }),
      );
      return;
    }

    showNavLoader();
    router.push(href);
  }

  async function respond(n: Notif, action: "accept" | "reject") {
    const requestId = n.payload.requestId;
    if (typeof requestId !== "string") return;
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/friends/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });
      if (!res.ok && res.status !== 409) {
        await load();
        return;
      }

      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== n.id) return item;
          return {
            ...item,
            readAt: item.readAt || new Date().toISOString(),
            payload: {
              ...item.payload,
              resolved: true,
              resolution: action === "accept" ? "accepted" : "rejected",
            },
          };
        }),
      );
      await load();
      dispatchFriendsBadgeRefresh();
    } finally {
      setBusy(false);
    }
  }

  if (!session?.user) return null;

  return (
    <>
      <div ref={rootRef} className={`notif-root ${open ? "is-open" : ""}`}>
        <button
          type="button"
          className={`notif-bell ${unread > 0 ? "has-unread" : ""} ${open ? "is-open" : ""}`}
          aria-label={t("title")}
          aria-expanded={open}
          onClick={() => void toggleBell()}
        >
          <span className="notif-bell-ring" aria-hidden />
          <span className="notif-bell-glow" aria-hidden />
          <svg
            className="notif-bell-icon"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden
          >
            <path
              d="M9 2.2c-2.4 0-4.3 1.9-4.3 4.3v2.1c0 .7-.3 1.4-.8 1.9L2.7 12h12.6l-1.2-1.5c-.5-.5-.8-1.2-.8-1.9V6.5C13.3 4.1 11.4 2.2 9 2.2Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path
              d="M7.4 14.2a1.8 1.8 0 0 0 3.2 0"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          {unread > 0 && (
            <span className="notif-badge">{unread > 9 ? "9+" : unread}</span>
          )}
        </button>

        {open && (
          <div className="notif-panel" dir={locale === "ar" ? "rtl" : "ltr"}>
            <div className="notif-panel-head">
              <p className="text-sm font-medium">{t("title")}</p>
            </div>
            <ul className="notif-list">
              {items.length === 0 ? (
                <li className="notif-empty">{t("empty")}</li>
              ) : (
                items.map((n, i) => {
                  const p = n.payload;
                  const from =
                    (p.fromUsername as string) ||
                    (p.byUsername as string) ||
                    "";
                  const pending = isPendingRequest(n);
                  const resolution = p.resolution as string | undefined;
                  return (
                    <li
                      key={n.id}
                      className="notif-item"
                      style={{ animationDelay: `${i * 35}ms` }}
                    >
                      <button
                        type="button"
                        className="notif-item-main"
                        onClick={() => openNotif(n)}
                      >
                        {n.type === "friend_request" && (
                          <>
                            <p className="notif-item-text">
                              {pending ? (
                                <>
                                  <span className="notif-user">@{from}</span>{" "}
                                  {t("friendRequest")}
                                </>
                              ) : resolution === "accepted" ? (
                                t("youAccepted")
                              ) : resolution === "rejected" ? (
                                t("youRejected")
                              ) : (
                                t("friendRequest")
                              )}
                            </p>
                            {typeof p.note === "string" && p.note && pending ? (
                              <p className="notif-item-note">“{p.note}”</p>
                            ) : null}
                          </>
                        )}
                        {n.type === "friend_accepted" && (
                          <p className="notif-item-text">
                            <span className="notif-user">@{from}</span>{" "}
                            {t("friendAccepted")}
                          </p>
                        )}
                        {n.type === "friend_rejected" && (
                          <p className="notif-item-text is-muted">
                            <span className="notif-user">@{from}</span>{" "}
                            {t("friendRejected")}
                          </p>
                        )}
                        <p className="notif-item-hint">{t("openHint")}</p>
                      </button>

                      {pending && (
                        <div className="notif-item-actions">
                          <button
                            type="button"
                            disabled={busy}
                            className="notif-action is-accept"
                            onClick={(e) => {
                              e.stopPropagation();
                              void respond(n, "accept");
                            }}
                          >
                            {tf("accept")}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            className="notif-action is-reject"
                            onClick={(e) => {
                              e.stopPropagation();
                              void respond(n, "reject");
                            }}
                          >
                            {tf("reject")}
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
