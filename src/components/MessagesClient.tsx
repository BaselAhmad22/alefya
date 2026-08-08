"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { io, Socket } from "socket.io-client";
import { Link } from "@/i18n/routing";
import { ConfirmDialog } from "@/components/ConfirmDialog";
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

type ReplyPreview = {
  id: string;
  body: string;
  deletedAt?: string | null;
  sender: { id: string; username: string };
  attachment?: ChatAttachment | null;
};

type ChatEdit = {
  id: string;
  body: string;
  createdAt: string;
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
  replyTo?: ReplyPreview | null;
  edits?: ChatEdit[];
  reactions?: Array<{
    emoji: string;
    count: number;
    me: boolean;
    userIds?: string[];
  }>;
};

type PendingFile = {
  file: File;
  previewUrl: string | null;
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

function formatDateTime(iso: string, locale: string) {
  try {
    return new Date(iso).toLocaleString(locale, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function formatBytes(n: number | null | undefined) {
  if (!n || n <= 0) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageMime(mime?: string | null) {
  return Boolean(mime && mime.startsWith("image/"));
}

function previewText(
  body: string,
  deleted: boolean,
  deletedLabel: string,
  attachment?: ChatAttachment | null,
  photoLabel?: string,
  fileLabel?: string,
) {
  if (deleted) return deletedLabel;
  const trimmed = body.trim();
  if (trimmed) {
    return trimmed.length <= 72 ? trimmed : `${trimmed.slice(0, 72)}…`;
  }
  if (attachment) {
    if (isImageMime(attachment.mime)) return photoLabel || "Photo";
    return attachment.name || fileLabel || "File";
  }
  return "";
}

export function MessagesClient() {
  const t = useTranslations("messages");
  const locale = useLocale();
  const { data: session } = useSession();
  const search = useSearchParams();
  const initialC = search.get("c");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(initialC);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [peerReadAt, setPeerReadAt] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [live, setLive] = useState(false);
  const [typing, setTyping] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);
  const [busy, setBusy] = useState(false);
  const [paneBusy, setPaneBusy] = useState(false);
  const [paneAnim, setPaneAnim] = useState<"idle" | "out" | "in">("idle");
  const [hideTarget, setHideTarget] = useState<{
    id: string;
    username: string;
  } | null>(null);
  const [hiding, setHiding] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [reactStripOpen, setReactStripOpen] = useState(false);
  const [reactEmojiOpen, setReactEmojiOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<number | null>(null);
  const clearTypingTimer = useRef<number | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const flashTimer = useRef<number | null>(null);
  const animateIdsRef = useRef<Set<string>>(new Set());
  const seedIdsRef = useRef(true);
  const loadReqRef = useRef(0);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);
  const reactMoreRef = useRef<HTMLButtonElement>(null);
  const cacheRef = useRef<
    Map<string, { messages: ChatMessage[]; peerReadAt: string | null }>
  >(new Map());
  const switchTimerRef = useRef<number | null>(null);

  const myId = session?.user?.id;

  const normalizeMessage = useCallback(
    (msg: ChatMessage): ChatMessage => ({
      ...msg,
      reactions: reactionsForViewer(msg.reactions, myId),
    }),
    [myId],
  );

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [conversations, activeId],
  );

  const peerName = useMemo(() => {
    if (!active || !myId) return "";
    return active.members.find((m) => m.id !== myId)?.username || "";
  }, [active, myId]);

  const selectedMsg = useMemo(
    () => messages.find((m) => m.id === selectedId) || null,
    [messages, selectedId],
  );

  const editingMsg = useMemo(
    () => messages.find((m) => m.id === editingId) || null,
    [messages, editingId],
  );

  const historyMsg = useMemo(
    () => messages.find((m) => m.id === historyId) || null,
    [messages, historyId],
  );

  function clearPendingFile() {
    setPendingFile((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
    if (fileRef.current) fileRef.current.value = "";
  }

  async function loadConversations() {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "list" }),
    });
    const data = await res.json().catch(() => ({}));
    setConversations(data.conversations || []);
  }

  async function togglePin(conversationId: string, pinned: boolean) {
    const nextPinned = !pinned;
    setConversations((prev) => {
      const next = prev.map((c) =>
        c.id === conversationId ? { ...c, pinned: nextPinned } : c,
      );
      next.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return 0;
      });
      return next;
    });
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: nextPinned ? "pin" : "unpin",
        conversationId,
      }),
    });
    if (!res.ok) {
      void loadConversations();
      return;
    }
    void loadConversations();
  }

  async function confirmHideConversation() {
    if (!hideTarget) return;
    setHiding(true);
    const id = hideTarget.id;
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "hide", conversationId: id }),
      });
      if (!res.ok) return;
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) {
        setActiveId(null);
        setMessages([]);
        setSelectedId(null);
        setReplyTo(null);
        setEditingId(null);
      }
      setHideTarget(null);
      window.dispatchEvent(new Event("alefya:messages-badge"));
    } finally {
      setHiding(false);
    }
  }

  async function loadMessages(conversationId: string, opts?: { soft?: boolean }) {
    const reqId = ++loadReqRef.current;
    seedIdsRef.current = true;
    animateIdsRef.current = new Set();
    if (!opts?.soft) setPaneBusy(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "messages", conversationId }),
      });
      const data = await res.json().catch(() => ({}));
      // Ignore stale responses from a previous conversation switch.
      if (reqId !== loadReqRef.current) return;
      if (!res.ok || !Array.isArray(data.messages)) {
        return;
      }
      const next = data.messages.map((m: ChatMessage) => normalizeMessage(m));
      const peer = data.peerReadAt || null;
      setMessages(next);
      setPeerReadAt(peer);
      cacheRef.current.set(conversationId, {
        messages: next,
        peerReadAt: peer,
      });
      window.dispatchEvent(new Event("alefya:messages-badge"));
    } catch {
      // Keep current messages on network failure.
    } finally {
      if (reqId === loadReqRef.current) {
        setPaneBusy(false);
        if (!opts?.soft) {
          setPaneAnim((prev) => (prev === "out" ? prev : "in"));
          window.setTimeout(() => {
            if (reqId === loadReqRef.current) {
              seedIdsRef.current = false;
              setPaneAnim("idle");
            }
          }, 280);
        } else {
          window.setTimeout(() => {
            if (reqId === loadReqRef.current) seedIdsRef.current = false;
          }, 80);
        }
      }
    }
  }

  function selectConversation(nextId: string) {
    if (nextId === activeId) return;
    if (switchTimerRef.current) {
      window.clearTimeout(switchTimerRef.current);
      switchTimerRef.current = null;
    }

    setPaneAnim("out");
    setTyping(false);
    setSelectedId(null);
    setReplyTo(null);
    setEditingId(null);
    setHistoryId(null);
    setReactStripOpen(false);
    setReactEmojiOpen(false);
    setEmojiOpen(false);
    setFlashId(null);
    setText("");
    clearPendingFile();

    switchTimerRef.current = window.setTimeout(() => {
      switchTimerRef.current = null;
      const cached = cacheRef.current.get(nextId);
      if (cached) {
        setMessages(cached.messages);
        setPeerReadAt(cached.peerReadAt);
        setPaneBusy(false);
      } else {
        setMessages([]);
        setPeerReadAt(null);
        setPaneBusy(true);
      }
      setPaneAnim("in");
      setActiveId(nextId);
      window.setTimeout(() => setPaneAnim("idle"), 300);
    }, 150);
  }

  useEffect(() => {
    void loadConversations();
    return () => {
      if (switchTimerRef.current) window.clearTimeout(switchTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (initialC) setActiveId(initialC);
  }, [initialC]);

  useEffect(() => {
    if (!activeId) {
      loadReqRef.current += 1;
      setMessages([]);
      setPaneBusy(false);
      setPaneAnim("idle");
      return;
    }
    void loadMessages(activeId, {
      soft: cacheRef.current.has(activeId),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, typing, activeId]);

  useEffect(() => {
    return () => {
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
      if (pendingFile?.previewUrl) URL.revokeObjectURL(pendingFile.previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let s: Socket | null = null;
    let cancelled = false;

    async function connect() {
      const res = await fetch("/api/realtime/token");
      if (!res.ok || cancelled) return;
      const data = await res.json();
      s = io(data.realtimeUrl, {
        auth: { token: data.token },
        transports: ["websocket", "polling"],
      });
      s.on("connect", () => {
        if (!cancelled) setLive(true);
      });
      s.on("disconnect", () => {
        if (!cancelled) setLive(false);
      });
      if (!cancelled) setSocket(s);
    }

    void connect();
    return () => {
      cancelled = true;
      s?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const upsert = (msg: ChatMessage) => {
      const normalized = normalizeMessage(msg);
      setMessages((prev) => {
        const i = prev.findIndex((m) => m.id === normalized.id);
        if (i === -1) return [...prev, normalized];
        const next = [...prev];
        next[i] = { ...next[i], ...normalized };
        return next;
      });
    };

    const onNew = (msg: ChatMessage & { conversationId: string }) => {
      if (msg.conversationId === activeId) {
        if (!seedIdsRef.current) {
          animateIdsRef.current.add(msg.id);
          window.setTimeout(() => {
            animateIdsRef.current.delete(msg.id);
          }, 600);
        }
        setMessages((prev) =>
          prev.some((m) => m.id === msg.id)
            ? prev
            : [...prev, normalizeMessage(msg)],
        );
        setTyping(false);
        socket.emit("message:read", { conversationId: activeId });
      }
      void loadConversations();
    };

    const onEdited = (msg: ChatMessage & { conversationId: string }) => {
      if (msg.conversationId === activeId) upsert(msg);
      void loadConversations();
    };

    const onDeleted = (msg: ChatMessage & { conversationId: string }) => {
      if (msg.conversationId === activeId) {
        upsert(msg);
        setSelectedId((id) => (id === msg.id ? null : id));
        setEditingId((id) => (id === msg.id ? null : id));
        setReplyTo((r) => (r?.id === msg.id ? null : r));
        setReactStripOpen(false);
        setReactEmojiOpen(false);
      }
      void loadConversations();
    };

    const onReaction = (payload: {
      messageId: string;
      conversationId: string;
      reactions: ChatMessage["reactions"];
    }) => {
      if (payload.conversationId !== activeId) return;
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
      if (payload.conversationId !== activeId || payload.userId === myId) return;
      setTyping(true);
      if (clearTypingTimer.current) window.clearTimeout(clearTypingTimer.current);
      clearTypingTimer.current = window.setTimeout(() => setTyping(false), 1800);
    };

    const onRead = (payload: {
      conversationId: string;
      userId: string;
      lastReadAt: string;
    }) => {
      if (payload.conversationId !== activeId || payload.userId === myId) return;
      setPeerReadAt(payload.lastReadAt);
    };

    socket.on("message:new", onNew);
    socket.on("message:edited", onEdited);
    socket.on("message:deleted", onDeleted);
    socket.on("message:reaction", onReaction);
    socket.on("typing", onTyping);
    socket.on("message:read", onRead);

    return () => {
      socket.off("message:new", onNew);
      socket.off("message:edited", onEdited);
      socket.off("message:deleted", onDeleted);
      socket.off("message:reaction", onReaction);
      socket.off("typing", onTyping);
      socket.off("message:read", onRead);
    };
  }, [socket, activeId, myId, normalizeMessage]);

  useEffect(() => {
    if (!socket) return;
    if (activeId) {
      socket.emit("conversation:join", { conversationId: activeId });
      socket.emit("message:read", { conversationId: activeId });
      return () => {
        socket.emit("conversation:leave", { conversationId: activeId });
      };
    }
  }, [socket, activeId]);

  function emitTyping() {
    if (!socket?.connected || !activeId) return;
    if (typingTimer.current) return;
    socket.emit("typing", { conversationId: activeId });
    typingTimer.current = window.setTimeout(() => {
      typingTimer.current = null;
    }, 900);
  }

  function clearLongPress() {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  function promoteSelectionToReply() {
    if (editingId || replyTo || !selectedMsg || selectedMsg.deletedAt) return;
    setReplyTo(selectedMsg);
    setSelectedId(null);
    setHistoryId(null);
  }

  function startReply(m: ChatMessage) {
    if (m.deletedAt) return;
    setReplyTo(m);
    setSelectedId(null);
    setEditingId(null);
    setHistoryId(null);
    setReactStripOpen(false);
    setReactEmojiOpen(false);
    window.setTimeout(() => inputRef.current?.focus(), 40);
  }

  function startEdit(m: ChatMessage) {
    if (m.sender.id !== myId || m.deletedAt) return;
    setEditingId(m.id);
    setText(m.body);
    setSelectedId(null);
    setReplyTo(null);
    setHistoryId(null);
    setReactStripOpen(false);
    setReactEmojiOpen(false);
    clearPendingFile();
    window.setTimeout(() => inputRef.current?.focus(), 40);
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

    // Optimistic toggle
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const list = [...(m.reactions || [])];
        const mine = list.find((r) => r.me);
        if (mine?.emoji === emoji) {
          const next = list
            .map((r) =>
              r.emoji === emoji
                ? { ...r, count: r.count - 1, me: false }
                : r,
            )
            .filter((r) => r.count > 0);
          return { ...m, reactions: next };
        }
        let next = list.map((r) => {
          if (r.me) return { ...r, count: r.count - 1, me: false };
          return r;
        }).filter((r) => r.count > 0);
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

    if (socket?.connected) {
      socket.emit("message:react", { messageId, emoji });
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

  function cancelComposeModes() {
    setEditingId(null);
    setReplyTo(null);
    setText("");
    clearPendingFile();
  }

  function onComposerChange(value: string) {
    setText(value);
    if (!editingId) {
      if (value.trim().length > 0) promoteSelectionToReply();
      emitTyping();
    }
  }

  function onPickFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    if (editingId) return;
    if (file.size > 8 * 1024 * 1024) {
      window.alert(t("fileTooLarge"));
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    promoteSelectionToReply();
    setPendingFile((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return {
        file,
        previewUrl: isImageMime(file.type) ? URL.createObjectURL(file) : null,
      };
    });
  }

  async function uploadFile(file: File) {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload/chat", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "upload_failed");
    }
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

    if (editingId) {
      if (!text.trim()) return;
      const body = text.trim();
      setBusy(true);
      if (socket?.connected) {
        socket.emit("message:edit", { messageId: editingId, body });
        setEditingId(null);
        setText("");
        setEmojiOpen(false);
        setBusy(false);
        return;
      }
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "edit", messageId: editingId, body }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.message) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === editingId ? normalizeMessage(data.message) : m,
          ),
        );
        void loadConversations();
      }
      setEditingId(null);
      setText("");
      setEmojiOpen(false);
      setBusy(false);
      return;
    }

    const body = text.trim();
    if (!body && !pendingFile) return;

    // Selected message without explicit reply button still counts as reply.
    const effectiveReply =
      replyTo ||
      (selectedMsg && !selectedMsg.deletedAt ? selectedMsg : null);
    const replyToId = effectiveReply?.id;

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

      setText("");
      setReplyTo(null);
      setSelectedId(null);
      setEmojiOpen(false);
      clearPendingFile();

      const payload = {
        conversationId: activeId,
        body,
        replyToId,
        ...(attachment || {}),
      };

      if (socket?.connected) {
        socket.emit("message:send", payload);
      } else {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "send", ...payload }),
        });
        const data = await res.json().catch(() => ({}));
        if (data.message) {
          animateIdsRef.current.add(data.message.id);
          setMessages((prev) => [...prev, normalizeMessage(data.message)]);
          void loadConversations();
        }
      }
    } catch {
      window.alert(t("uploadFailed"));
    } finally {
      setBusy(false);
    }
  }

  async function deleteSelected() {
    if (!selectedId) return;
    const messageId = selectedId;
    setBusy(true);
    if (socket?.connected) {
      socket.emit("message:delete", { messageId });
      setSelectedId(null);
      setBusy(false);
      return;
    }
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", messageId }),
    });
    const data = await res.json().catch(() => ({}));
    if (data.message) {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? data.message : m)),
      );
      void loadConversations();
    }
    setSelectedId(null);
    setBusy(false);
  }

  function isReadByPeer(m: ChatMessage) {
    if (!peerReadAt || m.sender.id !== myId || m.deletedAt) return false;
    return new Date(peerReadAt).getTime() >= new Date(m.createdAt).getTime();
  }

  function trySelect(m: ChatMessage) {
    if (m.deletedAt) return;
    setSelectedId((id) => (id === m.id ? null : m.id));
    setHistoryId(null);
  }

  function scrollToMessage(id: string) {
    const el = document.getElementById(`chat-msg-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    setFlashId(null);
    // Force reflow so re-triggering the same id still animates.
    window.requestAnimationFrame(() => {
      setFlashId(id);
      flashTimer.current = window.setTimeout(() => setFlashId(null), 1600);
    });
  }

  const historyVersions = useMemo(() => {
    if (!historyMsg) return [];
    const edits = historyMsg.edits || [];
    const versions: { key: string; body: string; at: string; current?: boolean }[] =
      edits.map((e, i) => ({
        key: e.id,
        body: e.body,
        at: i === 0 ? historyMsg.createdAt : edits[i - 1].createdAt,
      }));
    versions.push({
      key: "current",
      body: historyMsg.body,
      at: historyMsg.editedAt || historyMsg.createdAt,
      current: true,
    });
    return versions;
  }, [historyMsg]);

  const canSend = Boolean(text.trim() || pendingFile) && !busy;

  return (
    <div className="chat-shell">
      <aside className="chat-sidebar">
        <div className="chat-sidebar-head">
          <p className="chat-sidebar-kicker">AlefYa</p>
          <div className="chat-sidebar-head-row">
            <p className="chat-sidebar-title">{t("chats")}</p>
            {conversations.length > 0 ? (
              <span className="chat-sidebar-count">{conversations.length}</span>
            ) : null}
          </div>
        </div>
        {conversations.length === 0 ? (
          <div className="chat-empty-side">
            <p className="chat-empty-side-title">{t("empty")}</p>
          </div>
        ) : (
          <ul className="chat-conv-list chat-scroll">
            {conversations.map((c) => {
              const name =
                c.members.find((m) => m.id !== myId)?.username || "chat";
              const preview = c.lastMessage?.deleted
                ? t("deleted")
                : c.lastMessage?.body ||
                  (c.lastMessage?.attachment ? t("attachment") : t("noMessages"));
              return (
                <li key={c.id} className="chat-conv-row">
                  <button
                    type="button"
                    data-no-loader
                    onClick={() => selectConversation(c.id)}
                    className={`chat-conv ${activeId === c.id ? "is-active" : ""} ${c.pinned ? "is-pinned" : ""}`}
                  >
                    <span className="chat-avatar" aria-hidden>
                      {name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="chat-conv-body">
                      <span className="chat-conv-top">
                        <span className="chat-conv-name">
                          {c.pinned ? (
                            <span className="chat-pin-mark" aria-hidden>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                              </svg>
                            </span>
                          ) : null}
                          @{name}
                        </span>
                        {c.lastMessage ? (
                          <span className="chat-conv-time">
                            {formatTime(c.lastMessage.createdAt, locale)}
                          </span>
                        ) : null}
                      </span>
                      <span className="chat-conv-preview">
                        {preview}
                        {c.unread ? (
                          <span className="chat-unread-dot" aria-hidden />
                        ) : null}
                      </span>
                    </span>
                  </button>
                  <div className="chat-conv-actions" role="group" aria-label={t("chatActions")}>
                    <button
                      type="button"
                      data-no-loader
                      className={`chat-conv-action is-pin ${c.pinned ? "is-on" : ""}`}
                      title={c.pinned ? t("unpin") : t("pin")}
                      aria-label={c.pinned ? t("unpin") : t("pin")}
                      aria-pressed={Boolean(c.pinned)}
                      onClick={(e) => {
                        e.stopPropagation();
                        void togglePin(c.id, Boolean(c.pinned));
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      data-no-loader
                      className="chat-conv-action is-danger"
                      title={t("deleteChat")}
                      aria-label={t("deleteChat")}
                      onClick={(e) => {
                        e.stopPropagation();
                        setHideTarget({ id: c.id, username: name });
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path
                          d="M5 7h14M10 11v6M14 11v6M8 7V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12"
                          stroke="currentColor"
                          strokeWidth="1.65"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      <section className="chat-main">
        <header className="chat-main-head">
          <div className="chat-main-head-copy">
            {peerName ? (
              <span className="chat-avatar chat-peer-avatar" aria-hidden>
                {peerName.slice(0, 1).toUpperCase()}
              </span>
            ) : null}
            <div className="chat-main-head-text">
              <p className="chat-peer">
                {peerName ? (
                  <Link href={`/u/${peerName}`}>@{peerName}</Link>
                ) : (
                  t("select")
                )}
              </p>
              <p className="chat-status">
                {typing ? (
                  <span className="chat-typing-label">{t("typing")}</span>
                ) : live ? (
                  t("online")
                ) : (
                  t("connecting")
                )}
              </p>
            </div>
          </div>
          <span className={`chat-live-dot ${live ? "is-on" : ""}`} aria-hidden />
        </header>

        <div
          ref={scrollerRef}
          className={`chat-thread chat-scroll ${paneAnim === "out" ? "is-pane-out" : ""} ${paneAnim === "in" ? "is-pane-in" : ""} ${paneBusy ? "is-pane-busy" : ""}`}
          onClick={() => {
            if (selectedId) setSelectedId(null);
          }}
        >
          {paneBusy && messages.length === 0 ? (
            <div className="chat-thread-skeleton" aria-busy="true" aria-label={t("loadingMessages")}>
              <div className="chat-skel-line is-theirs" />
              <div className="chat-skel-line is-mine" />
              <div className="chat-skel-line is-theirs is-short" />
              <div className="chat-skel-line is-mine is-short" />
              <p className="chat-skel-label">{t("loadingMessages")}</p>
            </div>
          ) : !activeId ? (
            <div className="chat-thread-empty">
              <p className="chat-thread-empty-kicker">AlefYa</p>
              <p className="chat-thread-empty-title">{t("select")}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="chat-thread-empty">
              <p className="chat-thread-empty-kicker">@{peerName}</p>
              <p className="chat-thread-empty-title">{t("startChat")}</p>
            </div>
          ) : (
            messages.map((m) => {
              const mine = m.sender.id === myId;
              const deleted = Boolean(m.deletedAt);
              const selected = selectedId === m.id;
              const flashing = flashId === m.id;
              const animateIn = animateIdsRef.current.has(m.id);
              const hasEdits = Boolean(m.editedAt);
              return (
                <div
                  key={m.id}
                  id={`chat-msg-${m.id}`}
                  className={`chat-bubble-row ${mine ? "is-mine" : "is-theirs"} ${selected ? "is-selected" : ""} ${flashing ? "is-flash" : ""} ${animateIn ? "is-enter" : ""}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={`chat-bubble ${mine ? "is-mine" : "is-theirs"} ${deleted ? "is-deleted" : ""} ${selected ? "is-selected" : ""} ${flashing ? "is-flash" : ""}`}
                    role="button"
                    tabIndex={deleted ? -1 : 0}
                    onClick={() => trySelect(m)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        trySelect(m);
                      }
                    }}
                    onPointerDown={() => {
                      if (deleted) return;
                      clearLongPress();
                      longPressTimer.current = window.setTimeout(() => {
                        setSelectedId(m.id);
                      }, 420);
                    }}
                    onPointerUp={clearLongPress}
                    onPointerLeave={clearLongPress}
                    onPointerCancel={clearLongPress}
                  >
                    {m.replyTo ? (
                      <button
                        type="button"
                        className="chat-quote"
                        onClick={(e) => {
                          e.stopPropagation();
                          scrollToMessage(m.replyTo!.id);
                        }}
                      >
                        <span className="chat-quote-bar" aria-hidden />
                        <span className="chat-quote-body">
                          <span className="chat-quote-name">
                            @{m.replyTo.sender.username}
                          </span>
                          <span className="chat-quote-text">
                            {previewText(
                              m.replyTo.body,
                              Boolean(m.replyTo.deletedAt),
                              t("deleted"),
                              m.replyTo.attachment,
                              t("photo"),
                              t("file"),
                            )}
                          </span>
                        </span>
                      </button>
                    ) : null}

                    {deleted ? (
                      <p className="chat-deleted">{t("deleted")}</p>
                    ) : (
                      <>
                        {m.attachment ? (
                          isImageMime(m.attachment.mime) ? (
                            <a
                              href={m.attachment.url}
                              target="_blank"
                              rel="noreferrer"
                              className="chat-attach-image-wrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={m.attachment.url}
                                alt={m.attachment.name}
                                className="chat-attach-image"
                              />
                            </a>
                          ) : (
                            <a
                              href={m.attachment.url}
                              target="_blank"
                              rel="noreferrer"
                              className="chat-attach-file"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="chat-attach-file-icon" aria-hidden>
                                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                                  <path
                                    d="M15.2 8.2 8.05 15.35a3.6 3.6 0 0 1-5.1-5.1l7.4-7.4a2.4 2.4 0 1 1 3.4 3.4L6.4 13.55a1.2 1.2 0 1 1-1.7-1.7l6.55-6.55"
                                    stroke="currentColor"
                                    strokeWidth="1.4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                              <span className="chat-attach-file-meta">
                                <span className="chat-attach-file-name">
                                  {m.attachment.name}
                                </span>
                                <span className="chat-attach-file-size">
                                  {formatBytes(m.attachment.size)}
                                </span>
                              </span>
                            </a>
                          )
                        ) : null}
                        {m.body ? <p className="chat-text">{m.body}</p> : null}
                      </>
                    )}

                    <div className="chat-meta">
                      {hasEdits && !deleted ? (
                        <button
                          type="button"
                          className="chat-edited"
                          onClick={(e) => {
                            e.stopPropagation();
                            setHistoryId((id) => (id === m.id ? null : m.id));
                            setSelectedId(null);
                          }}
                        >
                          {t("edited")}
                        </button>
                      ) : null}
                      <span>{formatTime(m.createdAt, locale)}</span>
                      {mine && !deleted ? (
                        <span
                          className={`chat-ticks ${isReadByPeer(m) ? "is-read" : ""}`}
                          aria-label={isReadByPeer(m) ? t("read") : t("sent")}
                        >
                          {isReadByPeer(m) ? "✓✓" : "✓"}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {!deleted ? (
                    <MessageReactionChips
                      reactions={m.reactions || []}
                      onToggle={(emoji) => void reactToMessage(m.id, emoji)}
                    />
                  ) : null}
                </div>
              );
            })
          )}
          {typing && activeId ? (
            <div className="chat-bubble-row is-theirs">
              <div className="chat-bubble is-theirs chat-typing-bubble">
                <span />
                <span />
                <span />
              </div>
            </div>
          ) : null}
        </div>

        {historyMsg && !historyMsg.deletedAt ? (
          <div className="chat-history" role="dialog" aria-label={t("editHistory")}>
            <div className="chat-history-head">
              <p className="chat-history-title">{t("editHistory")}</p>
              <button
                type="button"
                className="chat-history-close"
                onClick={() => setHistoryId(null)}
              >
                {t("close")}
              </button>
            </div>
            <ol className="chat-history-list chat-scroll">
              {historyVersions.map((v, i) => (
                <li
                  key={v.key}
                  className={`chat-history-item ${v.current ? "is-current" : ""}`}
                >
                  <div className="chat-history-meta">
                    <span>
                      {v.current
                        ? t("currentVersion")
                        : t("version", { n: i + 1 })}
                    </span>
                    <span>{formatDateTime(v.at, locale)}</span>
                  </div>
                  <p className="chat-history-body">{v.body}</p>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {selectedMsg && !selectedMsg.deletedAt ? (
          <div className="chat-select-bar" role="toolbar" aria-label={t("actions")}>
            {(reactStripOpen || reactEmojiOpen) && (
              <div className="chat-react-panel">
                <QuickReactStrip
                  onPick={(emoji) => {
                    void reactToMessage(selectedMsg.id, emoji);
                    setReactStripOpen(false);
                    setReactEmojiOpen(false);
                    setSelectedId(null);
                  }}
                  onMore={() => {
                    setReactEmojiOpen((open) => {
                      if (open) {
                        setReactStripOpen(true);
                        return false;
                      }
                      setReactStripOpen(false);
                      return true;
                    });
                  }}
                  moreOpen={reactEmojiOpen}
                  moreRef={reactMoreRef}
                  moreLabel={t("moreEmojis")}
                />
                <EmojiPicker
                  open={reactEmojiOpen}
                  onClose={() => setReactEmojiOpen(false)}
                  anchorRef={reactMoreRef}
                  onPick={(emoji) => {
                    void reactToMessage(selectedMsg.id, emoji);
                    setReactEmojiOpen(false);
                    setReactStripOpen(false);
                    setSelectedId(null);
                  }}
                  className="is-react"
                />
              </div>
            )}
            <p className="chat-select-label">{t("selected")}</p>
            <div className="chat-select-actions">
              <button
                type="button"
                className="chat-select-cancel"
                onClick={() => {
                  setSelectedId(null);
                  setReactStripOpen(false);
                  setReactEmojiOpen(false);
                }}
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                className="chat-select-react"
                onClick={() => {
                  setReactStripOpen((v) => !v);
                  setReactEmojiOpen(false);
                }}
              >
                {t("react")}
              </button>
              <button
                type="button"
                className="chat-select-reply"
                onClick={() => startReply(selectedMsg)}
              >
                {t("reply")}
              </button>
              {selectedMsg.sender.id === myId ? (
                <>
                  <button
                    type="button"
                    className="chat-select-edit"
                    onClick={() => startEdit(selectedMsg)}
                  >
                    {t("edit")}
                  </button>
                  <button
                    type="button"
                    className="chat-select-delete"
                    disabled={busy}
                    onClick={() => void deleteSelected()}
                  >
                    {busy ? t("deleting") : t("delete")}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        {activeId ? (
          <form onSubmit={onSend} className="chat-composer">
            {editingMsg ? (
              <div className="chat-compose-banner is-edit">
                <div className="chat-compose-banner-copy">
                  <p className="chat-compose-banner-label">{t("editing")}</p>
                  <p className="chat-compose-banner-text">
                    {previewText(editingMsg.body, false, t("deleted"))}
                  </p>
                </div>
                <button
                  type="button"
                  className="chat-compose-banner-x"
                  aria-label={t("cancel")}
                  onClick={cancelComposeModes}
                >
                  ×
                </button>
              </div>
            ) : replyTo ? (
              <div className="chat-compose-banner is-reply">
                <div className="chat-compose-banner-copy">
                  <p className="chat-compose-banner-label">
                    {t("replyingTo", { name: replyTo.sender.username })}
                  </p>
                  <p className="chat-compose-banner-text">
                    {previewText(
                      replyTo.body,
                      Boolean(replyTo.deletedAt),
                      t("deleted"),
                      replyTo.attachment,
                      t("photo"),
                      t("file"),
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  className="chat-compose-banner-x"
                  aria-label={t("cancelReply")}
                  onClick={() => setReplyTo(null)}
                >
                  ×
                </button>
              </div>
            ) : null}

            {pendingFile ? (
              <div className="chat-attach-preview">
                {pendingFile.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={pendingFile.previewUrl}
                    alt=""
                    className="chat-attach-preview-img"
                  />
                ) : (
                  <span className="chat-attach-preview-file">
                    {pendingFile.file.name}
                  </span>
                )}
                <button
                  type="button"
                  className="chat-compose-banner-x"
                  aria-label={t("removeAttachment")}
                  onClick={clearPendingFile}
                >
                  ×
                </button>
              </div>
            ) : null}

            <div className="chat-composer-wrap">
              <EmojiPicker
                open={emojiOpen}
                onClose={() => setEmojiOpen(false)}
                anchorRef={emojiBtnRef}
                onPick={(emoji) => {
                  insertEmoji(emoji);
                }}
              />
              <div className="chat-composer-row">
                <input
                  ref={fileRef}
                  type="file"
                  className="sr-only"
                  accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,text/plain,application/zip,.zip"
                  onChange={(e) => onPickFile(e.target.files)}
                />
                <button
                  type="button"
                  className="chat-attach-btn"
                  disabled={Boolean(editingId) || busy}
                  aria-label={t("attach")}
                  onClick={() => fileRef.current?.click()}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path
                      d="M15.2 8.2 8.05 15.35a3.6 3.6 0 0 1-5.1-5.1l7.4-7.4a2.4 2.4 0 1 1 3.4 3.4L6.4 13.55a1.2 1.2 0 1 1-1.7-1.7l6.55-6.55"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  ref={emojiBtnRef}
                  type="button"
                  className={`chat-emoji-btn ${emojiOpen ? "is-open" : ""}`}
                  aria-label={t("emoji")}
                  aria-expanded={emojiOpen}
                  data-no-loader
                  onClick={() => setEmojiOpen((v) => !v)}
                >
                  <span aria-hidden>😊</span>
                </button>
                <input
                  ref={inputRef}
                  value={text}
                  onChange={(e) => onComposerChange(e.target.value)}
                  placeholder={
                    editingId ? t("editPlaceholder") : t("placeholder")
                  }
                  className="chat-input"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!canSend || (Boolean(editingId) && !text.trim())}
                  className="chat-send"
                  aria-label={editingId ? t("save") : t("send")}
                >
                  {busy && pendingFile
                    ? t("uploading")
                    : editingId
                      ? t("save")
                      : t("send")}
                </button>
              </div>
            </div>
          </form>
        ) : null}
      </section>

      <ConfirmDialog
        open={Boolean(hideTarget)}
        title={t("deleteChatTitle")}
        description={t("deleteChatDesc")}
        confirmLabel={t("deleteChatConfirm")}
        cancelLabel={t("cancel")}
        username={hideTarget?.username}
        busy={hiding}
        onCancel={() => {
          if (hiding) return;
          setHideTarget(null);
        }}
        onConfirm={() => void confirmHideConversation()}
      />
    </div>
  );
}
