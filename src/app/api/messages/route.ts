import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiSession } from "@/lib/api-session";
import {
  aggregateReactions,
  isValidReactionEmoji,
  mapChatMessage,
  messageInclude,
} from "@/lib/chat-message";
import { prisma } from "@/lib/prisma";
import { countUnreadMessages } from "@/lib/unread-messages";

export async function POST(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const action = body.action || "list";
  const userId = session.user.id;

  if (action === "list") {
    const conversations = await prisma.conversation.findMany({
      where: {
        members: {
          some: {
            userId,
            hiddenAt: null,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      include: {
        members: {
          include: { user: { select: { id: true, username: true } } },
        },
      },
    });

    const mapped = await Promise.all(
      conversations.map(async (c) => {
        const me = c.members.find((m) => m.userId === userId);
        const last = await prisma.message.findFirst({
          where: {
            conversationId: c.id,
            ...(me?.clearedAt
              ? { createdAt: { gt: me.clearedAt } }
              : {}),
          },
          orderBy: { createdAt: "desc" },
        });
        return {
          id: c.id,
          trackSlug: c.trackSlug,
          updatedAt: c.updatedAt,
          pinned: Boolean(me?.pinnedAt),
          pinnedAt: me?.pinnedAt || null,
          members: c.members.map((m) => ({
            id: m.user.id,
            username: m.user.username,
            lastReadAt: m.lastReadAt,
          })),
          lastMessage: last
            ? {
                body: last.deletedAt
                  ? null
                  : last.body ||
                    (last.attachmentUrl
                      ? last.attachmentName || "file"
                      : null),
                deleted: Boolean(last.deletedAt),
                createdAt: last.createdAt,
                senderId: last.senderId,
                attachment: Boolean(last.attachmentUrl && !last.deletedAt),
              }
            : null,
          unread:
            last &&
            last.senderId !== userId &&
            !last.deletedAt &&
            (!me?.lastReadAt || last.createdAt > me.lastReadAt)
              ? 1
              : 0,
        };
      }),
    );
    mapped.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      const ap = a.pinnedAt ? new Date(a.pinnedAt).getTime() : 0;
      const bp = b.pinnedAt ? new Date(b.pinnedAt).getTime() : 0;
      if (a.pinned && b.pinned && ap !== bp) return bp - ap;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    const unreadMessages = await countUnreadMessages(userId);
    return NextResponse.json({
      conversations: mapped,
      unreadMessages,
    });
  }

  if (action === "unread-count") {
    const unreadMessages = await countUnreadMessages(userId);
    return NextResponse.json({ unreadMessages });
  }

  if (action === "messages") {
    if (!body.conversationId) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    try {
      const member = await prisma.conversationMember.findUnique({
        where: {
          conversationId_userId: {
            conversationId: body.conversationId,
            userId,
          },
        },
      });
      if (!member) {
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
      }
      // Deleted-for-me: stay hidden until they explicitly reopen (e.g. Message button).
      if (member.hiddenAt) {
        return NextResponse.json({ error: "hidden" }, { status: 404 });
      }

      const where = {
        conversationId: body.conversationId as string,
        ...(member.clearedAt
          ? { createdAt: { gt: member.clearedAt } }
          : {}),
      };

      let messages;
      try {
        messages = await prisma.message.findMany({
          where,
          orderBy: { createdAt: "asc" },
          take: 200,
          include: messageInclude,
        });
      } catch {
        // Fallback if Prisma client is stale (e.g. server not restarted after MessageReaction).
        const { reactions: _r, ...includeWithoutReactions } = messageInclude;
        void _r;
        messages = await prisma.message.findMany({
          where,
          orderBy: { createdAt: "asc" },
          take: 200,
          include: includeWithoutReactions,
        });
      }

      const peers = await prisma.conversationMember.findMany({
        where: {
          conversationId: body.conversationId,
          NOT: { userId },
        },
      });
      const peerReadAt = peers[0]?.lastReadAt || null;

      await prisma.conversationMember.update({
        where: {
          conversationId_userId: {
            conversationId: body.conversationId,
            userId,
          },
        },
        data: { lastReadAt: new Date() },
      });

      return NextResponse.json({
        messages: messages.map((m) => mapChatMessage(m, userId)),
        peerReadAt,
      });
    } catch (err) {
      console.error("[messages] load failed", err);
      return NextResponse.json({ error: "load_failed" }, { status: 500 });
    }
  }

  if (action === "send") {
    const schema = z.object({
      conversationId: z.string().min(1),
      body: z.string().max(4000).optional().default(""),
      replyToId: z.string().min(1).optional().nullable(),
      attachmentUrl: z.string().min(1).optional().nullable(),
      attachmentMime: z.string().min(1).max(120).optional().nullable(),
      attachmentName: z.string().min(1).max(160).optional().nullable(),
      attachmentSize: z.number().int().nonnegative().optional().nullable(),
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const text = (parsed.data.body || "").trim();
    const attachmentUrl = parsed.data.attachmentUrl || null;
    if (!text && !attachmentUrl) {
      return NextResponse.json({ error: "empty" }, { status: 400 });
    }
    if (
      attachmentUrl &&
      !attachmentUrl.startsWith("/uploads/chat/") &&
      !attachmentUrl.startsWith("/api/chat/files/")
    ) {
      return NextResponse.json({ error: "invalid_attachment" }, { status: 400 });
    }
    const member = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: parsed.data.conversationId,
          userId,
        },
      },
    });
    if (!member) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    if (member.hiddenAt) {
      return NextResponse.json({ error: "hidden" }, { status: 403 });
    }

    let replyToId: string | null = null;
    if (parsed.data.replyToId) {
      const target = await prisma.message.findUnique({
        where: { id: parsed.data.replyToId },
      });
      if (
        target &&
        target.conversationId === parsed.data.conversationId &&
        !target.deletedAt
      ) {
        replyToId = target.id;
      }
    }

    const message = await prisma.message.create({
      data: {
        conversationId: parsed.data.conversationId,
        senderId: userId,
        body: text,
        replyToId,
        attachmentUrl,
        attachmentMime: attachmentUrl
          ? parsed.data.attachmentMime || "application/octet-stream"
          : null,
        attachmentName: attachmentUrl
          ? parsed.data.attachmentName || "file"
          : null,
        attachmentSize: attachmentUrl
          ? parsed.data.attachmentSize ?? null
          : null,
      },
      include: messageInclude,
    });
    await prisma.conversation.update({
      where: { id: parsed.data.conversationId },
      data: { updatedAt: new Date() },
    });
    await prisma.conversationMember.update({
      where: {
        conversationId_userId: {
          conversationId: parsed.data.conversationId,
          userId,
        },
      },
      data: { lastReadAt: new Date() },
    });
    // New message resurfaces the chat for peers who deleted-for-me.
    // Keep clearedAt so history before their delete stays wiped.
    await prisma.conversationMember.updateMany({
      where: {
        conversationId: parsed.data.conversationId,
        userId: { not: userId },
        hiddenAt: { not: null },
      },
      data: { hiddenAt: null },
    });
    return NextResponse.json({ message: mapChatMessage(message, userId) });
  }

  if (action === "edit") {
    const schema = z.object({
      messageId: z.string().min(1),
      body: z.string().min(1).max(4000),
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const existing = await prisma.message.findUnique({
      where: { id: parsed.data.messageId },
      include: messageInclude,
    });
    if (!existing || existing.senderId !== userId) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    if (existing.deletedAt) {
      return NextResponse.json({ error: "deleted" }, { status: 409 });
    }
    const nextBody = parsed.data.body.trim();
    if (nextBody === existing.body) {
      return NextResponse.json({ message: mapChatMessage(existing, userId) });
    }

    const now = new Date();
    await prisma.messageEdit.create({
      data: {
        messageId: existing.id,
        body: existing.body,
      },
    });
    const updated = await prisma.message.update({
      where: { id: existing.id },
      data: { body: nextBody, editedAt: now },
      include: messageInclude,
    });
    await prisma.conversation.update({
      where: { id: existing.conversationId },
      data: { updatedAt: now },
    });
    return NextResponse.json({ message: mapChatMessage(updated, userId) });
  }

  if (action === "delete") {
    const schema = z.object({
      messageId: z.string().min(1),
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const existing = await prisma.message.findUnique({
      where: { id: parsed.data.messageId },
      include: messageInclude,
    });
    if (!existing || existing.senderId !== userId) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    if (existing.deletedAt) {
      return NextResponse.json({ message: mapChatMessage(existing, userId) });
    }
    const updated = await prisma.message.update({
      where: { id: existing.id },
      data: { deletedAt: new Date() },
      include: messageInclude,
    });
    return NextResponse.json({ message: mapChatMessage(updated, userId) });
  }

  if (action === "react") {
    const schema = z.object({
      messageId: z.string().min(1),
      emoji: z.string().max(16).optional().nullable(),
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const message = await prisma.message.findUnique({
      where: { id: parsed.data.messageId },
      select: {
        id: true,
        conversationId: true,
        deletedAt: true,
      },
    });
    if (!message) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    if (message.deletedAt) {
      return NextResponse.json({ error: "deleted" }, { status: 409 });
    }

    const member = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: message.conversationId,
          userId,
        },
      },
    });
    if (!member || member.hiddenAt) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const emojiRaw = (parsed.data.emoji || "").trim();
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
      if (!isValidReactionEmoji(emojiRaw)) {
        return NextResponse.json({ error: "invalid_emoji" }, { status: 400 });
      }
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

    const reactions = await prisma.messageReaction.findMany({
      where: { messageId: message.id },
      select: { emoji: true, userId: true },
    });

    return NextResponse.json({
      messageId: message.id,
      conversationId: message.conversationId,
      reactions: aggregateReactions(reactions, userId),
    });
  }

  if (action === "read") {
    if (!body.conversationId) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const member = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: body.conversationId,
          userId,
        },
      },
    });
    if (!member) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const now = new Date();
    await prisma.conversationMember.update({
      where: {
        conversationId_userId: {
          conversationId: body.conversationId,
          userId,
        },
      },
      data: { lastReadAt: now },
    });
    return NextResponse.json({
      ok: true,
      lastReadAt: now,
      conversationId: body.conversationId,
      userId,
    });
  }

  if (action === "pin" || action === "unpin") {
    if (!body.conversationId) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const member = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: body.conversationId,
          userId,
        },
      },
    });
    if (!member) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    await prisma.conversationMember.update({
      where: {
        conversationId_userId: {
          conversationId: body.conversationId,
          userId,
        },
      },
      data: {
        pinnedAt: action === "pin" ? new Date() : null,
      },
    });
    return NextResponse.json({
      ok: true,
      conversationId: body.conversationId,
      pinned: action === "pin",
    });
  }

  if (action === "hide") {
    if (!body.conversationId) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const member = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: body.conversationId,
          userId,
        },
      },
    });
    if (!member) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const now = new Date();
    await prisma.conversationMember.update({
      where: {
        conversationId_userId: {
          conversationId: body.conversationId,
          userId,
        },
      },
      data: {
        hiddenAt: now,
        clearedAt: now,
        pinnedAt: null,
        lastReadAt: now,
      },
    });
    return NextResponse.json({
      ok: true,
      conversationId: body.conversationId,
    });
  }

  return NextResponse.json({ error: "unknown_action" }, { status: 400 });
}
