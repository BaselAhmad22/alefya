"use client";

import { FormEvent, useState, type CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Link, useRouter } from "@/i18n/routing";
import { hideNavLoader, showNavLoader } from "@/lib/nav-loader";
import { dispatchFriendsBadgeRefresh } from "@/lib/friends-badge";
import type { Relationship } from "@/lib/friends";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { BrandLogo } from "@/components/BrandLogo";

export type PublicProfileData = {
  id: string;
  username: string;
  name: string | null;
  createdAt: string;
  friendCount: number;
  relationship: Relationship;
  pendingRequest: {
    id: string;
    note: string | null;
    fromUsername: string;
  } | null;
  tracks: Array<{
    slug: string;
    title: string;
    done: number;
    total: number;
    pct: number;
  }> | null;
  roadmap: {
    level: string;
    field: string;
    language: string;
    framework: string;
    currentTrackSlug: string;
  } | null;
};

export function PublicProfileClient({
  initial,
}: {
  initial: PublicProfileData;
}) {
  const t = useTranslations("profilePublic");
  const tf = useTranslations("friends");
  const locale = useLocale();
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(initial);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmUnfriend, setConfirmUnfriend] = useState(false);

  async function refresh() {
    const res = await fetch(
      `/api/users/${encodeURIComponent(profile.username)}?locale=${locale}`,
    );
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.profile) setProfile(data.profile);
  }

  async function sendRequest(e?: FormEvent) {
    e?.preventDefault();
    if (!session?.user) {
      showNavLoader();
      router.push("/login");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch("/api/friends/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toUserId: profile.id,
        note: note.trim() || null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      const map: Record<string, string> = {
        blocked: tf("error_blocked"),
        pending: tf("error_pending"),
        already_friends: tf("error_already_friends"),
        invalid: tf("error_invalid"),
        not_found: tf("error_not_found"),
      };
      setError(map[String(data.error)] || tf("errorGeneric"));
      return;
    }
    setShowNote(false);
    setNote("");
    await refresh();
  }

  async function respond(action: "accept" | "reject") {
    if (!profile.pendingRequest || busy) return;
    setBusy(true);
    try {
      await fetch("/api/friends/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: profile.pendingRequest.id,
          action,
        }),
      });
    } finally {
      setBusy(false);
      await refresh();
      dispatchFriendsBadgeRefresh();
    }
  }

  async function unfriend() {
    setBusy(true);
    await fetch("/api/friends", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otherUserId: profile.id }),
    });
    setBusy(false);
    setConfirmUnfriend(false);
    await refresh();
  }

  async function message() {
    setBusy(true);
    showNavLoader();
    try {
      const res = await fetch("/api/classmates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherUserId: profile.id }),
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
      setBusy(false);
    }
  }

  const joined = new Date(profile.createdAt).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
  });

  return (
    <div className="ay-page pp-page">
      <div className="ay-page-ambient" aria-hidden />

      <article className="pp-identity">
        <div className="pp-identity-glow" aria-hidden />
        <div className="pp-identity-top">
          <BrandLogo size={56} className="pp-identity-logo" />
          <div className="pp-identity-copy">
            <p className="page-kicker">{t("label")}</p>
            <h1 className="pp-identity-name">@{profile.username}</h1>
            {profile.name ? (
              <p className="pp-identity-display">{profile.name}</p>
            ) : null}
            <p className="pp-identity-meta">
              {t("joined", { date: joined })} ·{" "}
              {t("friendsCount", { count: profile.friendCount })}
            </p>
          </div>
        </div>

        <div className="pp-identity-actions">
          {profile.relationship === "self" && (
            <Link href="/profile" className="btn-ghost btn-compact">
              {t("editOwn")}
            </Link>
          )}
          {profile.relationship === "can_request" && (
            <button
              type="button"
              className="social-action is-friend is-lg"
              disabled={busy}
              onClick={() => setShowNote(true)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM4.5 20a5.5 5.5 0 0 1 11 0M18 8v6M15 11h6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
              <span>{tf("addFriend")}</span>
            </button>
          )}
          {profile.relationship === "pending_out" && (
            <span className="learner-badge is-pending is-lg">
              {tf("pendingOut")}
            </span>
          )}
          {profile.relationship === "pending_in" && (
            <>
              <button
                type="button"
                className="social-action is-accept is-lg"
                disabled={busy}
                onClick={() => void respond("accept")}
              >
                {tf("accept")}
              </button>
              <button
                type="button"
                className="social-action is-ghost is-lg"
                disabled={busy}
                onClick={() => void respond("reject")}
              >
                {tf("reject")}
              </button>
            </>
          )}
          {profile.relationship === "rejected_blocked" && (
            <span className="learner-badge is-pending is-lg">
              {tf("blocked")}
            </span>
          )}
          {profile.relationship === "friends" && (
            <>
              <button
                type="button"
                className="social-action is-message is-lg"
                disabled={busy}
                onClick={() => void message()}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 6.8A2.8 2.8 0 0 1 6.8 4h10.4A2.8 2.8 0 0 1 20 6.8v7.4a2.8 2.8 0 0 1-2.8 2.8H9.2L5 20v-3h-.2A2.8 2.8 0 0 1 2 14.2V6.8A2.8 2.8 0 0 1 4 6.8Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{tf("message")}</span>
              </button>
              <button
                type="button"
                className="social-action is-ghost is-lg"
                disabled={busy}
                onClick={() => setConfirmUnfriend(true)}
              >
                {tf("unfriend")}
              </button>
            </>
          )}
        </div>

        {profile.pendingRequest?.note && (
          <p className="pp-identity-note">
            <span className="pp-identity-note-label">{tf("noteLabel")}: </span>
            {profile.pendingRequest.note}
          </p>
        )}

        {error && <p className="pp-identity-error">{error}</p>}

        {showNote && (
          <form onSubmit={(e) => void sendRequest(e)} className="pp-note-form">
            <label className="auth-field">
              <span className="auth-label">{tf("noteHint")}</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={300}
                rows={3}
                className="auth-input auth-textarea"
                placeholder={tf("notePlaceholder")}
              />
            </label>
            <div className="pp-note-actions">
              <button type="submit" disabled={busy} className="btn-primary btn-compact">
                {tf("sendRequest")}
              </button>
              <button
                type="button"
                className="btn-ghost btn-compact"
                onClick={() => setShowNote(false)}
              >
                {tf("cancel")}
              </button>
            </div>
          </form>
        )}
      </article>

      {profile.tracks ? (
        <section className="pp-tracks-section">
          <header className="pp-tracks-head">
            <h2 className="pp-tracks-title">{t("studying")}</h2>
            {profile.roadmap && (
              <p className="pp-tracks-roadmap">
                {t("roadmapLine", {
                  level: profile.roadmap.level,
                  field: profile.roadmap.field,
                  language: profile.roadmap.language,
                })}
              </p>
            )}
          </header>
          {profile.tracks.length === 0 ? (
            <p className="pp-tracks-empty">{t("noTracks")}</p>
          ) : (
            <ul className="pp-track-list">
              {profile.tracks.map((tr, i) => (
                <li key={tr.slug}>
                  <Link
                    href={`/tracks/${tr.slug}`}
                    className="pp-track-card"
                    style={
                      {
                        animationDelay: `${Math.min(i, 10) * 55}ms`,
                        "--pp-pct": `${tr.pct}%`,
                      } as CSSProperties
                    }
                  >
                    <div className="pp-track-glow" aria-hidden />
                    <div className="pp-track-row">
                      <span className="pp-track-title">{tr.title}</span>
                      <span className="pp-track-meta">
                        <span className="pp-track-pct">{tr.pct}%</span>
                        <span className="pp-track-arrow" aria-hidden>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M3.5 8h9M8.5 4l4 4-4 4"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </span>
                    </div>
                    <div className="pp-track-bar" aria-hidden>
                      <div className="pp-track-bar-fill" />
                    </div>
                    <p className="pp-track-count">
                      {tr.done}/{tr.total}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <p className="pp-private-hint">{t("privateHint")}</p>
      )}

      <ConfirmDialog
        open={confirmUnfriend}
        title={tf("unfriendTitle")}
        description={tf("unfriendDesc")}
        confirmLabel={tf("unfriendConfirm")}
        cancelLabel={tf("cancel")}
        username={profile.username}
        busy={busy}
        onCancel={() => {
          if (busy) return;
          setConfirmUnfriend(false);
        }}
        onConfirm={() => void unfriend()}
      />
    </div>
  );
}
