import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getTrack, getAllLessons, type Track, type Stage } from "@/lib/content";

export const PASS_SCORE = 75;

/** Per-request memoization — same (user, track) hit once across learn/exam/dashboard. */
export const getCompletedLessonSlugs = cache(
  async (userId: string, trackSlug: string) => {
    const rows = await prisma.progress.findMany({
      where: { userId, trackSlug },
      select: { lessonSlug: true },
    });
    return new Set(rows.map((r) => r.lessonSlug));
  },
);

export const getPassedStages = cache(
  async (userId: string, trackSlug: string) => {
    const rows = await prisma.examAttempt.findMany({
      where: { userId, trackSlug, passed: true },
      select: { stageSlug: true },
    });
    return new Set(rows.map((r) => r.stageSlug));
  },
);

export function isLessonUnlocked(
  track: Track,
  lessonSlug: string,
  completed: Set<string>,
  passedStages: Set<string>,
): boolean {
  const all = getAllLessons(track);
  const index = all.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) return false;
  if (index === 0) return true;

  const prev = all[index - 1];
  if (!completed.has(prev.slug)) return false;

  // If previous lesson ends a stage, that stage exam must be passed before next stage's first lesson
  const prevStage = track.stages.find((s) =>
    s.lessons.some((l) => l.slug === prev.slug),
  );
  const currStage = track.stages.find((s) =>
    s.lessons.some((l) => l.slug === lessonSlug),
  );
  if (prevStage && currStage && prevStage.slug !== currStage.slug) {
    return passedStages.has(prevStage.slug);
  }
  return true;
}

export function isStageExamUnlocked(
  track: Track,
  stageSlug: string,
  completed: Set<string>,
  passedStages: Set<string>,
): boolean {
  const stageIndex = track.stages.findIndex((s) => s.slug === stageSlug);
  if (stageIndex === -1) return false;
  const stage = track.stages[stageIndex];
  const allDone = stage.lessons.every((l) => completed.has(l.slug));
  if (!allDone) return false;
  if (stageIndex === 0) return true;
  const prev = track.stages[stageIndex - 1];
  return passedStages.has(prev.slug);
}

export function nextStage(track: Track, stageSlug: string): Stage | null {
  const i = track.stages.findIndex((s) => s.slug === stageSlug);
  if (i === -1 || i >= track.stages.length - 1) return null;
  return track.stages[i + 1];
}

export const assertCanAccessLesson = cache(
  async (userId: string, trackSlug: string, lessonSlug: string) => {
    const track = getTrack(trackSlug);
    if (!track) return { ok: false as const, reason: "not_found" as const };
    const [completed, passedStages] = await Promise.all([
      getCompletedLessonSlugs(userId, trackSlug),
      getPassedStages(userId, trackSlug),
    ]);
    if (!isLessonUnlocked(track, lessonSlug, completed, passedStages)) {
      return {
        ok: false as const,
        reason: "locked" as const,
        track,
        completed,
        passedStages,
      };
    }
    return { ok: true as const, track, completed, passedStages };
  },
);

/** Where the learner should continue: next unlocked lesson, or stage exam. */
export function getContinueTarget(
  track: Track,
  completed: Set<string>,
  passedStages: Set<string>,
):
  | { type: "lesson"; lessonSlug: string }
  | { type: "exam"; stageSlug: string }
  | { type: "done" } {
  for (const stage of track.stages) {
    for (const lesson of stage.lessons) {
      if (!completed.has(lesson.slug)) {
        if (isLessonUnlocked(track, lesson.slug, completed, passedStages)) {
          return { type: "lesson", lessonSlug: lesson.slug };
        }
        // Previous stage exam still required
        const stageIndex = track.stages.findIndex((s) => s.slug === stage.slug);
        if (stageIndex > 0) {
          const prev = track.stages[stageIndex - 1];
          if (!passedStages.has(prev.slug)) {
            return { type: "exam", stageSlug: prev.slug };
          }
        }
        return { type: "lesson", lessonSlug: lesson.slug };
      }
    }
    if (!passedStages.has(stage.slug)) {
      return { type: "exam", stageSlug: stage.slug };
    }
  }
  return { type: "done" };
}

export function isLastLessonOfStage(track: Track, lessonSlug: string): Stage | null {
  for (const stage of track.stages) {
    const last = stage.lessons[stage.lessons.length - 1];
    if (last?.slug === lessonSlug) return stage;
  }
  return null;
}
