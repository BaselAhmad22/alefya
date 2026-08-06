import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiSession } from "@/lib/api-session";
import { prisma } from "@/lib/prisma";
import {
  createNotification,
  friendshipPair,
} from "@/lib/friends";

const schema = z.object({
  requestId: z.string().min(1),
  action: z.enum(["accept", "reject"]),
});

export async function POST(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const req = await prisma.friendRequest.findUnique({
    where: { id: parsed.data.requestId },
    include: {
      fromUser: { select: { id: true, username: true } },
      toUser: { select: { id: true, username: true } },
    },
  });

  if (!req || req.toUserId !== session.user.id) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (req.status !== "pending") {
    return NextResponse.json({ error: "already_handled" }, { status: 409 });
  }

  const now = new Date();
  const userId = session.user.id;
  const requestId = req.id;

  async function resolveRequestNotifications(resolution: "accepted" | "rejected") {
    const rows = await prisma.notification.findMany({
      where: {
        userId,
        type: "friend_request",
      },
    });
    for (const row of rows) {
      let payload: Record<string, unknown> = {};
      try {
        payload = JSON.parse(row.payloadJson || "{}") as Record<string, unknown>;
      } catch {
        continue;
      }
      if (payload.requestId !== requestId) continue;
      await prisma.notification.update({
        where: { id: row.id },
        data: {
          payloadJson: JSON.stringify({
            ...payload,
            resolved: true,
            resolution,
          }),
          readAt: row.readAt || now,
        },
      });
    }
  }

  if (parsed.data.action === "accept") {
    const [userAId, userBId] = friendshipPair(req.fromUserId, req.toUserId);
    await prisma.$transaction([
      prisma.friendRequest.update({
        where: { id: req.id },
        data: { status: "accepted", respondedAt: now },
      }),
      prisma.friendship.upsert({
        where: { userAId_userBId: { userAId, userBId } },
        create: { userAId, userBId },
        update: {},
      }),
    ]);

    await createNotification({
      userId: req.fromUserId,
      type: "friend_accepted",
      payload: {
        requestId: req.id,
        byUserId: req.toUser.id,
        byUsername: req.toUser.username,
      },
    });

    try {
      const port = process.env.REALTIME_PORT || "4001";
      await fetch(`http://127.0.0.1:${port}/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: req.fromUserId,
          notification: {
            type: "friend_accepted",
            payload: {
              requestId: req.id,
              byUserId: req.toUser.id,
              byUsername: req.toUser.username,
            },
          },
        }),
      });
    } catch {
      /* ignore */
    }

    await resolveRequestNotifications("accepted");

    return NextResponse.json({ ok: true, status: "accepted" });
  }

  await prisma.friendRequest.update({
    where: { id: req.id },
    data: { status: "rejected", respondedAt: now },
  });

  await createNotification({
    userId: req.fromUserId,
    type: "friend_rejected",
    payload: {
      requestId: req.id,
      byUserId: req.toUser.id,
      byUsername: req.toUser.username,
    },
  });

  try {
    const port = process.env.REALTIME_PORT || "4001";
    await fetch(`http://127.0.0.1:${port}/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: req.fromUserId,
        notification: {
          type: "friend_rejected",
          payload: {
            requestId: req.id,
            byUserId: req.toUser.id,
            byUsername: req.toUser.username,
          },
        },
      }),
    });
  } catch {
    /* ignore */
  }

  await resolveRequestNotifications("rejected");

  return NextResponse.json({ ok: true, status: "rejected" });
}
