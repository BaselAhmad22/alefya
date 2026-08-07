import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiSession } from "@/lib/api-session";
import { prisma } from "@/lib/prisma";
import { friendshipPair } from "@/lib/friends";

export async function GET(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [friendships, incomingRows, outgoingRows] = await Promise.all([
    prisma.friendship.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      include: {
        userA: { select: { id: true, username: true, name: true } },
        userB: { select: { id: true, username: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.friendRequest.findMany({
      where: { toUserId: userId, status: "pending" },
      include: {
        fromUser: { select: { id: true, username: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.friendRequest.findMany({
      where: { fromUserId: userId, status: "pending" },
      include: {
        toUser: { select: { id: true, username: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const friends = friendships.map((f) => {
    const other = f.userAId === userId ? f.userB : f.userA;
    return {
      id: other.id,
      username: other.username,
      name: other.name,
      since: f.createdAt,
    };
  });

  const incoming = incomingRows.map((r) => ({
    id: r.id,
    note: r.note,
    createdAt: r.createdAt,
    user: r.fromUser,
  }));

  const outgoing = outgoingRows.map((r) => ({
    id: r.id,
    note: r.note,
    createdAt: r.createdAt,
    user: r.toUser,
  }));

  return NextResponse.json(
    {
      friends,
      incoming,
      outgoing,
      incomingCount: incoming.length,
    },
    {
      headers: {
        // Short private browser cache — badge polls hit less often.
        "Cache-Control": "private, max-age=15, stale-while-revalidate=30",
      },
    },
  );
}

export async function DELETE(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const otherUserId = z.string().min(1).safeParse(body.otherUserId);
  if (!otherUserId.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const [userAId, userBId] = friendshipPair(session.user.id, otherUserId.data);
  await prisma.friendship.deleteMany({
    where: { userAId, userBId },
  });
  return NextResponse.json({ ok: true });
}
