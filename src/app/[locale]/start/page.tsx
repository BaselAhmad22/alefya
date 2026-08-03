import { setRequestLocale } from "next-intl/server";
import { RoadmapWizard } from "@/components/RoadmapWizard";

type Props = { params: Promise<{ locale: string }> };

export default async function StartPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RoadmapWizard />;
}
