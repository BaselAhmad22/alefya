import { compare, hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiSession } from "@/lib/api-session";
import { prisma } from "@/lib/prisma";
import {
  normalizeUsername,
  strongPasswordSchema,
  usernameSchema,
} from "@/lib/validation";

const levelSchema = z.enum(["beginner", "basics", "returning"]);

const updateSchema = z
  .object({
    username: usernameSchema.optional(),
    currentPassword: z.string().min(1).optional(),
    newPassword: strongPasswordSchema.optional(),
    level: levelSchema.optional(),
  })
  .refine(
    (data) => data.username || data.newPassword || data.level,
    "no_changes",
  )
  .refine(
    (data) => !data.newPassword || Boolean(data.currentPassword),
    "current_password_required",
  );

const deleteSchema = z.object({
  currentPassword: z.string().min(1),
});

export async function PATCH(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse({
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
      where: { id: session.user.id },
    });
    if (!user) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const { username, currentPassword, newPassword, level } = parsed.data;
    if (username && username !== user.username) {
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing) {
        return NextResponse.json(
          { error: "username_taken" },
          { status: 409 },
        );
      }
    }

    if (newPassword) {
      const valid = await compare(currentPassword!, user.passwordHash);
      if (!valid) {
        return NextResponse.json(
          { error: "wrong_password" },
          { status: 403 },
        );
      }
    }

    if (level) {
      const roadmap = await prisma.userRoadmap.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });
      if (!roadmap) {
        return NextResponse.json(
          { error: "roadmap_required" },
          { status: 400 },
        );
      }
    }

    const passwordHash = newPassword
      ? await hash(newPassword, 10)
      : undefined;
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          ...(username ? { username, name: username } : {}),
          ...(passwordHash ? { passwordHash } : {}),
        },
      }),
      ...(level
        ? [
            prisma.userRoadmap.update({
              where: { userId: user.id },
              data: { level },
            }),
          ]
        : []),
    ]);

    return NextResponse.json({
      ok: true,
      username: username || user.username,
      level,
    });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const parsed = deleteSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const valid = await compare(
      parsed.data.currentPassword,
      user.passwordHash,
    );
    if (!valid) {
      return NextResponse.json(
        { error: "wrong_password" },
        { status: 403 },
      );
    }

    await prisma.user.delete({ where: { id: user.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
