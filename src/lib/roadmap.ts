import type { LocalizedString } from "./content";

export type RoadmapLevel = "beginner" | "basics" | "returning";
export type RoadmapField = "frontend" | "backend" | "mobile";

export type RoadmapOption = {
  id: string;
  title: LocalizedString;
  summary: LocalizedString;
};

export const LEVELS: RoadmapOption[] = [
  {
    id: "beginner",
    title: { ar: "مبتدئ تماماً", en: "Complete beginner" },
    summary: {
      ar: "ما عندي خلفية برمجة — أريد أن أبدأ من الصفر.",
      en: "No coding background — I want to start from zero.",
    },
  },
  {
    id: "basics",
    title: { ar: "أعرف أساسيات بسيطة", en: "I know some basics" },
    summary: {
      ar: "جربت قليلاً لكن أحتاج خطة مرتّبة.",
      en: "I've tried a bit but need an ordered plan.",
    },
  },
  {
    id: "returning",
    title: { ar: "عائد للتعلّم", en: "Returning learner" },
    summary: {
      ar: "سبق ودرست وأريد مساراً واضحاً للتخصص.",
      en: "I studied before and want a clear specialization path.",
    },
  },
];

export const FIELDS: RoadmapOption[] = [
  {
    id: "frontend",
    title: { ar: "الواجهة الأمامية", en: "Frontend" },
    summary: {
      ar: "واجهات المواقع والتطبيقات التي يراها المستخدم.",
      en: "The websites and UIs users see and click.",
    },
  },
  {
    id: "backend",
    title: { ar: "الخلفية والخوادم", en: "Backend" },
    summary: {
      ar: "المنطق، قواعد البيانات، وواجهات الـ API.",
      en: "Logic, databases, and APIs behind the UI.",
    },
  },
  {
    id: "mobile",
    title: { ar: "تطبيقات الجوال", en: "Mobile" },
    summary: {
      ar: "تطبيقات iOS وAndroid.",
      en: "iOS and Android apps.",
    },
  },
];

export const LANGUAGES_BY_FIELD: Record<RoadmapField, RoadmapOption[]> = {
  frontend: [
    {
      id: "javascript",
      title: { ar: "JavaScript", en: "JavaScript" },
      summary: {
        ar: "لغة الويب الأساسية — مطلوبة في كل مسارات الفرونت تقريباً.",
        en: "The core web language — required on almost every frontend path.",
      },
    },
    {
      id: "typescript",
      title: { ar: "TypeScript", en: "TypeScript" },
      summary: {
        ar: "JavaScript بأنواع أقوى — شائع في React وAngular.",
        en: "JavaScript with stronger types — common in React and Angular.",
      },
    },
  ],
  backend: [
    {
      id: "csharp",
      title: { ar: "C#", en: "C#" },
      summary: {
        ar: "لغة قوية مع .NET — مناسبة لـ ASP.NET Core.",
        en: "A strong language on .NET — fits ASP.NET Core.",
      },
    },
    {
      id: "javascript",
      title: { ar: "JavaScript (Node)", en: "JavaScript (Node)" },
      summary: {
        ar: "نفس لغة الويب على الخادم مع Node.js.",
        en: "The same web language on the server with Node.js.",
      },
    },
    {
      id: "python",
      title: { ar: "Python", en: "Python" },
      summary: {
        ar: "سهلة للمبتدئين وشائعة في الـ APIs وعلوم البيانات.",
        en: "Beginner-friendly and common for APIs and data work.",
      },
    },
  ],
  mobile: [
    {
      id: "javascript",
      title: { ar: "JavaScript", en: "JavaScript" },
      summary: {
        ar: "لبناء تطبيقات عبر React Native.",
        en: "For apps with React Native.",
      },
    },
    {
      id: "dart",
      title: { ar: "Dart", en: "Dart" },
      summary: {
        ar: "لغة Flutter الرسمية لتطبيق واحد على iOS وAndroid.",
        en: "Flutter’s language for one app on iOS and Android.",
      },
    },
  ],
};

export type FrameworkChoice = RoadmapOption & {
  /** Ordered track slugs: language first, then framework(s) */
  trackSequence: string[];
};

export const FRAMEWORKS: Record<string, FrameworkChoice[]> = {
  "frontend:javascript": [
    {
      id: "react-next",
      title: { ar: "React ثم Next.js", en: "React then Next.js" },
      summary: {
        ar: "مكوّنات حديثة ثم تطبيقات ويب كاملة.",
        en: "Modern components, then full-stack web apps.",
      },
      trackSequence: ["javascript", "react", "nextjs"],
    },
    {
      id: "vue",
      title: { ar: "Vue", en: "Vue" },
      summary: {
        ar: "إطار لطيف ومنحنى تعلّم واضح.",
        en: "A friendly framework with a clear learning curve.",
      },
      trackSequence: ["javascript", "vue"],
    },
  ],
  "frontend:typescript": [
    {
      id: "react-next",
      title: { ar: "React ثم Next.js", en: "React then Next.js" },
      summary: {
        ar: "TypeScript + React هو مسار شائع جداً.",
        en: "TypeScript + React is a very common path.",
      },
      trackSequence: ["typescript", "react", "nextjs"],
    },
    {
      id: "angular",
      title: { ar: "Angular", en: "Angular" },
      summary: {
        ar: "إطار متكامل يعتمد TypeScript بقوة.",
        en: "A batteries-included framework built around TypeScript.",
      },
      trackSequence: ["typescript", "angular"],
    },
  ],
  "backend:csharp": [
    {
      id: "aspnet",
      title: { ar: "ASP.NET Core", en: "ASP.NET Core" },
      summary: {
        ar: "بناء APIs وخوادم حديثة بـ C#.",
        en: "Modern APIs and servers with C#.",
      },
      trackSequence: ["csharp", "aspnet"],
    },
  ],
  "backend:javascript": [
    {
      id: "nodejs",
      title: { ar: "Node.js", en: "Node.js" },
      summary: {
        ar: "خادم JavaScript وواجهات REST.",
        en: "JavaScript servers and REST APIs.",
      },
      trackSequence: ["javascript", "nodejs"],
    },
  ],
  "backend:python": [
    {
      id: "fastapi",
      title: { ar: "Python + FastAPI", en: "Python + FastAPI" },
      summary: {
        ar: "أساسيات Python ثم بناء API.",
        en: "Python foundations, then build an API.",
      },
      trackSequence: ["python"],
    },
  ],
  "mobile:javascript": [
    {
      id: "react-native",
      title: { ar: "React Native", en: "React Native" },
      summary: {
        ar: "تطبيقات جوال بمعرفة React/JS.",
        en: "Mobile apps with React/JS skills.",
      },
      trackSequence: ["javascript", "react-native"],
    },
  ],
  "mobile:dart": [
    {
      id: "flutter",
      title: { ar: "Flutter", en: "Flutter" },
      summary: {
        ar: "بعد Dart: واجهات جوال متعددة المنصات.",
        en: "After Dart: cross-platform mobile UI.",
      },
      trackSequence: ["dart", "flutter"],
    },
  ],
};

export function frameworksFor(field: RoadmapField, language: string) {
  return FRAMEWORKS[`${field}:${language}`] ?? [];
}

export function resolveTrackSequence(opts: {
  field: RoadmapField;
  language: string;
  framework: string;
}): string[] | null {
  const list = frameworksFor(opts.field, opts.language);
  const hit = list.find((f) => f.id === opts.framework);
  return hit ? [...hit.trackSequence] : null;
}
