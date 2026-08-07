/**
 * AlefYa realtime chat — Socket.io server.
 * Run: node server/realtime.mjs
 * Env: PORT | REALTIME_PORT, AUTH_SECRET, DATABASE_URL, REALTIME_CORS_ORIGIN
 */
import { createServer } from "http";
import { Server } from "socket.io";
import { jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";

const port = Number(process.env.PORT || process.env.REALTIME_PORT || 4001);
const corsOrigin = process.env.REALTIME_CORS_ORIGIN || "*";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret",
);
const prisma = new PrismaClient();
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin.includes(",")
      ? corsOrigin.split(",").map((o) => o.trim())
      : corsOrigin,
    methods: ["GET", "POST"],
  },
});

process.on("unhandledRejection", (err) => {
  console.error("[alefya-realtime] unhandledRejection", err);
});
process.on("uncaughtException", (err) => {
  console.error("[alefya-realtime] uncaughtException", err);
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("unauthorized"));
    const { payload } = await jwtVerify(String(token), secret);
    socket.data.userId = String(payload.sub || "");
    socket.data.username = String(payload.username || "user");
    if (!socket.data.userId) return next(new Error("unauthorized"));
    next();
  } catch {
    next(new Error("unauthorized"));
  }
});

const messageInclude = {
  sender: { select: { id: true, username: true } },
  edits: { orderBy: { createdAt: "asc" } },
  replyTo: {
    include: { sender: { select: { id: true, username: true } } },
  },
  reactions: { select: { emoji: true, userId: true } },
};

function isValidReactionEmoji(emoji) {
  const s = String(emoji || "").trim();
  if (!s || s.length > 16) return false;
  if (/\s/.test(s)) return false;
  if (/^[A-Za-z0-9_]+$/.test(s)) return false;
  return true;
}

function aggregateReactions(reactions, viewerId) {
  if (!reactions?.length) return [];
  const map = new Map();
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

function mapMessage(message, viewerId) {
  const deleted = Boolean(message.deletedAt);
  function mapAttachment(m) {
    if (!m?.attachmentUrl) return null;
    return {
      url: m.attachmentUrl,
      mime: m.attachmentMime || "application/octet-stream",
      name: m.attachmentName || "file",
      size: m.attachmentSize ?? null,
    };
  }
  return {
    id: message.id,
    conversationId: message.conversationId,
    body: deleted ? "" : message.body,
    createdAt: message.createdAt,
    editedAt: message.editedAt || null,
    deletedAt: message.deletedAt,
    sender: message.sender,
    attachment: deleted ? null : mapAttachment(message),
    replyTo: message.replyTo
      ? {
          id: message.replyTo.id,
          body: message.replyTo.deletedAt ? "" : message.replyTo.body,
          deletedAt: message.replyTo.deletedAt,
          sender: message.replyTo.sender,
          attachment: message.replyTo.deletedAt
            ? null
            : mapAttachment(message.replyTo),
        }
      : null,
    edits: (message.edits || []).map((e) => ({
      id: e.id,
      body: e.body,
      createdAt: e.createdAt,
    })),
    reactions: deleted
      ? []
      : aggregateReactions(message.reactions, viewerId),
  };
}

async function emitReactionUpdate(conversationId, messageId) {
  const reactions = await prisma.messageReaction.findMany({
    where: { messageId },
    select: { emoji: true, userId: true },
  });
  const members = await prisma.conversationMember.findMany({
    where: { conversationId, hiddenAt: null },
  });
  for (const m of members) {
    io.to(`user:${m.userId}`).emit("message:reaction", {
      messageId,
      conversationId,
      reactions: aggregateReactions(reactions, m.userId),
    });
  }
}

async function emitToConversation(conversationId, event, payload) {
  // Only deliver to members who have not deleted-for-me this chat.
  const members = await prisma.conversationMember.findMany({
    where: { conversationId, hiddenAt: null },
  });
  for (const m of members) {
    io.to(`user:${m.userId}`).emit(event, payload);
  }
}

io.on("connection", (socket) => {
  const userId = socket.data.userId;
  socket.join(`user:${userId}`);

  socket.on("conversation:join", async ({ conversationId }) => {
    if (!conversationId) return;
    const member = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: { conversationId, userId },
      },
    });
    if (!member || member.hiddenAt) return;
    socket.join(`conversation:${conversationId}`);
  });

  socket.on("conversation:leave", ({ conversationId }) => {
    if (!conversationId) return;
    socket.leave(`conversation:${conversationId}`);
  });

  socket.on(
    "message:send",
    async ({
      conversationId,
      body,
      replyToId,
      attachmentUrl,
      attachmentMime,
      attachmentName,
      attachmentSize,
    }) => {
      try {
        if (!conversationId) return;
        const text = body ? String(body).trim().slice(0, 4000) : "";
        const fileUrl =
          attachmentUrl && String(attachmentUrl).startsWith("/uploads/chat/")
            ? String(attachmentUrl)
            : null;
        if (!text && !fileUrl) return;

        const member = await prisma.conversationMember.findUnique({
          where: {
            conversationId_userId: { conversationId, userId },
          },
        });
        if (!member || member.hiddenAt) return;

        let safeReplyToId = null;
        if (replyToId) {
          const target = await prisma.message.findUnique({
            where: { id: String(replyToId) },
          });
          if (
            target &&
            target.conversationId === conversationId &&
            !target.deletedAt
          ) {
            safeReplyToId = target.id;
          }
        }

        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId: userId,
            body: text,
            replyToId: safeReplyToId,
            attachmentUrl: fileUrl,
            attachmentMime: fileUrl
              ? String(attachmentMime || "application/octet-stream").slice(
                  0,
                  120,
                )
              : null,
            attachmentName: fileUrl
              ? String(attachmentName || "file").slice(0, 160)
              : null,
            attachmentSize:
              fileUrl && Number.isFinite(Number(attachmentSize))
                ? Math.max(0, Math.floor(Number(attachmentSize)))
                : null,
          },
          include: messageInclude,
        });
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        });
        await prisma.conversationMember.update({
          where: {
            conversationId_userId: { conversationId, userId },
          },
          data: { lastReadAt: new Date() },
        });

        // Resurface chat for peers who hid/deleted it for themselves.
        // Keep clearedAt so older history stays wiped for them.
        await prisma.conversationMember.updateMany({
          where: {
            conversationId,
            userId: { not: userId },
            hiddenAt: { not: null },
          },
          data: { hiddenAt: null },
        });

        await emitToConversation(
          conversationId,
          "message:new",
          mapMessage(message),
        );
        const peers = await prisma.conversationMember.findMany({
          where: { conversationId, NOT: { userId }, hiddenAt: null },
        });
        for (const m of peers) {
          io.to(`user:${m.userId}`).emit("messages:badge");
        }
      } catch (err) {
        console.error("[alefya-realtime] message:send failed", err);
        socket.emit("message:error", { action: "send", message: "failed" });
      }
    },
  );

  socket.on("message:edit", async ({ messageId, body }) => {
    if (!messageId || !body || String(body).trim().length === 0) return;
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: messageInclude,
    });
    if (!message || message.senderId !== userId || message.deletedAt) return;

    const nextBody = String(body).trim().slice(0, 4000);
    if (nextBody === message.body) return;

    const now = new Date();
    await prisma.messageEdit.create({
      data: { messageId: message.id, body: message.body },
    });
    const updated = await prisma.message.update({
      where: { id: messageId },
      data: { body: nextBody, editedAt: now },
      include: messageInclude,
    });
    await prisma.conversation.update({
      where: { id: message.conversationId },
      data: { updatedAt: now },
    });
    await emitToConversation(
      message.conversationId,
      "message:edited",
      mapMessage(updated),
    );
  });

  socket.on("message:delete", async ({ messageId }) => {
    if (!messageId) return;
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: messageInclude,
    });
    if (!message || message.senderId !== userId || message.deletedAt) return;

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date() },
      include: messageInclude,
    });
    await emitToConversation(
      updated.conversationId,
      "message:deleted",
      mapMessage(updated),
    );
  });

  socket.on("message:react", async ({ messageId, emoji }) => {
    if (!messageId) return;
    const message = await prisma.message.findUnique({
      where: { id: String(messageId) },
      select: {
        id: true,
        conversationId: true,
        deletedAt: true,
      },
    });
    if (!message || message.deletedAt) return;

    const member = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: message.conversationId,
          userId,
        },
      },
    });
    if (!member || member.hiddenAt) return;

    const emojiRaw = emoji == null ? "" : String(emoji).trim();
    const existing = await prisma.messageReaction.findUnique({
      where: {
        messageId_userId: { messageId: message.id, userId },
      },
    });

    if (!emojiRaw) {
      if (existing) {
        await prisma.messageReaction.delete({ where: { id: existing.id } });
      }
    } else {
      if (!isValidReactionEmoji(emojiRaw)) return;
      if (existing && existing.emoji === emojiRaw) {
        await prisma.messageReaction.delete({ where: { id: existing.id } });
      } else if (existing) {
        await prisma.messageReaction.update({
          where: { id: existing.id },
          data: { emoji: emojiRaw },
        });
      } else {
        await prisma.messageReaction.create({
          data: {
            messageId: message.id,
            userId,
            emoji: emojiRaw,
          },
        });
      }
    }

    await emitReactionUpdate(message.conversationId, message.id);
  });

  socket.on("message:read", async ({ conversationId }) => {
    if (!conversationId) return;
    const member = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: { conversationId, userId },
      },
    });
    if (!member) return;
    const now = new Date();
    await prisma.conversationMember.update({
      where: {
        conversationId_userId: { conversationId, userId },
      },
      data: { lastReadAt: now },
    });
    socket.to(`conversation:${conversationId}`).emit("message:read", {
      conversationId,
      userId,
      lastReadAt: now,
    });
    io.to(`user:${userId}`).emit("messages:badge");
  });

  socket.on("typing", ({ conversationId }) => {
    if (!conversationId) return;
    socket
      .to(`conversation:${conversationId}`)
      .emit("typing", { userId, conversationId });
  });
});

httpServer.on("request", async (req, res) => {
  const url = req.url || "/";
  // Let Socket.IO own its transport routes.
  if (url.startsWith("/socket.io")) return;

  if (req.method === "POST" && url === "/notify") {
    let body = "";
    for await (const chunk of req) body += chunk;
    try {
      const data = JSON.parse(body || "{}");
      if (data.userId && data.notification) {
        io.to(`user:${data.userId}`).emit("notification:new", data.notification);
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    } catch {
      res.writeHead(400);
      res.end("bad");
    }
    return;
  }

  if (url === "/health" || url.startsWith("/health?")) {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        ok: true,
        service: "alefya-realtime",
        port,
        hint: "Socket.IO only — open the site on http://localhost:3000",
      }),
    );
    return;
  }

  // Browser hit this port by mistake (e.g. /en) — send them to the Next app.
  const webOrigin =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const target = new URL(url, webOrigin).toString();
  res.writeHead(302, { Location: target });
  res.end();
});

httpServer.listen(port, () => {
  console.log(`[alefya-realtime] listening on :${port}`);
});
