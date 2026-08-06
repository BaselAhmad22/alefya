export type ChatSender = { id: string; username: string };

export type ChatAttachment = {
  url: string;
  mime: string;
  name: string;
  size: number | null;
};

export type ChatReplyPreview = {
  id: string;
  body: string;
  deletedAt: Date | string | null;
  sender: ChatSender;
  attachment?: ChatAttachment | null;
};

export type ChatEditEntry = {
  id: string;
  body: string;
  createdAt: Date | string;
};

export type ChatReaction = {
  emoji: string;
  count: number;
  me: boolean;
  userIds?: string[];
};

export const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"] as const;

/** Curated emoji set for the in-app picker (compose + react). */
export const EMOJI_PICKER_SET = [
  // smileys
  "😀",
  "😁",
  "😂",
  "🤣",
  "😊",
  "😍",
  "🤩",
  "😘",
  "😜",
  "🤪",
  "🤗",
  "🤔",
  "😏",
  "😌",
  "😴",
  "😷",
  "🤒",
  "🤢",
  "🥵",
  "🥶",
  "😎",
  "🤓",
  "🧐",
  "😕",
  "😟",
  "😮",
  "😲",
  "😳",
  "🥺",
  "😢",
  "😭",
  "😤",
  "😠",
  "🤬",
  "😈",
  "💀",
  "👻",
  "👽",
  "🤖",
  "💩",
  // gestures
  "👍",
  "👎",
  "👌",
  "✌️",
  "🤞",
  "🤟",
  "🤘",
  "🤙",
  "👏",
  "🙌",
  "👐",
  "🤝",
  "🙏",
  "💪",
  "🦾",
  "👀",
  "🧠",
  "👄",
  "💋",
  // hearts / love
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "🤎",
  "💔",
  "❣️",
  "💕",
  "💞",
  "💓",
  "💗",
  "💖",
  "💘",
  "💝",
  // celebration / objects
  "🔥",
  "✨",
  "⭐",
  "🌟",
  "💥",
  "💯",
  "🎉",
  "🎊",
  "🎈",
  "🎁",
  "✅",
  "❌",
  "⚠️",
  "📌",
  "📎",
  "🔗",
  "💡",
  "📚",
  "💻",
  "🖥️",
  "📱",
  "⌨️",
  "🖱️",
  "☕",
  "🍕",
  "🍔",
  "🍩",
  "🍪",
  "🎂",
  "🚀",
  "🌈",
  "☀️",
  "🌙",
  "⚡",
  "🌊",
] as const;

export function isValidReactionEmoji(emoji: string): boolean {
  const s = emoji.trim();
  if (!s || s.length > 16) return false;
  if (/\s/.test(s)) return false;
  // Reject plain ASCII words / numbers
  if (/^[\x00-\x7F]+$/.test(s) && !/^[\u{1F300}-\u{1FAFF}]+$/u.test(s)) {
    // allow a few ascii-ish symbols that appear as emoji variants rarely;
    // mainly block "like", "lol", etc.
    if (/^[A-Za-z0-9_]+$/.test(s)) return false;
  }
  return true;
}

export function aggregateReactions(
  reactions: Array<{ emoji: string; userId: string }> | undefined | null,
  viewerId?: string | null,
): ChatReaction[] {
  if (!reactions?.length) return [];
  const map = new Map<string, { count: number; me: boolean; userIds: string[] }>();
  for (const r of reactions) {
    const cur = map.get(r.emoji) || { count: 0, me: false, userIds: [] };
    cur.count += 1;
    cur.userIds.push(r.userId);
    if (viewerId && r.userId === viewerId) cur.me = true;
    map.set(r.emoji, cur);
  }
  return [...map.entries()]
    .map(([emoji, v]) => ({
      emoji,
      count: v.count,
      me: v.me,
      userIds: v.userIds,
    }))
    .sort((a, b) => b.count - a.count || a.emoji.localeCompare(b.emoji));
}

/** Normalize reaction payload for the current viewer (socket broadcasts). */
export function reactionsForViewer(
  reactions: ChatReaction[] | undefined | null,
  viewerId?: string | null,
): ChatReaction[] {
  if (!reactions?.length) return [];
  return reactions.map((r) => ({
    emoji: r.emoji,
    count: r.count,
    me: Boolean(
      r.me || (viewerId && r.userIds?.includes(viewerId)),
    ),
  }));
}

type MapInput = {
  id: string;
  conversationId: string;
  body: string;
  createdAt: Date;
  editedAt?: Date | null;
  deletedAt: Date | null;
  sender: ChatSender;
  attachmentUrl?: string | null;
  attachmentMime?: string | null;
  attachmentName?: string | null;
  attachmentSize?: number | null;
  replyTo?:
    | (ChatReplyPreview & {
        attachmentUrl?: string | null;
        attachmentMime?: string | null;
        attachmentName?: string | null;
        attachmentSize?: number | null;
      })
    | null;
  edits?: ChatEditEntry[];
  reactions?: Array<{ emoji: string; userId: string }>;
};

function mapAttachment(m: {
  attachmentUrl?: string | null;
  attachmentMime?: string | null;
  attachmentName?: string | null;
  attachmentSize?: number | null;
}): ChatAttachment | null {
  if (!m.attachmentUrl) return null;
  return {
    url: m.attachmentUrl,
    mime: m.attachmentMime || "application/octet-stream",
    name: m.attachmentName || "file",
    size: m.attachmentSize ?? null,
  };
}

export function mapChatMessage(m: MapInput, viewerId?: string | null) {
  const deleted = Boolean(m.deletedAt);
  return {
    id: m.id,
    conversationId: m.conversationId,
    body: deleted ? "" : m.body,
    createdAt: m.createdAt,
    editedAt: m.editedAt ?? null,
    deletedAt: m.deletedAt,
    sender: m.sender,
    attachment: deleted ? null : mapAttachment(m),
    replyTo: m.replyTo
      ? {
          id: m.replyTo.id,
          body: m.replyTo.deletedAt ? "" : m.replyTo.body,
          deletedAt: m.replyTo.deletedAt,
          sender: m.replyTo.sender,
          attachment: m.replyTo.deletedAt ? null : mapAttachment(m.replyTo),
        }
      : null,
    edits: (m.edits || []).map((e) => ({
      id: e.id,
      body: e.body,
      createdAt: e.createdAt,
    })),
    reactions: deleted ? [] : aggregateReactions(m.reactions, viewerId),
  };
}

export const messageInclude = {
  sender: { select: { id: true, username: true } },
  edits: { orderBy: { createdAt: "asc" as const } },
  replyTo: {
    include: { sender: { select: { id: true, username: true } } },
  },
  reactions: { select: { emoji: true, userId: true } },
} as const;
