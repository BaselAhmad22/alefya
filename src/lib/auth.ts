import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connection } from "next/server";
import { prisma } from "./prisma";
import { loginSchema, normalizeUsername } from "./validation";

const nextAuth = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/ar/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse({
          ...raw,
          username:
            typeof raw?.username === "string"
              ? normalizeUsername(raw.username)
              : raw?.username,
        });
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { username: parsed.data.username },
        });
        if (!user) return null;

        const valid = await compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name || user.username,
          email: null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

export const { handlers, signIn, signOut } = nextAuth;

/**
 * Always opt out of static prerender before reading the session.
 * Without this, Next can cache an unauthenticated redirect (e.g. /profile → login)
 * and serve it even when the user is logged in.
 */
export async function auth() {
  await connection();
  return nextAuth.auth();
}
