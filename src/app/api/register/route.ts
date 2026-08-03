import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  registerSchema,
  passwordIssues,
  normalizeUsername,
} from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse({
      ...body,
      username: typeof body?.username === "string" ? normalizeUsername(body.username) : body?.username,
    });
    if (!parsed.success) {
      const issues = passwordIssues(String(body?.password || ""));
      return NextResponse.json(
        { error: "invalid", passwordIssues: issues },
        { status: 400 },
      );
    }

    const username = parsed.data.username;
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ error: "username_taken" }, { status: 409 });
    }

    const passwordHash = await hash(parsed.data.password, 10);
    await prisma.user.create({
      data: {
        username,
        name: username,
        passwordHash,
      },
    });

    return NextResponse.json({ ok: true, username }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
