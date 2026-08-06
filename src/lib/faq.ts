export type FaqCategoryId =
  | "general"
  | "account"
  | "roadmap"
  | "tracks"
  | "exams"
  | "interviews"
  | "social"
  | "ai";

export type FaqItemDef = {
  id: string;
  category: FaqCategoryId;
  /** Shown in the homepage preview strip */
  preview?: boolean;
};

export const FAQ_CATEGORIES: FaqCategoryId[] = [
  "general",
  "account",
  "roadmap",
  "tracks",
  "exams",
  "interviews",
  "social",
  "ai",
];

export const FAQ_ITEMS: FaqItemDef[] = [
  // General
  { id: "whatIsAlefya", category: "general", preview: true },
  { id: "bilingual", category: "general", preview: true },
  { id: "isFree", category: "general" },
  { id: "whereToStart", category: "general", preview: true },
  { id: "whoIsItFor", category: "general" },

  // Account
  { id: "needAccount", category: "account", preview: true },
  { id: "usernameRules", category: "account" },
  { id: "passwordRules", category: "account" },
  { id: "changeLevel", category: "account" },
  { id: "publicProfile", category: "account" },
  { id: "deleteAccount", category: "account" },

  // Roadmap / from zero
  { id: "whatIsFromZero", category: "roadmap", preview: true },
  { id: "howPlanBuilt", category: "roadmap" },
  { id: "changeFieldLater", category: "roadmap" },
  { id: "resumeProgress", category: "roadmap" },
  { id: "roadmapAiHelp", category: "roadmap" },

  // Tracks / lessons
  { id: "lessonOrder", category: "tracks", preview: true },
  { id: "progressSaved", category: "tracks" },
  { id: "lockedLessons", category: "tracks" },
  { id: "categoriesVsTracks", category: "tracks" },
  { id: "myTracks", category: "tracks" },

  // Exams
  { id: "whenExam", category: "exams", preview: true },
  { id: "passScore", category: "exams" },
  { id: "retryExam", category: "exams" },
  { id: "writtenQuestions", category: "exams" },
  { id: "examReport", category: "exams" },

  // Interviews
  { id: "whatAreInterviews", category: "interviews", preview: true },
  { id: "interviewDifficulty", category: "interviews" },
  { id: "interviewExplanations", category: "interviews" },
  { id: "interviewRandom", category: "interviews" },
  { id: "interviewVsExam", category: "interviews" },

  // Social
  { id: "howFriends", category: "social", preview: true },
  { id: "friendRequestRules", category: "social" },
  { id: "howMessages", category: "social" },
  { id: "deleteMessage", category: "social" },
  { id: "notifications", category: "social" },

  // AI
  { id: "lessonAi", category: "ai", preview: true },
  { id: "aiWhatToAsk", category: "ai" },
  { id: "aiLimits", category: "ai" },
  { id: "aiGrading", category: "ai" },
];

export function getPreviewFaqItems(): FaqItemDef[] {
  return FAQ_ITEMS.filter((item) => item.preview);
}

export function getFaqItemsByCategory(
  category: FaqCategoryId | "all",
): FaqItemDef[] {
  if (category === "all") return FAQ_ITEMS;
  return FAQ_ITEMS.filter((item) => item.category === category);
}
