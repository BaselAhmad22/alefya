import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiSession } from "@/lib/api-session";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const take = Math.min(
    Number(new URL(request.url).searchParams.get("take") || 30),
    50,
  );

  const [rows, unread] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take,
    }),
    prisma.notification.count({
      where: { userId: session.user.id, readAt: null },
    }),
  ]);

  return NextResponse.json({
    unread,
    notifications: rows.map((n) => ({
      id: n.id,
      type: n.type,
      payload: JSON.parse(n.payloadJson || "{}") as Record<string, unknown>,
      readAt: n.readAt,
      createdAt: n.createdAt,
    })),
  });
}

const patchSchema = z.object({
  ids: z.array(z.string()).max(50).optional(),
  all: z.boolean().optional(),
});

export async function PATCH(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = patchSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const now = new Date();
  if (parsed.data.all) {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, readAt: null },
      data: { readAt: now },
    });
  } else if (parsed.data.ids?.length) {
    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        id: { in: parsed.data.ids },
        readAt: null,
      },
      data: { readAt: now },
    });
  } else {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const unread = await prisma.notification.count({
    where: { userId: session.user.id, readAt: null },
  });
  return NextResponse.json({ ok: true, unread });
}
