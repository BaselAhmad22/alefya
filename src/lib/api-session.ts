import { SignJWT, jwtVerify } from "jose";
import { auth } from "@/lib/auth";

export type ApiUser = {
  id: string;
  name: string | null;
  username: string;
};

function secretKey() {
  const s =
    process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret";
  return new TextEncoder().encode(s);
}

/** JWT for Flutter / non-browser clients (Bearer). */
export async function createMobileToken(user: {
  id: string;
  username: string;
}) {
  return new SignJWT({
    sub: user.id,
    username: user.username,
    typ: "mobile",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey());
}

export async function verifyMobileToken(
  token: string,
): Promise<{ sub: string; username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const sub = String(payload.sub || "");
    const username = String(payload.username || "");
    if (!sub) return null;
    return { sub, username };
  } catch {
    return null;
  }
}

/**
 * Web cookie session (Auth.js) OR mobile Bearer JWT.
 */
export async function getApiSession(
  request?: Request,
): Promise<{ user: ApiUser } | null> {
  const session = await auth();
  if (session?.user?.id) {
    return {
      user: {
        id: session.user.id,
        name: session.user.name ?? null,
        username: session.user.name || "user",
      },
    };
  }

  const header = request?.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    const payload = await verifyMobileToken(header.slice(7).trim());
    if (payload) {
      return {
        user: {
          id: payload.sub,
          name: payload.username,
          username: payload.username,
        },
      };
    }
  }

  return null;
}
