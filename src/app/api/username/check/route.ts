import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeUsername } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = normalizeUsername(searchParams.get("username") || "");

  if (username.length < 5) {
    return NextResponse.json({ available: false, reason: "username_short" });
  }
  if (username.length > 32) {
    return NextResponse.json({ available: false, reason: "username_long" });
  }
  if (!/^[a-z0-9_]+$/.test(username)) {
    return NextResponse.json({ available: false, reason: "username_chars" });
  }

  const existing = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ available: false, reason: "username_taken" });
  }

  return NextResponse.json({ available: true });
}
