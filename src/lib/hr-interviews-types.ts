export type HrInterviewStage = "screening" | "hr" | "manager" | "final";
export type HrQuestionKind =
  | "behavioral"
  | "situational"
  | "motivational"
  | "judgment";
export type HrDifficulty = "entry" | "mid" | "senior" | "executive";

export type Localized = { ar: string; en: string };
export type LocalizedList = { ar: string[]; en: string[] };

export type HrInterviewQuestion = {
  id: string;
  trackSlug: string;
  kind: HrQuestionKind;
  difficulty: HrDifficulty;
  competency: string;
  interviewStage: HrInterviewStage;
  prompt: Localized;
  options: { ar: string[]; en: string[] };
  correctIndex: number;
  whyAsked: Localized;
  recruiterIntent: Localized;
  modelAnswer: Localized;
  redFlags: LocalizedList;
  passTip: Localized;
  explanation: Localized;
  improvement: Localized;
};

export type HrPublicQuestion = {
  id: string;
  kind: HrQuestionKind;
  difficulty: HrDifficulty;
  competency: string;
  interviewStage: HrInterviewStage;
  prompt: string;
  options: string[];
};

export type HrStudyQuestion = HrPublicQuestion & {
  whyAsked: string;
  recruiterIntent: string;
  modelAnswer: string;
  redFlags: string[];
  passTip: string;
  explanation: string;
  improvement: string;
  correctIndex: number;
};

export type HrGradedItem = {
  id: string;
  kind: HrQuestionKind;
  difficulty: HrDifficulty;
  competency: string;
  interviewStage: HrInterviewStage;
  prompt: string;
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
  correct: boolean;
  explanation: string;
  why: string;
  improvement: string;
  topic: string;
  whyAsked: string;
  recruiterIntent: string;
  modelAnswer: string;
  redFlags: string[];
  passTip: string;
};

export type HrGradeResult = {
  score: number;
  total: number;
  correct: number;
  strengths: string[];
  weaknesses: string[];
  summary: string;
  verdict: "strong" | "ok" | "weak";
  items: HrGradedItem[];
};

/** Maps HR difficulty to tech interview UI buckets. */
export function hrDifficultyToUi(
  d: HrDifficulty,
): "junior" | "mid" | "senior" {
  if (d === "entry") return "junior";
  if (d === "mid") return "mid";
  return "senior";
}
