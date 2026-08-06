import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getApiSession } from "@/lib/api-session";

function secretKey() {
  const s =
    process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret";
  return new TextEncoder().encode(s);
}

/** Short-lived token for Socket.io auth */
export async function GET(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const token = await new SignJWT({
    sub: session.user.id,
    username: session.user.name || "user",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secretKey());

  return NextResponse.json({
    token,
    userId: session.user.id,
    realtimeUrl: process.env.NEXT_PUBLIC_REALTIME_URL || "http://localhost:4001",
  });
}
