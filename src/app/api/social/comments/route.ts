import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiSession } from "@/lib/api-session";
import { prisma } from "@/lib/prisma";

const targetSchema = z.object({
  targetType: z.enum(["lesson", "stage", "track"]),
  targetId: z.string().min(1).max(200),
});

const postSchema = targetSchema.extend({
  body: z.string().min(1).max(2000),
  parentId: z.string().optional().nullable(),
});

export async function GET(request: Request) {
  const session = await getApiSession(request);
  const { searchParams } = new URL(request.url);
  const parsed = targetSchema.safeParse({
    targetType: searchParams.get("targetType"),
    targetId: searchParams.get("targetId"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const { targetType, targetId } = parsed.data;
  const comments = await prisma.comment.findMany({
    where: { targetType, targetId, parentId: null },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { id: true, username: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        take: 30,
        include: { user: { select: { id: true, username: true } } },
      },
    },
  });

  const allIds = comments.flatMap((c) => [
    c.id,
    ...(c.replies?.map((r) => r.id) || []),
  ]);

  const reactions =
    allIds.length === 0
      ? []
      : await prisma.reaction.findMany({
          where: { targetType: "comment", targetId: { in: allIds } },
          select: { targetId: true, userId: true },
        });

  const countById = new Map<string, number>();
  const likedByMe = new Set<string>();
  for (const r of reactions) {
    countById.set(r.targetId, (countById.get(r.targetId) || 0) + 1);
    if (session?.user?.id && r.userId === session.user.id) {
      likedByMe.add(r.targetId);
    }
  }

  const withLikes = comments.map((c) => ({
    ...c,
    likeCount: countById.get(c.id) || 0,
    liked: likedByMe.has(c.id),
    replies: (c.replies || []).map((r) => ({
      ...r,
      likeCount: countById.get(r.id) || 0,
      liked: likedByMe.has(r.id),
    })),
  }));

  return NextResponse.json({ comments: withLikes });
}

export async function POST(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const raw = await request.json().catch(() => ({}));
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const { targetType, targetId, body, parentId } = parsed.data;

  if (parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: parentId } });
    if (
      !parent ||
      parent.targetType !== targetType ||
      parent.targetId !== targetId ||
      parent.parentId
    ) {
      return NextResponse.json({ error: "invalid_parent" }, { status: 400 });
    }
  }

  const comment = await prisma.comment.create({
    data: {
      userId: session.user.id,
      targetType,
      targetId,
      body: body.trim(),
      parentId: parentId || null,
    },
    include: { user: { select: { id: true, username: true } } },
  });
  return NextResponse.json({
    comment: { ...comment, likeCount: 0, liked: false, replies: [] },
  });
}
