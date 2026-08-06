import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiSession } from "@/lib/api-session";
import { prisma } from "@/lib/prisma";

const querySchema = z.object({
  trackSlug: z.string().min(1),
  lessonSlug: z.string().min(1),
});

const toggleSchema = z.object({
  trackSlug: z.string().min(1),
  lessonSlug: z.string().min(1),
  itemKey: z.string().min(1),
  checked: z.boolean(),
});

export async function GET(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    trackSlug: searchParams.get("track"),
    lessonSlug: searchParams.get("lesson"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const rows = await prisma.checklistItem.findMany({
    where: {
      userId: session.user.id,
      trackSlug: parsed.data.trackSlug,
      lessonSlug: parsed.data.lessonSlug,
    },
    select: { itemKey: true, checked: true },
  });

  const items: Record<string, boolean> = {};
  for (const row of rows) items[row.itemKey] = row.checked;
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = toggleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const row = await prisma.checklistItem.upsert({
    where: {
      userId_trackSlug_lessonSlug_itemKey: {
        userId: session.user.id,
        trackSlug: parsed.data.trackSlug,
        lessonSlug: parsed.data.lessonSlug,
        itemKey: parsed.data.itemKey,
      },
    },
    create: {
      userId: session.user.id,
      trackSlug: parsed.data.trackSlug,
      lessonSlug: parsed.data.lessonSlug,
      itemKey: parsed.data.itemKey,
      checked: parsed.data.checked,
    },
    update: { checked: parsed.data.checked },
  });

  return NextResponse.json({ item: row });
}
