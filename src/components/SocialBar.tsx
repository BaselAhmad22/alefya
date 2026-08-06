"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

type Props = {
  targetType: "lesson" | "stage" | "track";
  targetId: string;
  shareUrl: string;
  shareTitle: string;
};

type CommentRow = {
  id: string;
  body: string;
  createdAt: string;
  user: { id: string; username: string };
  likeCount?: number;
  liked?: boolean;
  replies?: CommentRow[];
};

export function SocialBar({
  targetType,
  targetId,
  shareUrl,
  shareTitle,
}: Props) {
  const t = useTranslations("social");
  const { data: session } = useSession();
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function refresh() {
    const [likesRes, commentsRes] = await Promise.all([
      fetch(
        `/api/social/likes?targetType=${targetType}&targetId=${encodeURIComponent(targetId)}`,
      ),
      fetch(
        `/api/social/comments?targetType=${targetType}&targetId=${encodeURIComponent(targetId)}`,
      ),
    ]);
    const likes = await likesRes.json().catch(() => ({}));
    const c = await commentsRes.json().catch(() => ({}));
    setCount(likes.count || 0);
    setLiked(Boolean(likes.liked));
    setComments(c.comments || []);
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetType, targetId]);

  async function toggleLike() {
    if (!session?.user) return;
    setBusy(true);
    const method = liked ? "DELETE" : "POST";
    const res = await fetch("/api/social/likes", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) {
      setCount(data.count || 0);
      setLiked(Boolean(data.liked));
    }
  }

  async function toggleCommentLike(commentId: string, currentlyLiked: boolean) {
    if (!session?.user) return;
    const method = currentlyLiked ? "DELETE" : "POST";
    const res = await fetch("/api/social/likes", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType: "comment", targetId: commentId }),
    });
    if (res.ok) await refresh();
  }

  async function onComment(e: FormEvent) {
    e.preventDefault();
    if (!session?.user || !text.trim()) return;
    setBusy(true);
    const res = await fetch("/api/social/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId, body: text.trim() }),
    });
    setBusy(false);
    if (res.ok) {
      setText("");
      await refresh();
    }
  }

  async function onReply(e: FormEvent, parentId: string) {
    e.preventDefault();
    if (!session?.user || !replyText.trim()) return;
    setBusy(true);
    const res = await fetch("/api/social/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetType,
        targetId,
        body: replyText.trim(),
        parentId,
      }),
    });
    setBusy(false);
    if (res.ok) {
      setReplyText("");
      setReplyTo(null);
      await refresh();
    }
  }

  async function share() {
    const url =
      typeof window !== "undefined"
        ? new URL(shareUrl, window.location.origin).toString()
        : shareUrl;
    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, url });
        return;
      }
    } catch {
      /* fall through */
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function CommentItem({
    c,
    nested = false,
  }: {
    c: CommentRow;
    nested?: boolean;
  }) {
    return (
      <li
        className={`social-comment ${nested ? "is-reply" : ""} rounded-[var(--radius)] border border-line/70 bg-bg-elevated/40 px-4 py-3`}
      >
        <Link
          href={`/u/${c.user.username}`}
          className="text-xs text-accent hover:underline"
        >
          @{c.user.username}
        </Link>
        <p className="mt-1 text-sm text-ink">{c.body}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-muted">
          <button
            type="button"
            disabled={!session?.user || busy}
            onClick={() => void toggleCommentLike(c.id, Boolean(c.liked))}
            className={`transition hover:text-accent ${c.liked ? "text-accent" : ""}`}
          >
            ♥ {c.likeCount || 0}
          </button>
          {!nested && session?.user ? (
            <button
              type="button"
              onClick={() => {
                setReplyTo(replyTo === c.id ? null : c.id);
                setReplyText("");
              }}
              className="hover:text-accent"
            >
              {t("reply")}
            </button>
          ) : null}
        </div>

        {replyTo === c.id && (
          <form
            onSubmit={(e) => void onReply(e, c.id)}
            className="mt-3 flex gap-2"
          >
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={t("replyPlaceholder")}
              className="h-9 flex-1 border border-line bg-bg px-3 text-sm outline-none focus:border-teal"
              autoFocus
            />
            <button
              type="submit"
              disabled={busy || !replyText.trim()}
              className="btn-primary !px-3 !py-1.5 text-sm disabled:opacity-40"
            >
              {t("post")}
            </button>
          </form>
        )}

        {c.replies?.length ? (
          <ul className="mt-3 space-y-2 border-s border-line ps-3">
            {c.replies.map((r) => (
              <CommentItem key={r.id} c={r} nested />
            ))}
          </ul>
        ) : null}
      </li>
    );
  }

  return (
    <section className="mt-10 border-t border-line pt-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy || !session?.user}
          onClick={() => void toggleLike()}
          className={`inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm transition ${
            liked
              ? "border-accent/50 bg-accent/15 text-accent"
              : "border-line text-ink-muted hover:border-teal/40 hover:text-ink"
          }`}
        >
          ♥ {count}
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 items-center rounded-full border border-line px-3.5 text-sm text-ink-muted hover:border-teal/40 hover:text-ink"
        >
          {t("comments")} ({comments.length})
        </button>
        <button
          type="button"
          onClick={() => void share()}
          className="inline-flex h-9 items-center rounded-full border border-line px-3.5 text-sm text-ink-muted hover:border-teal/40 hover:text-ink"
        >
          {copied ? t("copied") : t("share")}
        </button>
      </div>

      {open ? (
        <div className="mt-5 space-y-4">
          {session?.user ? (
            <form onSubmit={onComment} className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("placeholder")}
                className="h-10 flex-1 rounded-[var(--radius)] border border-line bg-bg-elevated/50 px-3 text-sm outline-none focus:border-teal"
              />
              <button
                type="submit"
                disabled={busy || !text.trim()}
                className="btn-primary btn-compact"
              >
                {t("post")}
              </button>
            </form>
          ) : (
            <p className="text-sm text-ink-muted">{t("loginToInteract")}</p>
          )}
          <ul className="space-y-3">
            {comments.map((c) => (
              <CommentItem key={c.id} c={c} />
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
