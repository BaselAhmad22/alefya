import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTrack } from "@/lib/content";
import {
  resolveTrackSequence,
  type RoadmapField,
} from "@/lib/roadmap";
import {
  getContinueTarget,
  getCompletedLessonSlugs,
  getPassedStages,
} from "@/lib/progress-gates";

const saveSchema = z.object({
  level: z.enum(["beginner", "basics", "returning"]),
  field: z.enum(["frontend", "backend", "mobile"]),
  language: z.string().min(1),
  framework: z.string().min(1),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const roadmap = await prisma.userRoadmap.findUnique({
    where: { userId: session.user.id },
  });
  if (!roadmap) return NextResponse.json({ roadmap: null });

  const sequence = JSON.parse(roadmap.trackSequence) as string[];
  const track = getTrack(roadmap.currentTrackSlug);
  let continueHref: string | null = null;
  if (track) {
    const [completed, passed] = await Promise.all([
      getCompletedLessonSlugs(session.user.id, track.slug),
      getPassedStages(session.user.id, track.slug),
    ]);
    const target = getContinueTarget(track, completed, passed);
    if (target.type === "lesson") {
      continueHref = `/learn/${track.slug}/${target.lessonSlug}`;
    } else if (target.type === "exam") {
      continueHref = `/learn/${track.slug}/exam/${target.stageSlug}`;
    } else {
      // Track done — advance checkpoint if next exists
      const idx = sequence.indexOf(track.slug);
      const nextSlug = idx >= 0 ? sequence[idx + 1] : null;
      if (nextSlug && getTrack(nextSlug)) {
        continueHref = `/tracks/${nextSlug}`;
      }
    }
  }

  return NextResponse.json({
    roadmap: {
      ...roadmap,
      sequence,
      continueHref,
    },
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = saveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const sequence = resolveTrackSequence({
    field: parsed.data.field as RoadmapField,
    language: parsed.data.language,
    framework: parsed.data.framework,
  });
  if (!sequence?.length) {
    return NextResponse.json({ error: "unknown_path" }, { status: 400 });
  }

  for (const slug of sequence) {
    if (!getTrack(slug)) {
      return NextResponse.json({ error: "missing_track", slug }, { status: 500 });
    }
  }

  const first = sequence[0];
  await prisma.trackEnrollment.upsert({
    where: {
      userId_trackSlug: { userId: session.user.id, trackSlug: first },
    },
    create: { userId: session.user.id, trackSlug: first },
    update: {},
  });

  const roadmap = await prisma.userRoadmap.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      level: parsed.data.level,
      field: parsed.data.field,
      language: parsed.data.language,
      framework: parsed.data.framework,
      trackSequence: JSON.stringify(sequence),
      currentTrackSlug: first,
    },
    update: {
      level: parsed.data.level,
      field: parsed.data.field,
      language: parsed.data.language,
      framework: parsed.data.framework,
      trackSequence: JSON.stringify(sequence),
      currentTrackSlug: first,
    },
  });

  const track = getTrack(first)!;
  const firstLesson = track.stages[0]?.lessons[0];

  return NextResponse.json({
    ok: true,
    roadmap,
    sequence,
    startHref: firstLesson
      ? `/learn/${first}/${firstLesson.slug}`
      : `/tracks/${first}`,
  });
}
