import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ProfileForm } from "@/components/ProfileForm";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
  if (!user) redirect(`/${locale}/login`);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <ProfileForm
        initialUsername={user.username}
        initialLevel={user.roadmap?.level || null}
      />
    </main>
  );
}
