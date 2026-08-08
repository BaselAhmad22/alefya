"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { hideNavLoader, showNavLoader } from "@/lib/nav-loader";
import { notifyAppError } from "@/lib/app-error";
import {
  consumeFriendsPrefetch,
  dispatchFriendsBadgeRefresh,
} from "@/lib/friends-badge";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type FriendUser = { id: string; username: string; name: string | null };

type Friend = FriendUser & { since: string };

type RequestRow = {
  id: string;
  note: string | null;
  createdAt: string;
  user: FriendUser;
};

type Tab = "friends" | "requests";

export function FriendsClient() {
  const t = useTranslations("friends");
  const router = useRouter();
  const search = useSearchParams();
  const initialTab =
    search.get("tab") === "requests" ? "requests" : "friends";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incoming, setIncoming] = useState<RequestRow[]>([]);
  const [outgoing, setOutgoing] = useState<RequestRow[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [pendingUnfriend, setPendingUnfriend] = useState<Friend | null>(null);

  const load = useCallback(async () => {
    const prefetched = consumeFriendsPrefetch();
    if (prefetched) {
      setFriends((prefetched.friends as Friend[]) || []);
      setIncoming((prefetched.incoming as RequestRow[]) || []);
      setOutgoing((prefetched.outgoing as RequestRow[]) || []);
      setLoaded(true);
      dispatchFriendsBadgeRefresh();
      return;
    }

    const res = await fetch("/api/friends");
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return;
    setFriends(data.friends || []);
    setIncoming(data.incoming || []);
    setOutgoing(data.outgoing || []);
    setLoaded(true);
    dispatchFriendsBadgeRefresh();
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const next = search.get("tab") === "requests" ? "requests" : "friends";
    setTab(next);
  }, [search]);

  function switchTab(next: Tab) {
    setTab(next);
    const q = next === "requests" ? "?tab=requests" : "";
    router.replace(`/friends${q}`);
  }

  async function respond(requestId: string, action: "accept" | "reject") {
    if (busy) return;
    setBusy(requestId);
    try {
      const res = await fetch("/api/friends/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });
      if (!res.ok && res.status !== 409) {
        notifyAppError();
        return;
      }
    } catch {
      notifyAppError();
    } finally {
      setBusy(null);
      await load();
    }
  }

  async function confirmUnfriend() {
    if (!pendingUnfriend) return;
    const otherUserId = pendingUnfriend.id;
    setBusy(otherUserId);
    try {
      const res = await fetch("/api/friends", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherUserId }),
      });
      if (!res.ok) notifyAppError();
    } catch {
      notifyAppError();
    }
    setBusy(null);
    setPendingUnfriend(null);
    await load();
  }

  async function message(otherUserId: string) {
    setBusy(otherUserId);
    showNavLoader();
    try {
      const res = await fetch("/api/classmates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherUserId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.conversationId) {
        router.push(`/messages?c=${data.conversationId}`);
      } else {
        hideNavLoader();
      }
    } catch {
      hideNavLoader();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="friends-shell">
      <div className="friends-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "friends"}
          className={`friends-tab ${tab === "friends" ? "is-active" : ""}`}
          onClick={() => switchTab("friends")}
        >
          {t("tabFriends")}
          <span className="friends-tab-count">{friends.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "requests"}
          className={`friends-tab ${tab === "requests" ? "is-active" : ""}`}
          onClick={() => switchTab("requests")}
        >
          {t("tabRequests")}
          {incoming.length > 0 ? (
            <span className="friends-tab-count is-accent">{incoming.length}</span>
          ) : (
            <span className="friends-tab-count">
              {incoming.length + outgoing.length}
            </span>
          )}
        </button>
      </div>

      {!loaded ? (
        <p className="friends-loading-text">{t("loading")}</p>
      ) : tab === "friends" ? (
        friends.length === 0 ? (
          <p className="friends-empty">{t("emptyFriends")}</p>
        ) : (
          <ul className="friends-list">
            {friends.map((f) => (
              <li key={f.id} className="friends-row">
                <Link href={`/u/${f.username}`} className="friends-row-main">
                  <span className="friends-avatar" aria-hidden>
                    {f.username.slice(0, 1).toUpperCase()}
                  </span>
                  <span>
                    <span className="friends-name">@{f.username}</span>
                    {f.name ? (
                      <span className="friends-meta">{f.name}</span>
                    ) : null}
                  </span>
                </Link>
                <div className="friends-actions">
                  <button
                    type="button"
                    className="social-action is-message"
                    disabled={busy === f.id}
                    onClick={() => void message(f.id)}
                  >
                    {t("message")}
                  </button>
                  <button
                    type="button"
                    className="social-action is-ghost"
                    disabled={busy === f.id}
                    onClick={() => setPendingUnfriend(f)}
                  >
                    {t("unfriend")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : (
        <div className="friends-requests">
          <section className="friends-requests-section">
            <h2 className="friends-section-title">{t("incoming")}</h2>
            {incoming.length === 0 ? (
              <p className="friends-empty-inline">{t("emptyIncoming")}</p>
            ) : (
              <ul className="friends-list">
                {incoming.map((r) => (
                  <li key={r.id} className="friends-row">
                    <Link
                      href={`/u/${r.user.username}`}
                      className="friends-row-main"
                    >
                      <span className="friends-avatar" aria-hidden>
                        {r.user.username.slice(0, 1).toUpperCase()}
                      </span>
                      <span>
                        <span className="friends-name">@{r.user.username}</span>
                        {r.note ? (
                          <span className="friends-meta">“{r.note}”</span>
                        ) : null}
                      </span>
                    </Link>
                    <div className="friends-actions">
                      <button
                        type="button"
                        className="social-action is-accept"
                        disabled={busy === r.id}
                        onClick={() => void respond(r.id, "accept")}
                      >
                        {t("accept")}
                      </button>
                      <button
                        type="button"
                        className="social-action is-ghost"
                        disabled={busy === r.id}
                        onClick={() => void respond(r.id, "reject")}
                      >
                        {t("reject")}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="friends-requests-section">
            <h2 className="friends-section-title">{t("outgoing")}</h2>
            {outgoing.length === 0 ? (
              <p className="friends-empty-inline">{t("emptyOutgoing")}</p>
            ) : (
              <ul className="friends-list">
                {outgoing.map((r) => (
                  <li key={r.id} className="friends-row">
                    <Link
                      href={`/u/${r.user.username}`}
                      className="friends-row-main"
                    >
                      <span className="friends-avatar is-muted" aria-hidden>
                        {r.user.username.slice(0, 1).toUpperCase()}
                      </span>
                      <span>
                        <span className="friends-name">@{r.user.username}</span>
                        <span className="friends-meta">{t("pendingOut")}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingUnfriend)}
        title={t("unfriendTitle")}
        description={t("unfriendDesc")}
        confirmLabel={t("unfriendConfirm")}
        cancelLabel={t("cancel")}
        username={pendingUnfriend?.username}
        busy={busy === pendingUnfriend?.id}
        onCancel={() => {
          if (busy === pendingUnfriend?.id) return;
          setPendingUnfriend(null);
        }}
        onConfirm={() => void confirmUnfriend()}
      />
    </div>
  );
}
