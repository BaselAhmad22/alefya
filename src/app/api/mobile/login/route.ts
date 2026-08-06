import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema, normalizeUsername } from "@/lib/validation";
import { createMobileToken } from "@/lib/api-session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse({
      ...body,
      username:
        typeof body?.username === "string"
          ? normalizeUsername(body.username)
          : body?.username,
    });
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username: parsed.data.username },
    });
    if (!user) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    const valid = await compare(parsed.data.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    const token = await createMobileToken({
      id: user.id,
      username: user.username,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
      },
    });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
