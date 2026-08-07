import { getAllCategories, type Category } from "./categories";
import { getTotalHrQuestionCount } from "./interview-counts";
import { HR_CATEGORY } from "./hr-tracks";

export type InterviewHubCategory =
  | { type: "tech"; category: Category }
  | {
      type: "hr";
      slug: typeof HR_CATEGORY.slug;
      order: number;
      title: Category["title"];
      description: Category["description"];
      color: string;
      trackCount: number;
      questionCount: number;
    };

export function getInterviewHubCategories(): InterviewHubCategory[] {
  const tech: InterviewHubCategory[] = getAllCategories().map((category) => ({
    type: "tech" as const,
    category,
  }));

  const hr: InterviewHubCategory = {
    type: "hr",
    slug: HR_CATEGORY.slug,
    order: HR_CATEGORY.order,
    title: HR_CATEGORY.title,
    description: HR_CATEGORY.description,
    color: HR_CATEGORY.color,
    trackCount: 10,
    questionCount: getTotalHrQuestionCount(),
  };

  return [...tech, hr].sort((a, b) => {
    const orderA = a.type === "tech" ? a.category.order : a.order;
    const orderB = b.type === "tech" ? b.category.order : b.order;
    return orderA - orderB;
  });
}

export function isHrInterviewCategory(slug: string): boolean {
  return slug === HR_CATEGORY.slug;
}
