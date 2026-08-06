import fs from "fs";
import path from "path";

export type Locale = "ar" | "en";

export type LocalizedString = { ar: string; en: string };

export type LessonMeta = {
  slug: string;
  order: number;
  duration: number;
  title: LocalizedString;
  summary: LocalizedString;
  content: LocalizedString;
  draft?: boolean;
};

export type Stage = {
  slug: string;
  order: number;
  title: LocalizedString;
  description: LocalizedString;
  lessons: LessonMeta[];
};

export type Track = {
  slug: string;
  order: number;
  title: LocalizedString;
  tagline: LocalizedString;
  description: LocalizedString;
  color: string;
  estimatedHours: number;
  stages: Stage[];
};

/** Lightweight track header without lesson bodies — for catalogs / existence checks. */
export type TrackMeta = {
  slug: string;
  order: number;
  title: LocalizedString;
  tagline: LocalizedString;
  description: LocalizedString;
  color: string;
  estimatedHours: number;
  stageSlugs: string[];
};

const CONTENT_ROOT = path.join(process.cwd(), "content", "tracks");

const trackCache = new Map<string, Track | null>();
const trackMetaCache = new Map<string, TrackMeta | null>();

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function getTrackSlugs(): string[] {
  if (!fs.existsSync(CONTENT_ROOT)) return [];
  return fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

export function trackExists(slug: string): boolean {
  return fs.existsSync(path.join(CONTENT_ROOT, slug, "track.json"));
}

export function getTrackMeta(slug: string): TrackMeta | null {
  if (trackMetaCache.has(slug)) return trackMetaCache.get(slug)!;

  const trackPath = path.join(CONTENT_ROOT, slug, "track.json");
  if (!fs.existsSync(trackPath)) {
    trackMetaCache.set(slug, null);
    return null;
  }

  const trackMeta = readJson<{
    slug: string;
    order: number;
    title: LocalizedString;
    tagline: LocalizedString;
    description: LocalizedString;
    color: string;
    estimatedHours: number;
    stages: string[];
  }>(trackPath);

  const meta: TrackMeta = {
    slug: trackMeta.slug,
    order: trackMeta.order,
    title: trackMeta.title,
    tagline: trackMeta.tagline,
    description: trackMeta.description,
    color: trackMeta.color,
    estimatedHours: trackMeta.estimatedHours,
    stageSlugs: trackMeta.stages,
  };
  trackMetaCache.set(slug, meta);
  return meta;
}

export function getTrack(slug: string): Track | null {
  if (trackCache.has(slug)) return trackCache.get(slug)!;

  const trackPath = path.join(CONTENT_ROOT, slug, "track.json");
  if (!fs.existsSync(trackPath)) {
    trackCache.set(slug, null);
    return null;
  }

  const trackMeta = readJson<{
    slug: string;
    order: number;
    title: LocalizedString;
    tagline: LocalizedString;
    description: LocalizedString;
    color: string;
    estimatedHours: number;
    stages: string[];
  }>(trackPath);

  const stages: Stage[] = trackMeta.stages.map((stageSlug) => {
    const stageDir = path.join(CONTENT_ROOT, slug, "stages", stageSlug);
    const stageMeta = readJson<{
      slug: string;
      order: number;
      title: LocalizedString;
      description: LocalizedString;
      lessons: string[];
    }>(path.join(stageDir, "stage.json"));

    const lessons: LessonMeta[] = stageMeta.lessons.map((lessonFile) => {
      const lesson = readJson<LessonMeta>(
        path.join(stageDir, "lessons", lessonFile),
      );
      return lesson;
    });

    lessons.sort((a, b) => a.order - b.order);

    return {
      slug: stageMeta.slug,
      order: stageMeta.order,
      title: stageMeta.title,
      description: stageMeta.description,
      lessons,
    };
  });

  stages.sort((a, b) => a.order - b.order);

  const track: Track = {
    slug: trackMeta.slug,
    order: trackMeta.order,
    title: trackMeta.title,
    tagline: trackMeta.tagline,
    description: trackMeta.description,
    color: trackMeta.color,
    estimatedHours: trackMeta.estimatedHours,
    stages,
  };
  trackCache.set(slug, track);
  trackMetaCache.set(slug, {
    slug: track.slug,
    order: track.order,
    title: track.title,
    tagline: track.tagline,
    description: track.description,
    color: track.color,
    estimatedHours: track.estimatedHours,
    stageSlugs: trackMeta.stages,
  });
  return track;
}

export function getAllTracks(): Track[] {
  return getTrackSlugs()
    .map((slug) => getTrack(slug))
    .filter((t): t is Track => t !== null)
    .sort((a, b) => a.order - b.order);
}

export function getAllLessons(track: Track): LessonMeta[] {
  return track.stages.flatMap((s) => s.lessons);
}

export function getLesson(
  trackSlug: string,
  lessonSlug: string,
): { track: Track; stage: Stage; lesson: LessonMeta; index: number } | null {
  const track = getTrack(trackSlug);
  if (!track) return null;

  const all = getAllLessons(track);
  const index = all.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) return null;

  const lesson = all[index];
  const stage = track.stages.find((s) =>
    s.lessons.some((l) => l.slug === lessonSlug),
  );
  if (!stage) return null;

  return { track, stage, lesson, index };
}

export function getAdjacentLessons(track: Track, lessonSlug: string) {
  const all = getAllLessons(track);
  const index = all.findIndex((l) => l.slug === lessonSlug);
  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index >= 0 && index < all.length - 1 ? all[index + 1] : null,
    index,
    total: all.length,
  };
}

export function countLessons(track: Track): number {
  return getAllLessons(track).length;
}

export function t(localized: LocalizedString, locale: Locale): string {
  return localized[locale] ?? localized.en;
}
