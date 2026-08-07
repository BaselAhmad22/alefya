import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getApiSession } from "@/lib/api-session";

type Params = { params: Promise<{ id: string }> };

/**
 * Serve chat attachments stored in Postgres (durable across Render restarts).
 * Only conversation members can download.
 */
export async function GET(request: Request, { params }: Params) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id || id.length > 64) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const file = await prisma.chatFile.findUnique({ where: { id } });
  if (!file) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Allow uploader always; also allow if referenced by a message in a shared conversation.
  const isOwner = file.userId === session.user.id;
  if (!isOwner) {
    const shared = await prisma.message.findFirst({
      where: {
        attachmentUrl: `/api/chat/files/${id}`,
        conversation: {
          members: { some: { userId: session.user.id } },
        },
      },
      select: { id: true },
    });
    if (!shared) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
  }

  const bytes = Buffer.from(file.data);
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": file.mime,
      "Content-Length": String(file.size),
      "Content-Disposition": `inline; filename="${encodeURIComponent(file.name)}"`,
      "Cache-Control": "private, max-age=86400",
    },
  });
}
