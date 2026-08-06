import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiSession } from "@/lib/api-session";
import { prisma } from "@/lib/prisma";
import { getLesson } from "@/lib/content";
import { assertCanAccessLesson } from "@/lib/progress-gates";

const schema = z.object({
  trackSlug: z.string().min(1),
  lessonSlug: z.string().min(1),
});

export async function GET(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const trackSlug = searchParams.get("track");

  const progress = await prisma.progress.findMany({
    where: {
      userId: session.user.id,
      ...(trackSlug ? { trackSlug } : {}),
    },
    orderBy: { completedAt: "desc" },
  });

  return NextResponse.json({ progress });
}

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

  const found = getLesson(parsed.data.trackSlug, parsed.data.lessonSlug);
  if (!found) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const enrollment = await prisma.trackEnrollment.findUnique({
    where: {
      userId_trackSlug: {
        userId: session.user.id,
        trackSlug: parsed.data.trackSlug,
      },
    },
  });
  if (!enrollment) {
    return NextResponse.json({ error: "not_enrolled" }, { status: 403 });
  }

  const access = await assertCanAccessLesson(
    session.user.id,
    parsed.data.trackSlug,
    parsed.data.lessonSlug,
  );
  if (!access.ok) {
    return NextResponse.json({ error: "locked" }, { status: 403 });
  }

  const row = await prisma.progress.upsert({
    where: {
      userId_trackSlug_lessonSlug: {
        userId: session.user.id,
        trackSlug: parsed.data.trackSlug,
        lessonSlug: parsed.data.lessonSlug,
      },
    },
    create: {
      userId: session.user.id,
      trackSlug: parsed.data.trackSlug,
      lessonSlug: parsed.data.lessonSlug,
    },
    update: {
      completedAt: new Date(),
    },
  });

  return NextResponse.json({ progress: row });
}
