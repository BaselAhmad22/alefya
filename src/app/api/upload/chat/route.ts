import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/api-session";

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
  const id = randomUUID().replace(/-/g, "").slice(0, 16);
  const userDir = session.user.id.replace(/[^\w-]/g, "_");
  const relDir = path.join("uploads", "chat", userDir);
  const absDir = path.join(process.cwd(), "public", relDir);
  await mkdir(absDir, { recursive: true });

  const filename = `${id}${ext}`;
  const absPath = path.join(absDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absPath, buffer);

  const url = `/${relDir.replace(/\\/g, "/")}/${filename}`;
  return NextResponse.json({
    url,
    mime,
    name: safeName.endsWith(ext) ? safeName : `${safeName}${ext}`,
    size: file.size,
  });
}
