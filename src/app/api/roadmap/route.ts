import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiSession } from "@/lib/api-session";
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

export async function GET(request: Request) {
  const session = await getApiSession(request);
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
      continueHref = `/exam/${track.slug}/${target.stageSlug}`;
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
  const session = await getApiSession(request);
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

  // Enroll in every track on the plan (so progress already made is visible)
  for (const slug of sequence) {
    await prisma.trackEnrollment.upsert({
      where: {
        userId_trackSlug: { userId: session.user.id, trackSlug: slug },
      },
      create: { userId: session.user.id, trackSlug: slug },
      update: {},
    });
  }

  // Resume at the first unfinished track in the sequence
  let resumeTrackSlug = first;
  let startHref = `/tracks/${first}`;

  for (const slug of sequence) {
    const track = getTrack(slug);
    if (!track) continue;
    const [completed, passed] = await Promise.all([
      getCompletedLessonSlugs(session.user.id, slug),
      getPassedStages(session.user.id, slug),
    ]);
    const target = getContinueTarget(track, completed, passed);
    if (target.type === "done") continue;

    resumeTrackSlug = slug;
    if (target.type === "lesson") {
      startHref = `/learn/${slug}/${target.lessonSlug}`;
    } else {
      startHref = `/exam/${slug}/${target.stageSlug}`;
    }
    break;
  }

  // If every track in the sequence is done, open the last one
  if (startHref.startsWith("/tracks/") && sequence.length) {
    const last = sequence[sequence.length - 1];
    const lastTrack = getTrack(last);
    if (lastTrack) {
      const [completed, passed] = await Promise.all([
        getCompletedLessonSlugs(session.user.id, last),
        getPassedStages(session.user.id, last),
      ]);
      const target = getContinueTarget(lastTrack, completed, passed);
      resumeTrackSlug = last;
      if (target.type === "lesson") {
        startHref = `/learn/${last}/${target.lessonSlug}`;
      } else if (target.type === "exam") {
        startHref = `/exam/${last}/${target.stageSlug}`;
      } else {
        startHref = `/tracks/${last}`;
      }
    }
  }

  const roadmap = await prisma.userRoadmap.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      level: parsed.data.level,
      field: parsed.data.field,
      language: parsed.data.language,
      framework: parsed.data.framework,
      trackSequence: JSON.stringify(sequence),
      currentTrackSlug: resumeTrackSlug,
    },
    update: {
      level: parsed.data.level,
      field: parsed.data.field,
      language: parsed.data.language,
      framework: parsed.data.framework,
      trackSequence: JSON.stringify(sequence),
      currentTrackSlug: resumeTrackSlug,
    },
  });

  return NextResponse.json({
    ok: true,
    roadmap,
    sequence,
    startHref,
  });
}
