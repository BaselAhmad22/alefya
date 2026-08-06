import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getPublicProfile } from "@/lib/friends";
import type { Locale } from "@/i18n/config";
import {
  PublicProfileClient,
  type PublicProfileData,
} from "@/components/PublicProfileClient";

type Props = { params: Promise<{ locale: string; username: string }> };

export default async function PublicProfilePage({ params }: Props) {
  const { locale, username } = await params;
  setRequestLocale(locale);
  const session = await auth();
  const profile = await getPublicProfile(
    username,
    session?.user?.id,
    locale as Locale,
  );
  if (!profile) notFound();

  const initial: PublicProfileData = {
    id: profile.id,
    username: profile.username,
    name: profile.name,
    createdAt: new Date(profile.createdAt).toISOString(),
    friendCount: profile.friendCount,
    relationship: profile.relationship,
    pendingRequest: profile.pendingRequest,
    tracks: profile.tracks
      ? profile.tracks.map((tr) => ({
          slug: tr.slug,
          title: tr.title,
          done: tr.done,
          total: tr.total,
          pct: tr.pct,
        }))
      : null,
    roadmap: profile.roadmap,
  };

  return <PublicProfileClient initial={initial} />;
}
