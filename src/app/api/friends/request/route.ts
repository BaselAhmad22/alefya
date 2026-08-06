import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiSession } from "@/lib/api-session";
import { prisma } from "@/lib/prisma";
import { createNotification, canRequestFriendship } from "@/lib/friends";

const requestSchema = z.object({
  toUserId: z.string().min(1).optional(),
  toUsername: z.string().min(1).max(40).optional(),
  note: z.string().max(300).optional().nullable(),
});

export async function POST(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  let toUserId = parsed.data.toUserId;
  if (!toUserId && parsed.data.toUsername) {
    const u = await prisma.user.findUnique({
      where: { username: parsed.data.toUsername },
      select: { id: true },
    });
    toUserId = u?.id;
  }
  if (!toUserId) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const allowed = await canRequestFriendship(session.user.id, toUserId);
  if (!allowed.ok) {
    return NextResponse.json({ error: allowed.reason }, { status: 403 });
  }

  const fromUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, username: true },
  });
  if (!fromUser) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const note = parsed.data.note?.trim() || null;
  const friendRequest = await prisma.friendRequest.create({
    data: {
      fromUserId: session.user.id,
      toUserId,
      note,
      status: "pending",
    },
  });

  const notification = await createNotification({
    userId: toUserId,
    type: "friend_request",
    payload: {
      requestId: friendRequest.id,
      fromUserId: fromUser.id,
      fromUsername: fromUser.username,
      note,
    },
  });

  // Best-effort realtime ping (ignore failures)
  try {
    const port = process.env.REALTIME_PORT || "4001";
    await fetch(`http://127.0.0.1:${port}/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: toUserId,
        notification: {
          id: notification.id,
          type: notification.type,
          payload: {
            requestId: friendRequest.id,
            fromUserId: fromUser.id,
            fromUsername: fromUser.username,
            note,
          },
          createdAt: notification.createdAt,
        },
      }),
    });
  } catch {
    /* polling fallback */
  }

  return NextResponse.json({
    ok: true,
    requestId: friendRequest.id,
    notificationId: notification.id,
  });
}
