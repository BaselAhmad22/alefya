import { prisma } from "@/lib/prisma";

/** Total unread inbound messages across visible (non-hidden) conversations. */
export async function countUnreadMessages(userId: string) {
  const memberships = await prisma.conversationMember.findMany({
    where: { userId, hiddenAt: null },
    select: { conversationId: true, lastReadAt: true, clearedAt: true },
  });

  if (memberships.length === 0) return 0;

  const or = memberships.map((m) => {
    const after =
      m.clearedAt && m.lastReadAt
        ? m.clearedAt > m.lastReadAt
          ? m.clearedAt
          : m.lastReadAt
        : m.clearedAt || m.lastReadAt || null;

    return {
      conversationId: m.conversationId,
      senderId: { not: userId },
      deletedAt: null,
      ...(after ? { createdAt: { gt: after } } : {}),
    };
  });

  return prisma.message.count({ where: { OR: or } });
}
