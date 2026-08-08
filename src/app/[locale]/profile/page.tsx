import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ProfileForm } from "@/components/ProfileForm";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  if (!session?.user?.id) {
    redirect(
      `/${locale}/login?next=${encodeURIComponent(`/${locale}/profile`)}`,
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      username: true,
      roadmap: { select: { level: true } },
    },
  });
  if (!user) {
    redirect(
      `/${locale}/login?next=${encodeURIComponent(`/${locale}/profile`)}`,
    );
  }

  return (
    <main className="ay-page profile-ay-page">
      <div className="ay-page-ambient" aria-hidden />
      <ProfileForm
        initialUsername={user.username}
        initialLevel={user.roadmap?.level || null}
      />
    </main>
  );
}
