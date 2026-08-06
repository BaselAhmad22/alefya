import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/api-session";
import { getPublicProfile } from "@/lib/friends";
import type { Locale } from "@/i18n/config";

type Ctx = { params: Promise<{ username: string }> };

export async function GET(request: Request, ctx: Ctx) {
  const { username } = await ctx.params;
  const session = await getApiSession(request);
  const localeParam = new URL(request.url).searchParams.get("locale");
  const locale: Locale = localeParam === "ar" ? "ar" : "en";

  const profile = await getPublicProfile(
    username,
    session?.user?.id,
    locale,
  );
  if (!profile) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ profile });
}
