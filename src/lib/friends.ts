import { prisma } from "@/lib/prisma";
import { getTrack, countLessons, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";

export type Relationship =
  | "self"
  | "friends"
  | "pending_out"
  | "pending_in"
  | "rejected_blocked"
  | "can_request";

export function friendshipPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export async function areFriends(a: string, b: string): Promise<boolean> {
  if (!a || !b || a === b) return false;
  const [userAId, userBId] = friendshipPair(a, b);
  const row = await prisma.friendship.findUnique({
    where: { userAId_userBId: { userAId, userBId } },
  });
  return Boolean(row);
}

export async function getRelationship(
  viewerId: string | null | undefined,
  otherId: string,
): Promise<Relationship> {
  if (!viewerId) return "can_request";
  if (viewerId === otherId) return "self";

  if (await areFriends(viewerId, otherId)) return "friends";

  const [pendingOut, pendingIn, rejectedOut] = await Promise.all([
    prisma.friendRequest.findFirst({
      where: {
        fromUserId: viewerId,
        toUserId: otherId,
        status: "pending",
      },
    }),
    prisma.friendRequest.findFirst({
      where: {
        fromUserId: otherId,
        toUserId: viewerId,
        status: "pending",
      },
    }),
    prisma.friendRequest.findFirst({
      where: {
        fromUserId: viewerId,
        toUserId: otherId,
        status: "rejected",
      },
    }),
  ]);

  if (pendingOut) return "pending_out";
  if (pendingIn) return "pending_in";
  if (rejectedOut) return "rejected_blocked";
  return "can_request";
}

export async function canRequestFriendship(
  fromUserId: string,
  toUserId: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!fromUserId || !toUserId || fromUserId === toUserId) {
    return { ok: false, reason: "invalid" };
  }
  if (await areFriends(fromUserId, toUserId)) {
    return { ok: false, reason: "already_friends" };
  }

  const [pendingEither, rejectedOut] = await Promise.all([
    prisma.friendRequest.findFirst({
      where: {
        status: "pending",
        OR: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      },
    }),
    prisma.friendRequest.findFirst({
      where: {
        fromUserId,
        toUserId,
        status: "rejected",
      },
    }),
  ]);

  if (pendingEither) return { ok: false, reason: "pending" };
  if (rejectedOut) return { ok: false, reason: "blocked" };
  return { ok: true };
}

export async function countFriends(userId: string): Promise<number> {
  return prisma.friendship.count({
    where: { OR: [{ userAId: userId }, { userBId: userId }] },
  });
}

export async function createNotification(opts: {
  userId: string;
  type: "friend_request" | "friend_accepted" | "friend_rejected";
  payload: Record<string, unknown>;
}) {
  return prisma.notification.create({
    data: {
      userId: opts.userId,
      type: opts.type,
      payloadJson: JSON.stringify(opts.payload),
    },
  });
}

export async function getFriendTrackProgress(userId: string, locale: Locale) {
  const enrollments = await prisma.trackEnrollment.findMany({
    where: { userId },
    orderBy: { startedAt: "desc" },
  });

  const rows = [];
  for (const e of enrollments) {
    const track = getTrack(e.trackSlug);
    if (!track) continue;
    const total = countLessons(track);
    const done = await prisma.progress.count({
      where: { userId, trackSlug: e.trackSlug },
    });
    const pct = total ? Math.round((done / total) * 100) : 0;
    rows.push({
      slug: track.slug,
      title: tl(track.title, locale),
      done,
      total,
      pct,
      startedAt: e.startedAt,
    });
  }
  return rows;
}

export async function getPublicProfile(
  username: string,
  viewerId: string | null | undefined,
  locale: Locale = "en",
) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      createdAt: true,
      roadmap: {
        select: {
          level: true,
          field: true,
          language: true,
          framework: true,
          currentTrackSlug: true,
        },
      },
    },
  });
  if (!user) return null;

  const relationship = await getRelationship(viewerId, user.id);
  const friendCount = await countFriends(user.id);
  const showFull =
    relationship === "self" || relationship === "friends";

  let tracks: Awaited<ReturnType<typeof getFriendTrackProgress>> | null = null;
  let roadmap: typeof user.roadmap | null = null;
  if (showFull) {
    tracks = await getFriendTrackProgress(user.id, locale);
    roadmap = user.roadmap;
  }

  let pendingRequest: {
    id: string;
    note: string | null;
    fromUsername: string;
  } | null = null;
  if (relationship === "pending_in" && viewerId) {
    const req = await prisma.friendRequest.findFirst({
      where: {
        fromUserId: user.id,
        toUserId: viewerId,
        status: "pending",
      },
      include: { fromUser: { select: { username: true } } },
    });
    if (req) {
      pendingRequest = {
        id: req.id,
        note: req.note,
        fromUsername: req.fromUser.username,
      };
    }
  }

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    createdAt: user.createdAt,
    friendCount,
    relationship,
    pendingRequest,
    tracks,
    roadmap,
  };
}
