import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/api-session";
import { prisma } from "@/lib/prisma";

const MAX_BYTES = 8 * 1024 * 1024;

const ALLOWED = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["application/pdf", ".pdf"],
  ["text/plain", ".txt"],
  ["application/zip", ".zip"],
  ["application/x-zip-compressed", ".zip"],
]);

export async function POST(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing_file" }, { status: 400 });
  }
  if (file.size <= 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ error: "file_too_large" }, { status: 413 });
  }

  const mime = file.type || "application/octet-stream";
  const ext = ALLOWED.get(mime);
  if (!ext) {
    return NextResponse.json({ error: "unsupported_type" }, { status: 415 });
  }

  const safeName = (file.name || `file${ext}`)
    .replace(/[^\w.\-()\s\u0600-\u06FF]+/g, "_")
    .slice(0, 120);
  const id = randomUUID().replace(/-/g, "").slice(0, 20);
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = safeName.endsWith(ext) ? safeName : `${safeName}${ext}`;

  await prisma.chatFile.create({
    data: {
      id,
      userId: session.user.id,
      mime,
      name,
      size: file.size,
      data: buffer,
    },
  });

  return NextResponse.json({
    url: `/api/chat/files/${id}`,
    mime,
    name,
    size: file.size,
  });
}
