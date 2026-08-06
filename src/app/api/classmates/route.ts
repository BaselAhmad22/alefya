import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiSession } from "@/lib/api-session";
import { prisma } from "@/lib/prisma";
import { areFriends, getRelationship } from "@/lib/friends";

export async function GET(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const trackSlug = new URL(request.url).searchParams.get("trackSlug");
  if (!trackSlug) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const [viewerEnrollment, enrollments] = await Promise.all([
    prisma.trackEnrollment.findUnique({
      where: {
        userId_trackSlug: { userId: session.user.id, trackSlug },
      },
    }),
    prisma.trackEnrollment.findMany({
      where: { trackSlug, NOT: { userId: session.user.id } },
      take: 48,
      orderBy: { startedAt: "desc" },
      include: { user: { select: { id: true, username: true, name: true } } },
    }),
  ]);

  const classmates = await Promise.all(
    enrollments.map(async (e) => {
      const relationship = await getRelationship(session.user!.id, e.user.id);
      const friends = relationship === "friends";
      return {
        id: e.user.id,
        username: e.user.username,
        name: e.user.name,
        startedAt: e.startedAt,
        relationship,
        canMessage: friends || Boolean(viewerEnrollment),
      };
    }),
  );

  return NextResponse.json({ classmates, enrolled: Boolean(viewerEnrollment) });
}

const dmSchema = z.object({
  otherUserId: z.string().min(1),
  trackSlug: z.string().min(1).optional(),
});

export async function POST(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const parsed = dmSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const { otherUserId, trackSlug } = parsed.data;
  if (otherUserId === session.user.id) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const friends = await areFriends(session.user.id, otherUserId);
  let classmates = false;
  if (trackSlug) {
    const [a, b] = await Promise.all([
      prisma.trackEnrollment.findUnique({
        where: {
          userId_trackSlug: { userId: session.user.id, trackSlug },
        },
      }),
      prisma.trackEnrollment.findUnique({
        where: {
          userId_trackSlug: { userId: otherUserId, trackSlug },
        },
      }),
    ]);
    classmates = Boolean(a && b);
  }

  if (!friends && !classmates) {
    return NextResponse.json({ error: "not_allowed" }, { status: 403 });
  }

  const existing = await prisma.conversation.findFirst({
    where: {
      AND: [
        { members: { some: { userId: session.user.id } } },
        { members: { some: { userId: otherUserId } } },
        {
          members: {
            every: { userId: { in: [session.user.id, otherUserId] } },
          },
        },
      ],
    },
    include: { members: true },
  });

  if (existing && existing.members.length === 2) {
    await prisma.conversationMember.update({
      where: {
        conversationId_userId: {
          conversationId: existing.id,
          userId: session.user.id,
        },
      },
      data: { hiddenAt: null },
    });
    return NextResponse.json({ conversationId: existing.id });
  }

  const conversation = await prisma.conversation.create({
    data: {
      trackSlug: trackSlug || null,
      members: {
        create: [{ userId: session.user.id }, { userId: otherUserId }],
      },
    },
  });

  return NextResponse.json({ conversationId: conversation.id });
}
