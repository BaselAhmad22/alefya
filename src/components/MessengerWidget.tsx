"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useRealtimeSocket } from "@/hooks/useRealtimeSocket";
import type { Socket } from "socket.io-client";
import { EmojiPicker } from "@/components/EmojiPicker";
import {
  MessageReactionChips,
  QuickReactStrip,
} from "@/components/MessageReactions";
import { reactionsForViewer } from "@/lib/chat-message";

type Conversation = {
  id: string;
  members: { id: string; username: string; lastReadAt?: string | null }[];
  lastMessage: {
    body: string | null;
    deleted?: boolean;
    attachment?: boolean;
    createdAt: string;
    senderId?: string;
  } | null;
  unread?: number;
  pinned?: boolean;
};

type ChatAttachment = {
  url: string;
  mime: string;
  name: string;
  size: number | null;
};

type ChatMessage = {
  id: string;
  conversationId?: string;
  body: string;
  createdAt: string;
  editedAt?: string | null;
  deletedAt?: string | null;
  sender: { id: string; username: string };
  attachment?: ChatAttachment | null;
  reactions?: Array<{
    emoji: string;
    count: number;
    me: boolean;
    userIds?: string[];
  }>;
};

function formatTime(iso: string, locale: string) {
  try {
    return new Date(iso).toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function isImageMime(mime?: string | null) {
  return Boolean(mime && mime.startsWith("image/"));
}

function previewText(
  body: string | null | undefined,
  deleted: boolean | undefined,
  deletedLabel: string,
  hasAttachment: boolean,
  photoLabel: string,
  fileLabel: string,
) {
  if (deleted) return deletedLabel;
  const trimmed = (body || "").trim();
  if (trimmed) {
    return trimmed.length <= 56 ? trimmed : `${trimmed.slice(0, 56)}…`;
  }
  if (hasAttachment) return photoLabel || fileLabel;
  return "";
}

/**
 * Facebook-style floating messenger dock.
 * Full /messages page remains available via nav + "Open full" link.
 */
export function MessengerWidget() {
  const t = useTranslations("messages");
  const locale = useLocale();
  const pathname = usePathname();
  const { data: session } = useSession();
  const myId = session?.user?.id;

  const onMessagesPage =
    pathname === "/messages" || Boolean(pathname?.startsWith("/messages/"));

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<"list" | "chat">("list");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [pendingFile, setPendingFile] = useState<{
    file: File;
    previewUrl: string | null;
  } | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [reactForId, setReactForId] = useState<string | null>(null);

  const { socket, live } = useRealtimeSocket();
  const socketRef = useRef<Socket | null>(null);
  socketRef.current = socket;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<number | null>(null);
  const clearTypingTimer = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const loadReqRef = useRef(0);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [conversations, activeId],
  );

  const peerName = useMemo(() => {
    if (!active || !myId) return "";
    return active.members.find((m) => m.id !== myId)?.username || "";
  }, [active, myId]);

  const loadUnread = useCallback(async () => {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unread-count" }),
    });
    if (!res.ok) return;
    const data = await res.json().catch(() => ({}));
    setUnreadTotal(Number(data.unreadMessages) || 0);
  }, []);

  const loadConversations = useCallback(async () => {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "list" }),
    });
    const data = await res.json().catch(() => ({}));
    setConversations(data.conversations || []);
  }, []);

  const loadMessages = useCallback(
    async (conversationId: string) => {
      const reqId = ++loadReqRef.current;
      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "messages", conversationId }),
        });
        const data = await res.json().catch(() => ({}));
        if (reqId !== loadReqRef.current) return;
        if (!res.ok || !Array.isArray(data.messages)) return;
        setMessages(
          data.messages.map((m: ChatMessage) => ({
            ...m,
            reactions: reactionsForViewer(m.reactions, myId),
          })),
        );
        window.dispatchEvent(new Event("alefya:messages-badge"));
        void loadUnread();
      } catch {
        // Keep current thread on failure.
      }
    },
    [loadUnread, myId],
  );

  function clearPendingFile() {
    setPendingFile((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
    if (fileRef.current) fileRef.current.value = "";
  }

  function openPanel(conversationId?: string) {
    setOpen(true);
    window.requestAnimationFrame(() => setVisible(true));
    if (conversationId) {
      setActiveId(conversationId);
      setView("chat");
    }
  }

  function closePanel() {
    loadReqRef.current += 1;
    setVisible(false);
    window.setTimeout(() => {
      setOpen(false);
      setView("list");
      setActiveId(null);
      setMessages([]);
      setText("");
      setReactForId(null);
      setEmojiOpen(false);
      clearPendingFile();
    }, 180);
  }

  function minimizeToList() {
    loadReqRef.current += 1;
    setView("list");
    setActiveId(null);
    setMessages([]);
    setText("");
    setReactForId(null);
    setEmojiOpen(false);
    clearPendingFile();
  }

  useEffect(() => {
    if (!myId || onMessagesPage) {
      setOpen(false);
      setVisible(false);
      return;
    }
    void loadUnread();
    const id = window.setInterval(() => void loadUnread(), 30000);
    return () => window.clearInterval(id);
  }, [myId, onMessagesPage, loadUnread]);

  useEffect(() => {
    const onBadge = () => void loadUnread();
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ conversationId?: string }>).detail;
      openPanel(detail?.conversationId);
    };
    window.addEventListener("alefya:messages-badge", onBadge);
    window.addEventListener("alefya:messenger-open", onOpen as EventListener);
    return () => {
      window.removeEventListener("alefya:messages-badge", onBadge);
      window.removeEventListener(
        "alefya:messenger-open",
        onOpen as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    if (!open || !myId) return;
    void loadConversations();
  }, [open, myId, loadConversations]);

  useEffect(() => {
    if (!open || !activeId) return;
    void loadMessages(activeId);
  }, [open, activeId, loadMessages]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || view !== "chat") return;
    el.scrollTop = el.scrollHeight;
  }, [messages, typing, view, activeId]);

  const activeIdRef = useRef<string | null>(null);
  const openRef = useRef(false);
  activeIdRef.current = activeId;
  openRef.current = open;

  useEffect(() => {
    if (!myId || onMessagesPage || !socket) return;

    const onNew = (msg: ChatMessage & { conversationId: string }) => {
      const currentActive = activeIdRef.current;
      if (msg.conversationId === currentActive && openRef.current) {
        setMessages((prev) =>
          prev.some((m) => m.id === msg.id)
            ? prev
            : [
                ...prev,
                {
                  ...msg,
                  reactions: reactionsForViewer(msg.reactions, myId),
                },
              ],
        );
        setTyping(false);
        socket.emit("message:read", { conversationId: currentActive });
      }
      void loadConversations();
      void loadUnread();
    };
    const onBadge = () => void loadUnread();
    const onDeleted = () => {
      const currentActive = activeIdRef.current;
      if (currentActive && openRef.current) void loadMessages(currentActive);
      void loadConversations();
    };
    const onEdited = (msg: ChatMessage & { conversationId: string }) => {
      if (msg.conversationId === activeIdRef.current && openRef.current) {
        setMessages((prev) => {
          const i = prev.findIndex((m) => m.id === msg.id);
          if (i === -1) return prev;
          const next = [...prev];
          next[i] = {
            ...msg,
            reactions: reactionsForViewer(msg.reactions, myId),
          };
          return next;
        });
      }
      void loadConversations();
    };
    const onReaction = (payload: {
      messageId: string;
      conversationId: string;
      reactions: ChatMessage["reactions"];
    }) => {
      if (
        payload.conversationId !== activeIdRef.current ||
        !openRef.current
      ) {
        return;
      }
      setMessages((prev) =>
        prev.map((m) =>
          m.id === payload.messageId
            ? {
                ...m,
                reactions: reactionsForViewer(payload.reactions, myId),
              }
            : m,
        ),
      );
    };
    const onTyping = (payload: { userId: string; conversationId: string }) => {
      if (
        payload.conversationId !== activeIdRef.current ||
        payload.userId === myId ||
        !openRef.current
      ) {
        return;
      }
      setTyping(true);
      if (clearTypingTimer.current) {
        window.clearTimeout(clearTypingTimer.current);
      }
      clearTypingTimer.current = window.setTimeout(() => setTyping(false), 1800);
    };

    socket.on("message:new", onNew);
    socket.on("messages:badge", onBadge);
    socket.on("message:deleted", onDeleted);
    socket.on("message:edited", onEdited);
    socket.on("message:reaction", onReaction);
    socket.on("typing", onTyping);
    return () => {
      socket.off("message:new", onNew);
      socket.off("messages:badge", onBadge);
      socket.off("message:deleted", onDeleted);
      socket.off("message:edited", onEdited);
      socket.off("message:reaction", onReaction);
      socket.off("typing", onTyping);
    };
  }, [
    myId,
    onMessagesPage,
    socket,
    loadConversations,
    loadMessages,
    loadUnread,
  ]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !activeId || !open) return;
    socket.emit("conversation:join", { conversationId: activeId });
    socket.emit("message:read", { conversationId: activeId });
    return () => {
      socket.emit("conversation:leave", { conversationId: activeId });
    };
  }, [activeId, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (view === "chat") minimizeToList();
        else closePanel();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, view]);

  function emitTyping() {
    const socket = socketRef.current;
    if (!socket?.connected || !activeId) return;
    if (typingTimer.current) return;
    socket.emit("typing", { conversationId: activeId });
    typingTimer.current = window.setTimeout(() => {
      typingTimer.current = null;
    }, 900);
  }

  function insertEmoji(emoji: string) {
    const el = inputRef.current;
    if (!el) {
      setText((prev) => prev + emoji);
      return;
    }
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const next = text.slice(0, start) + emoji + text.slice(end);
    setText(next);
    window.requestAnimationFrame(() => {
      el.focus();
      const caret = start + emoji.length;
      el.setSelectionRange(caret, caret);
    });
  }

  async function reactToMessage(messageId: string, emoji: string) {
    const target = messages.find((m) => m.id === messageId);
    if (!target || target.deletedAt) return;

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const list = [...(m.reactions || [])];
        const mine = list.find((r) => r.me);
        if (mine?.emoji === emoji) {
          return {
            ...m,
            reactions: list
              .map((r) =>
                r.emoji === emoji
                  ? { ...r, count: r.count - 1, me: false }
                  : r,
              )
              .filter((r) => r.count > 0),
          };
        }
        let next = list
          .map((r) => (r.me ? { ...r, count: r.count - 1, me: false } : r))
          .filter((r) => r.count > 0);
        const existing = next.find((r) => r.emoji === emoji);
        if (existing) {
          next = next.map((r) =>
            r.emoji === emoji ? { ...r, count: r.count + 1, me: true } : r,
          );
        } else {
          next = [...next, { emoji, count: 1, me: true }];
        }
        next.sort((a, b) => b.count - a.count || a.emoji.localeCompare(b.emoji));
        return { ...m, reactions: next };
      }),
    );

    const s = socketRef.current;
    if (s?.connected) {
      s.emit("message:react", { messageId, emoji });
      return;
    }
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "react", messageId, emoji }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.reactions) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                reactions: reactionsForViewer(data.reactions, myId),
              }
            : m,
        ),
      );
    }
  }

  async function uploadFile(file: File) {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload/chat", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "upload_failed");
    return data as {
      url: string;
      mime: string;
      name: string;
      size: number;
    };
  }

  async function onSend(e: FormEvent) {
    e.preventDefault();
    if (!activeId || busy) return;
    const body = text.trim();
    if (!body && !pendingFile) return;
    setBusy(true);
    try {
      let attachment:
        | {
            attachmentUrl: string;
            attachmentMime: string;
            attachmentName: string;
            attachmentSize: number;
          }
        | null = null;
      if (pendingFile) {
        const uploaded = await uploadFile(pendingFile.file);
        attachment = {
          attachmentUrl: uploaded.url,
          attachmentMime: uploaded.mime,
          attachmentName: uploaded.name,
          attachmentSize: uploaded.size,
        };
      }
      const payload = {
        conversationId: activeId,
        body,
        ...(attachment || {}),
      };
      setText("");
      setEmojiOpen(false);
      clearPendingFile();

      const socket = socketRef.current;
      if (socket?.connected) {
        socket.emit("message:send", payload);
      } else {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "send", ...payload }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return;
        if (data.message) {
          setMessages((prev) =>
            prev.some((m) => m.id === data.message.id)
              ? prev
              : [...prev, data.message as ChatMessage],
          );
        }
      }
      void loadConversations();
      window.dispatchEvent(new Event("alefya:messages-badge"));
    } catch {
      window.alert(t("uploadFailed"));
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  if (!myId || onMessagesPage) return null;

  return (
    <div className="messenger-dock" dir={locale === "ar" ? "rtl" : "ltr"}>
      {open ? (
        <div
          ref={panelRef}
          className={`messenger-panel ${visible ? "is-open" : ""}`}
          role="dialog"
          aria-label={t("widgetTitle")}
        >
          <header className="messenger-panel-head">
            {view === "chat" ? (
              <button
                type="button"
                className="messenger-icon-btn"
                onClick={minimizeToList}
                aria-label={t("widgetBack")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 6l-6 6 6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ) : (
              <span className="messenger-head-title">{t("widgetTitle")}</span>
            )}
            <div className="messenger-head-main">
              {view === "chat" ? (
                <>
                  <p className="messenger-peer">@{peerName}</p>
                  <p className="messenger-status">
                    {typing
                      ? t("typing")
                      : live
                        ? t("online")
                        : t("connecting")}
                  </p>
                </>
              ) : (
                <p className="messenger-head-sub">{t("widgetSubtitle")}</p>
              )}
            </div>
            <div className="messenger-head-actions">
              <Link
                href={activeId ? `/messages?c=${activeId}` : "/messages"}
                className="messenger-icon-btn"
                title={t("openFull")}
                aria-label={t("openFull")}
                onClick={closePanel}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 4h6v6M10 14l10-10M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <button
                type="button"
                className="messenger-icon-btn"
                onClick={closePanel}
                aria-label={t("close")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </header>

          {view === "list" ? (
            <div className="messenger-list chat-scroll">
              {conversations.length === 0 ? (
                <p className="messenger-empty">{t("empty")}</p>
              ) : (
                conversations.map((c) => {
                  const peer =
                    c.members.find((m) => m.id !== myId)?.username || "?";
                  const preview = previewText(
                    c.lastMessage?.body,
                    c.lastMessage?.deleted,
                    t("deleted"),
                    Boolean(c.lastMessage?.attachment),
                    t("photo"),
                    t("file"),
                  );
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`messenger-conv ${c.unread ? "has-unread" : ""}`}
                      onClick={() => {
                        setActiveId(c.id);
                        setView("chat");
                      }}
                    >
                      <span className="messenger-avatar" aria-hidden>
                        {peer.slice(0, 1).toUpperCase()}
                      </span>
                      <span className="messenger-conv-body">
                        <span className="messenger-conv-top">
                          <span className="messenger-conv-name">@{peer}</span>
                          {c.lastMessage?.createdAt ? (
                            <span className="messenger-conv-time">
                              {formatTime(c.lastMessage.createdAt, locale)}
                            </span>
                          ) : null}
                        </span>
                        <span className="messenger-conv-preview">
                          {preview || t("noMessages")}
                        </span>
                      </span>
                      {c.unread && c.unread > 0 ? (
                        <span className="messenger-unread">
                          {c.unread > 9 ? "9+" : c.unread}
                        </span>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            <>
              <div ref={scrollerRef} className="messenger-thread chat-scroll">
                {messages.length === 0 ? (
                  <p className="messenger-empty">{t("startChat")}</p>
                ) : (
                  messages.map((m) => {
                    const mine = m.sender.id === myId;
                    const deleted = Boolean(m.deletedAt);
                    return (
                      <div
                        key={m.id}
                        className={`messenger-bubble-wrap ${mine ? "is-mine" : "is-theirs"}`}
                      >
                        <div
                          className={`messenger-bubble ${mine ? "is-mine" : "is-theirs"} ${deleted ? "is-deleted" : ""}`}
                          onContextMenu={(e) => {
                            if (deleted) return;
                            e.preventDefault();
                            setReactForId(m.id);
                          }}
                        >
                          {deleted ? (
                            <p className="messenger-bubble-text">
                              {t("deleted")}
                            </p>
                          ) : (
                            <>
                              {m.attachment && isImageMime(m.attachment.mime) ? (
                                <a
                                  href={m.attachment.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="messenger-attach-img-link"
                                  data-leave-ok="true"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={m.attachment.url}
                                    alt={m.attachment.name}
                                    className="messenger-attach-img"
                                  />
                                </a>
                              ) : null}
                              {m.attachment &&
                              !isImageMime(m.attachment.mime) ? (
                                <a
                                  href={m.attachment.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="messenger-attach-file"
                                  data-leave-ok="true"
                                >
                                  {m.attachment.name || t("file")}
                                </a>
                              ) : null}
                              {m.body?.trim() ? (
                                <p className="messenger-bubble-text">{m.body}</p>
                              ) : null}
                              <button
                                type="button"
                                className="messenger-react-affordance"
                                data-no-loader
                                aria-label={t("react")}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReactForId((id) =>
                                    id === m.id ? null : m.id,
                                  );
                                }}
                              >
                                😊
                              </button>
                            </>
                          )}
                          <span className="messenger-bubble-meta">
                            {formatTime(m.createdAt, locale)}
                            {m.editedAt ? ` · ${t("edited")}` : ""}
                          </span>
                        </div>
                        {!deleted && reactForId === m.id ? (
                          <QuickReactStrip
                            className="is-widget"
                            onPick={(emoji) => {
                              void reactToMessage(m.id, emoji);
                              setReactForId(null);
                            }}
                          />
                        ) : null}
                        {!deleted ? (
                          <MessageReactionChips
                            reactions={m.reactions || []}
                            onToggle={(emoji) =>
                              void reactToMessage(m.id, emoji)
                            }
                          />
                        ) : null}
                      </div>
                    );
                  })
                )}
                {typing ? (
                  <p className="messenger-typing">{t("typing")}</p>
                ) : null}
              </div>

              {pendingFile ? (
                <div className="messenger-pending">
                  {pendingFile.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pendingFile.previewUrl} alt="" />
                  ) : (
                    <span>{pendingFile.file.name}</span>
                  )}
                  <button
                    type="button"
                    onClick={clearPendingFile}
                    aria-label={t("removeAttachment")}
                  >
                    ×
                  </button>
                </div>
              ) : null}

              <form className="messenger-composer" onSubmit={onSend}>
                <EmojiPicker
                  open={emojiOpen}
                  onClose={() => setEmojiOpen(false)}
                  anchorRef={emojiBtnRef}
                  onPick={(emoji) => {
                    insertEmoji(emoji);
                  }}
                  className="is-widget"
                />
                <input
                  ref={fileRef}
                  type="file"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 8 * 1024 * 1024) {
                      window.alert(t("fileTooLarge"));
                      e.target.value = "";
                      return;
                    }
                    setPendingFile({
                      file,
                      previewUrl: isImageMime(file.type)
                        ? URL.createObjectURL(file)
                        : null,
                    });
                  }}
                />
                <button
                  type="button"
                  className="messenger-icon-btn"
                  onClick={() => fileRef.current?.click()}
                  aria-label={t("attach")}
                  disabled={busy}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 12.5V17a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h4.5M14 3h7v7M10 14L21 3"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  ref={emojiBtnRef}
                  type="button"
                  className={`messenger-icon-btn ${emojiOpen ? "is-open" : ""}`}
                  aria-label={t("emoji")}
                  aria-expanded={emojiOpen}
                  data-no-loader
                  disabled={busy}
                  onClick={() => setEmojiOpen((v) => !v)}
                >
                  <span aria-hidden>😊</span>
                </button>
                <input
                  ref={inputRef}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    emitTyping();
                  }}
                  placeholder={t("placeholder")}
                  className="messenger-input"
                  disabled={busy}
                />
                <button
                  type="submit"
                  className="messenger-send"
                  disabled={busy || (!text.trim() && !pendingFile)}
                >
                  {busy ? "…" : t("send")}
                </button>
              </form>
            </>
          )}
        </div>
      ) : null}

      <button
        type="button"
        className={`messenger-fab ${open ? "is-open" : ""}`}
        onClick={() => (open ? closePanel() : openPanel())}
        aria-expanded={open}
        aria-label={open ? t("close") : t("widgetOpen")}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H12l-4.5 3.2V16H6.5A2.5 2.5 0 0 1 4 13.5v-7Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {!open && unreadTotal > 0 ? (
          <span className="messenger-fab-badge">
            {unreadTotal > 9 ? "9+" : unreadTotal}
          </span>
        ) : null}
      </button>
    </div>
  );
}
