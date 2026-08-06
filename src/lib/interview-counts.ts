/**
 * Lightweight interview question counts — do NOT import interviews.ts here.
 * Keep in sync with TRACK_PACKS lengths and ALL_VARIANTS.length (48).
 */
export const INTERVIEW_VARIANT_COUNT = 48;
export const INTERVIEW_VARIANTS_PER_DIFFICULTY = 16;

export const INTERVIEW_PACK_COUNTS: Record<string, number> = {
  angular: 8,
  aspnet: 8,
  csharp: 8,
  dart: 8,
  docker: 8,
  flutter: 8,
  git: 8,
  javascript: 8,
  kubernetes: 8,
  mongodb: 8,
  nextjs: 8,
  nodejs: 8,
  postgresql: 8,
  python: 8,
  react: 8,
  "react-native": 8,
  typescript: 8,
  vue: 8,
};

export function getInterviewQuestionCount(trackSlug: string): number {
  const packs = INTERVIEW_PACK_COUNTS[trackSlug] ?? 0;
  return packs * INTERVIEW_VARIANT_COUNT;
}

export function getInterviewQuestionCountByDifficulty(
  trackSlug: string,
  difficulty?: "junior" | "mid" | "senior",
): number {
  const packs = INTERVIEW_PACK_COUNTS[trackSlug] ?? 0;
  if (!packs) return 0;
  if (!difficulty) return packs * INTERVIEW_VARIANT_COUNT;
  return packs * INTERVIEW_VARIANTS_PER_DIFFICULTY;
}
