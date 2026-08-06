"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import { Link, useRouter } from "@/i18n/routing";
import { hideNavLoader, showNavLoader } from "@/lib/nav-loader";
import { dispatchFriendsBadgeRefresh } from "@/lib/friends-badge";
import { useTranslations } from "next-intl";
import type { Relationship } from "@/lib/friends";

type Mate = {
  id: string;
  username: string;
  name: string | null;
  relationship: Relationship;
  canMessage: boolean;
};

const INITIAL_VISIBLE = 5;
const SEARCH_THRESHOLD = 6;

function avatarTone(username: string) {
  let h = 0;
  for (let i = 0; i < username.length; i++) {
    h = (h * 31 + username.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

function relationshipRank(r: Relationship) {
  switch (r) {
    case "pending_in":
      return 0;
    case "friends":
      return 1;
    case "can_request":
      return 2;
    case "pending_out":
      return 3;
    default:
      return 4;
  }
}

export function ClassmatesPanel({ trackSlug }: { trackSlug: string }) {
  const t = useTranslations("social");
  const tf = useTranslations("friends");
  const router = useRouter();
  const [mates, setMates] = useState<Mate[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  async function load() {
    const r = await fetch(
      `/api/classmates?trackSlug=${encodeURIComponent(trackSlug)}`,
    );
    const d = await r.json().catch(() => ({}));
    setMates(d.classmates || []);
  }

  useEffect(() => {
    setQuery("");
    setExpanded(false);
    void load();
  }, [trackSlug]);

  async function message(userId: string) {
    setBusyId(userId);
    showNavLoader();
    try {
      const res = await fetch("/api/classmates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherUserId: userId, trackSlug }),
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
      setBusyId(null);
    }
  }

  async function addFriend(userId: string) {
    setBusyId(userId);
    try {
      await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: userId }),
      });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function respond(
    requestFromUsername: string,
    action: "accept" | "reject",
  ) {
    setBusyId(requestFromUsername);
    try {
      const profileRes = await fetch(
        `/api/users/${encodeURIComponent(requestFromUsername)}`,
      );
      const profileData = await profileRes.json().catch(() => ({}));
      const requestId = profileData.profile?.pendingRequest?.id;
      if (requestId) {
        await fetch("/api/friends/respond", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestId, action }),
        });
      }
      await load();
      dispatchFriendsBadgeRefresh();
    } finally {
      setBusyId(null);
    }
  }

  const list = mates ?? [];
  const loading = mates === null;

  const ranked = useMemo(
    () =>
      [...list].sort((a, b) => {
        const d = relationshipRank(a.relationship) - relationshipRank(b.relationship);
        if (d !== 0) return d;
        return a.username.localeCompare(b.username);
      }),
    [list],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ranked;
    return ranked.filter(
      (m) =>
        m.username.toLowerCase().includes(q) ||
        (m.name ? m.name.toLowerCase().includes(q) : false),
    );
  }, [ranked, query]);

  const showSearch = list.length >= SEARCH_THRESHOLD;
  const visible = expanded
    ? filtered
    : filtered.slice(0, INITIAL_VISIBLE);
  const hiddenCount = Math.max(0, filtered.length - visible.length);
  const preview = ranked.slice(0, 4);

  return (
    <section className="learners-shell" aria-labelledby="learners-heading">
      <div className="learners-panel">
        <header className="learners-panel-head">
          <div className="learners-head-copy">
            <p className="learners-kicker">{t("classmatesKicker")}</p>
            <h2 id="learners-heading" className="learners-title">
              {t("classmates")}
            </h2>
            <p className="learners-hint">{t("classmatesHint")}</p>
          </div>

          <div className="learners-head-meta">
            {!loading && preview.length > 0 ? (
              <div className="learners-stack" aria-hidden>
                {preview.map((m) => (
                  <span
                    key={m.id}
                    className="learners-stack-avatar"
                    style={
                      {
                        "--avatar-h": String(avatarTone(m.username)),
                      } as CSSProperties
                    }
                  >
                    {(m.username.slice(0, 1) || "?").toUpperCase()}
                  </span>
                ))}
                {list.length > preview.length ? (
                  <span className="learners-stack-more">
                    +{list.length - preview.length}
                  </span>
                ) : null}
              </div>
            ) : null}
            {!loading ? (
              <span className="learners-count" aria-live="polite">
                {t("classmatesCount", { count: list.length })}
              </span>
            ) : null}
          </div>
        </header>

        <div className="learners-divider" aria-hidden />

        {loading ? (
          <ul className="learners-list" aria-hidden>
            {[0, 1, 2].map((i) => (
              <li
                key={i}
                className="learner-card is-skeleton"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="learner-avatar" />
                <span className="learner-meta">
                  <span className="learner-skel-line" />
                  <span className="learner-skel-line is-short" />
                </span>
              </li>
            ))}
          </ul>
        ) : list.length === 0 ? (
          <div className="learners-empty">
            <span className="learners-empty-icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16 11a3 3 0 1 0-2.8-4M8 13a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM4.5 20a5.5 5.5 0 0 1 11 0M15 14.5a4.5 4.5 0 0 1 5.5 5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <p>{t("classmatesEmpty")}</p>
          </div>
        ) : (
          <>
            {showSearch ? (
              <label className="learners-search">
                <span className="sr-only">{t("classmatesSearch")}</span>
                <svg
                  className="learners-search-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="6.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M16.2 16.2 20 20"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setExpanded(true);
                  }}
                  placeholder={t("classmatesSearch")}
                  autoComplete="off"
                />
              </label>
            ) : null}

            {filtered.length === 0 ? (
              <div className="learners-empty is-compact">
                <p>{t("classmatesNoMatch")}</p>
              </div>
            ) : (
              <>
                <div className="learners-list-wrap">
                  <ul className="learners-list">
                    {visible.map((m, i) => {
                      const busy = busyId === m.id || busyId === m.username;
                      const initial = (
                        m.username.slice(0, 1) || "?"
                      ).toUpperCase();
                      const displayName = m.name?.trim() || m.username;
                      return (
                        <li
                          key={m.id}
                          className="learner-card"
                          style={
                            {
                              animationDelay: `${Math.min(i, 8) * 40}ms`,
                              "--avatar-h": String(avatarTone(m.username)),
                            } as CSSProperties
                          }
                        >
                          <Link
                            href={`/u/${m.username}`}
                            className="learner-identity"
                          >
                            <span className="learner-avatar" aria-hidden>
                              {initial}
                            </span>
                            <span className="learner-meta">
                              <span className="learner-name">{displayName}</span>
                              <span className="learner-handle">
                                @{m.username}
                              </span>
                              {m.relationship === "friends" ? (
                                <span className="learner-status is-friend">
                                  {tf("friends")}
                                </span>
                              ) : m.relationship === "pending_out" ? (
                                <span className="learner-status is-pending">
                                  {tf("pendingOut")}
                                </span>
                              ) : null}
                            </span>
                          </Link>

                          <div className="learner-actions">
                            {m.canMessage ? (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => void message(m.id)}
                                className="learner-btn is-message"
                                title={t("message")}
                                aria-label={t("message")}
                              >
                                <svg
                                  width="15"
                                  height="15"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  aria-hidden
                                >
                                  <path
                                    d="M4 6.8A2.8 2.8 0 0 1 6.8 4h10.4A2.8 2.8 0 0 1 20 6.8v7.4a2.8 2.8 0 0 1-2.8 2.8H9.2L5 20v-3h-.2A2.8 2.8 0 0 1 2 14.2V6.8A2.8 2.8 0 0 1 4 6.8Z"
                                    stroke="currentColor"
                                    strokeWidth="1.65"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <span>{t("message")}</span>
                              </button>
                            ) : null}

                            {m.relationship === "can_request" ? (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => void addFriend(m.id)}
                                className="learner-btn is-friend"
                                title={tf("addFriend")}
                                aria-label={tf("addFriend")}
                              >
                                <svg
                                  width="15"
                                  height="15"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  aria-hidden
                                >
                                  <path
                                    d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM4.5 20a5.5 5.5 0 0 1 11 0M18 8v6M15 11h6"
                                    stroke="currentColor"
                                    strokeWidth="1.65"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <span>{tf("addFriend")}</span>
                              </button>
                            ) : null}

                            {m.relationship === "pending_in" ? (
                              <>
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() =>
                                    void respond(m.username, "accept")
                                  }
                                  className="learner-btn is-accept"
                                >
                                  {tf("accept")}
                                </button>
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() =>
                                    void respond(m.username, "reject")
                                  }
                                  className="learner-btn is-ghost"
                                >
                                  {tf("reject")}
                                </button>
                              </>
                            ) : null}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {hiddenCount > 0 || expanded ? (
                  <div className="learners-foot">
                    {hiddenCount > 0 ? (
                      <button
                        type="button"
                        className="learners-more"
                        onClick={() => setExpanded(true)}
                      >
                        {t("classmatesShowMore", { count: hiddenCount })}
                      </button>
                    ) : filtered.length > INITIAL_VISIBLE ? (
                      <button
                        type="button"
                        className="learners-more is-muted"
                        onClick={() => {
                          setExpanded(false);
                          setQuery("");
                        }}
                      >
                        {t("classmatesShowLess")}
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
