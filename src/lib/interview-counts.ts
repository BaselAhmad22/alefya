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

/** HR interview banks — sync with content/interviews/hr/index.json */
export const HR_INTERVIEW_COUNTS: Record<string, number> = {
  "hr-behavioral": 28,
  "hr-situational": 24,
  "hr-classic": 22,
  "hr-motivation": 20,
  "hr-communication": 22,
  "hr-leadership": 20,
  "hr-psychometric-style": 22,
  "hr-culture-values": 20,
  "hr-salary-negotiation": 18,
  "hr-screening-recruiter": 24,
};

export function getHrInterviewQuestionCount(trackSlug: string): number {
  return HR_INTERVIEW_COUNTS[trackSlug] ?? 0;
}

export function getHrInterviewQuestionCountByDifficulty(
  trackSlug: string,
  difficulty?: "entry" | "mid" | "senior" | "executive" | "junior",
): number {
  const total = getHrInterviewQuestionCount(trackSlug);
  if (!total || !difficulty) return total;
  if (difficulty === "junior") difficulty = "entry";
  const ratios: Record<string, number> = {
    entry: 0.35,
    mid: 0.35,
    senior: 0.2,
    executive: 0.1,
  };
  return Math.max(1, Math.round(total * (ratios[difficulty] ?? 0.25)));
}

export function getTotalHrQuestionCount(): number {
  return Object.values(HR_INTERVIEW_COUNTS).reduce((n, c) => n + c, 0);
}
