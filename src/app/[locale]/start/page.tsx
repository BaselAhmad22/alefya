import { setRequestLocale } from "next-intl/server";
import { RoadmapWizard } from "@/components/RoadmapWizard";

type Props = { params: Promise<{ locale: string }> };

/**
 * Keep this route light: no auth/DB on the server render.
 * Saved roadmap level is hydrated client-side so "Start from zero" opens instantly.
 */
export default async function StartPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RoadmapWizard />;
}
