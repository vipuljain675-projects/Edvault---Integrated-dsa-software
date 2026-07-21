import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  debug: true,

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? "STUDENT";
      }

      // Handle client-side session updates
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.onboarded !== undefined) token.onboarded = session.onboarded;
      }

      // Fetch the latest state directly from the DB on each request
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, xp: true, level: true, streak: true, onboarded: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.xp = dbUser.xp;
          token.level = dbUser.level;
          token.streak = dbUser.streak;
          token.onboarded = dbUser.onboarded;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).xp = token.xp as number;
        (session.user as any).level = token.level as number;
        (session.user as any).streak = token.streak as number;
        (session.user as any).onboarded = token.onboarded as boolean;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser && user.email) {
        // Give new users their first XP
        await prisma.user.update({
          where: { email: user.email },
          data: { xp: 10, lastLoginAt: new Date() },
        });
      } else if (user.email) {
        await prisma.user.update({
          where: { email: user.email },
          data: { lastLoginAt: new Date() },
        });
      }
    },
  },
});
