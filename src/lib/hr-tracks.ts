import type { LocalizedString } from "./content";

export type HrTrack = {
  slug: string;
  order: number;
  title: LocalizedString;
  tagline: LocalizedString;
  description: LocalizedString;
  color: string;
  targetCount: number;
};

export const HR_CATEGORY = {
  slug: "hr" as const,
  order: 10,
  title: { ar: "مقابلات HR والسلوك", en: "HR & behavioral interviews" },
  description: {
    ar: "أسئلة مقابلات الموارد البشرية: سلوكي، موقفي، دافع، تواصل، تفاوض — مع سبب السؤال ونموذج إجابة احترافي.",
    en: "HR interview questions: behavioral, situational, motivation, communication, negotiation — with why it's asked and model answers.",
  },
  color: "#c084fc",
};

export const HR_TRACKS: HrTrack[] = [
  {
    slug: "hr-behavioral",
    order: 1,
    title: { ar: "سلوكي (STAR)", en: "Behavioral (STAR)" },
    tagline: {
      ar: "Tell me about a time… — أمثلة حقيقية بإطار STAR",
      en: "Tell me about a time… — real examples with STAR",
    },
    description: {
      ar: "قيادة، teamwork، فشل، ضغط، حل مشاكل — بصيغة سلوكية قياسية.",
      en: "Leadership, teamwork, failure, pressure, problem-solving — standard behavioral format.",
    },
    color: "#a78bfa",
    targetCount: 28,
  },
  {
    slug: "hr-situational",
    order: 2,
    title: { ar: "موقفي", en: "Situational" },
    tagline: {
      ar: "ماذا تفعل لو… — حكم تحت ضغط",
      en: "What would you do if… — judgment under pressure",
    },
    description: {
      ar: "أخلاقيات، أولويات، صراع مصالح، مواعيد نهائية.",
      en: "Ethics, priorities, conflicts of interest, deadlines.",
    },
    color: "#818cf8",
    targetCount: 24,
  },
  {
    slug: "hr-classic",
    order: 3,
    title: { ar: "كلاسيكي", en: "Classic HR" },
    tagline: {
      ar: "عرف بنفسك، نقاط القوة، لماذا تركت",
      en: "Tell me about yourself, strengths, why you left",
    },
    description: {
      ar: "أسئلة HR الأكثر تكراراً في كل مقابلة.",
      en: "The most repeated HR questions in every interview.",
    },
    color: "#6366f1",
    targetCount: 22,
  },
  {
    slug: "hr-motivation",
    order: 4,
    title: { ar: "دافع وتوافق", en: "Motivation & fit" },
    tagline: {
      ar: "لماذا هذه الوظيفة والشركة؟",
      en: "Why this role and company?",
    },
    description: {
      ar: "خطة مهنية، remote، استقرار، توافق مع الدور.",
      en: "Career plan, remote, stability, role alignment.",
    },
    color: "#4f46e5",
    targetCount: 20,
  },
  {
    slug: "hr-communication",
    order: 5,
    title: { ar: "تواصل وصراع", en: "Communication & conflict" },
    tagline: {
      ar: "feedback، disagreement، stakeholders",
      en: "Feedback, disagreement, stakeholders",
    },
    description: {
      ar: "تواصل واضح، حل خلافات، إدارة توقعات.",
      en: "Clear communication, resolving disagreements, managing expectations.",
    },
    color: "#7c3aed",
    targetCount: 22,
  },
  {
    slug: "hr-leadership",
    order: 6,
    title: { ar: "قيادة ومسؤولية", en: "Leadership & ownership" },
    tagline: {
      ar: "مبادرة وتأثير حتى بدون لقب مدير",
      en: "Initiative and impact without a manager title",
    },
    description: {
      ar: "delegation، mentoring، ownership، decision-making.",
      en: "Delegation, mentoring, ownership, decision-making.",
    },
    color: "#9333ea",
    targetCount: 20,
  },
  {
    slug: "hr-psychometric-style",
    order: 7,
    title: { ar: "أسلوب عمل وقيم", en: "Work style & values" },
    tagline: {
      ar: "ضغط، نزاهة، تعلم، استقلالية",
      en: "Stress, integrity, learning, autonomy",
    },
    description: {
      ar: "أسئلة أسلوب عمل وSJT — ليست تشخيصاً طبياً.",
      en: "Work-style and SJT questions — not clinical diagnosis.",
    },
    color: "#c026d3",
    targetCount: 22,
  },
  {
    slug: "hr-culture-values",
    order: 8,
    title: { ar: "ثقافة وتنوع", en: "Culture & values" },
    tagline: {
      ar: "DEI، تعاون، قيم الشركة",
      en: "DEI, collaboration, company values",
    },
    description: {
      ar: "توافق ثقافي، احترام، شمول، remote teams.",
      en: "Culture fit, respect, inclusion, remote teams.",
    },
    color: "#db2777",
    targetCount: 20,
  },
  {
    slug: "hr-salary-negotiation",
    order: 9,
    title: { ar: "راتب وتفاوض", en: "Salary & negotiation" },
    tagline: {
      ar: "توقعات، benefits، counter-offer",
      en: "Expectations, benefits, counter-offer",
    },
    description: {
      ar: "متى تذكر الراتب، كيف تفاوض باحتراف.",
      en: "When to mention salary, how to negotiate professionally.",
    },
    color: "#e11d48",
    targetCount: 18,
  },
  {
    slug: "hr-screening-recruiter",
    order: 10,
    title: { ar: "فرز أولي", en: "Screening & recruiter" },
    tagline: {
      ar: "مكالمة Recruiter — أول انطباع",
      en: "Recruiter phone screen — first impression",
    },
    description: {
      ar: "availability، salary range، motivation، red flags مبكرة.",
      en: "Availability, salary range, motivation, early red flags.",
    },
    color: "#f43f5e",
    targetCount: 24,
  },
];

export function getHrTrack(slug: string): HrTrack | null {
  return HR_TRACKS.find((t) => t.slug === slug) ?? null;
}

export function getAllHrTracks(): HrTrack[] {
  return [...HR_TRACKS].sort((a, b) => a.order - b.order);
}

export function getTotalHrTargetCount(): number {
  return HR_TRACKS.reduce((n, t) => n + t.targetCount, 0);
}
