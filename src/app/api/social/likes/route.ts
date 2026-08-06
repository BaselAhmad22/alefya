import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiSession } from "@/lib/api-session";
import { prisma } from "@/lib/prisma";

const targetSchema = z.object({
  targetType: z.enum(["lesson", "stage", "track", "comment"]),
  targetId: z.string().min(1).max(200),
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
  const [count, mine] = await Promise.all([
    prisma.reaction.count({ where: { targetType, targetId } }),
    session?.user?.id
      ? prisma.reaction.findUnique({
          where: {
            userId_targetType_targetId: {
              userId: session.user.id,
              targetType,
              targetId,
            },
          },
        })
      : null,
  ]);
  return NextResponse.json({ count, liked: Boolean(mine) });
}

export async function POST(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const parsed = targetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const { targetType, targetId } = parsed.data;
  await prisma.reaction.upsert({
    where: {
      userId_targetType_targetId: {
        userId: session.user.id,
        targetType,
        targetId,
      },
    },
    create: { userId: session.user.id, targetType, targetId },
    update: {},
  });
  const count = await prisma.reaction.count({ where: { targetType, targetId } });
  return NextResponse.json({ count, liked: true });
}

export async function DELETE(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const parsed = targetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const { targetType, targetId } = parsed.data;
  await prisma.reaction.deleteMany({
    where: { userId: session.user.id, targetType, targetId },
  });
  const count = await prisma.reaction.count({ where: { targetType, targetId } });
  return NextResponse.json({ count, liked: false });
}
