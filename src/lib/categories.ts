import type { LocalizedString } from "./content";

export type Category = {
  slug: string;
  order: number;
  title: LocalizedString;
  description: LocalizedString;
  color: string;
  trackSlugs: string[];
};

/** Catalog of learning categories — home page entry points */
export const CATEGORIES: Category[] = [
  {
    slug: "languages",
    order: 0,
    title: { ar: "لغات البرمجة", en: "Languages" },
    description: {
      ar: "أساسيات اللغات من الصفر قبل أي إطار عمل — عبر معالج «ابدأ من الصفر».",
      en: "Language foundations from zero before any framework — via Start from zero.",
    },
    color: "#e8a54b",
    trackSlugs: ["csharp", "javascript", "typescript", "python", "dart", "git"],
  },
  {
    slug: "frontend",
    order: 1,
    title: { ar: "الواجهة الأمامية", en: "Frontend" },
    description: {
      ar: "بناء واجهات ويب حديثة: مكوّنات، توجيه، وأطر العمل.",
      en: "Build modern web UIs: components, routing, and frameworks.",
    },
    color: "#61DAFB",
    trackSlugs: ["react", "nextjs", "angular", "vue"],
  },
  {
    slug: "backend",
    order: 2,
    title: { ar: "الخلفية والخوادم", en: "Backend" },
    description: {
      ar: "APIs، منطق الخادم، والمصادقة على المنصة.",
      en: "APIs, server logic, and authentication on the platform.",
    },
    color: "#512BD4",
    trackSlugs: ["aspnet", "nodejs"],
  },
  {
    slug: "mobile",
    order: 3,
    title: { ar: "تطبيقات الجوال", en: "Mobile" },
    description: {
      ar: "تطبيقات iOS وAndroid بمسار مرتّب من الشاشة الأولى للبناء.",
      en: "iOS & Android apps — from first screen to a buildable release.",
    },
    color: "#00D4FF",
    trackSlugs: ["react-native", "flutter"],
  },
  {
    slug: "database",
    order: 4,
    title: { ar: "قواعد البيانات", en: "Database" },
    description: {
      ar: "نمذجة البيانات، الاستعلامات، والتخزين للأنظمة الحقيقية.",
      en: "Data modeling, queries, and storage for real systems.",
    },
    color: "#3dba9c",
    trackSlugs: ["postgresql", "mongodb"],
  },
  {
    slug: "devops",
    order: 5,
    title: { ar: "DevOps والنشر", en: "DevOps" },
    description: {
      ar: "النشر، البيئات، وخطوط التسليم الحديثة.",
      en: "Deploy, environments, and modern delivery pipelines.",
    },
    color: "#e85d5d",
    trackSlugs: ["docker", "kubernetes"],
  },
];

export function getAllCategories(): Category[] {
  return [...CATEGORIES].sort((a, b) => a.order - b.order);
}

export function getCategory(slug: string): Category | null {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function getCategoryForTrack(trackSlug: string): Category | null {
  return CATEGORIES.find((c) => c.trackSlugs.includes(trackSlug)) ?? null;
}
