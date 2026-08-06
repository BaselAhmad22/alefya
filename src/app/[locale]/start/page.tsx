import { setRequestLocale } from "next-intl/server";
import { RoadmapWizard } from "@/components/RoadmapWizard";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ locale: string }> };

export default async function StartPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  const roadmap = session?.user?.id
    ? await prisma.userRoadmap.findUnique({
        where: { userId: session.user.id },
        select: { level: true },
      })
    : null;

  return <RoadmapWizard savedLevel={roadmap?.level || null} />;
}
