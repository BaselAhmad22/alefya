import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiSession } from "@/lib/api-session";
import { prisma } from "@/lib/prisma";
import { getTrack, getAllLessons } from "@/lib/content";

const schema = z.object({
  trackSlug: z.string().min(1),
});

export async function POST(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const track = getTrack(parsed.data.trackSlug);
  if (!track) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const enrollment = await prisma.trackEnrollment.upsert({
    where: {
      userId_trackSlug: {
        userId: session.user.id,
        trackSlug: parsed.data.trackSlug,
      },
    },
    create: {
      userId: session.user.id,
      trackSlug: parsed.data.trackSlug,
    },
    update: {},
  });

  const first = getAllLessons(track)[0] ?? null;

  return NextResponse.json({
    enrollment,
    firstLessonSlug: first?.slug ?? null,
  });
}

export async function GET(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const enrollments = await prisma.trackEnrollment.findMany({
    where: { userId: session.user.id },
    orderBy: { startedAt: "desc" },
  });

  return NextResponse.json({ enrollments });
}

export async function DELETE(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const trackSlug = parsed.data.trackSlug;
  const userId = session.user.id;

  await prisma.$transaction([
    prisma.trackEnrollment.deleteMany({
      where: { userId, trackSlug },
    }),
    prisma.progress.deleteMany({
      where: { userId, trackSlug },
    }),
    prisma.checklistItem.deleteMany({
      where: { userId, trackSlug },
    }),
    prisma.examAttempt.deleteMany({
      where: { userId, trackSlug },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
