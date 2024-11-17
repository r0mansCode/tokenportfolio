// src/app/api/auth/refresh-session/route.ts
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) {
        throw new Error("No Profile");
      }
      await prisma.user.upsert({
        where: {
          email: profile.email,
        },
        create: {
          email: profile.email,
          name: profile.name,
        },
        update: {
          name: profile.name,
        },
      });
      return true;
    },
    async jwt({ token }) {
      // Fetch the latest user data from the database on every token creation or refresh
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (dbUser) {
          token.subscribed = dbUser.subscribed; // Sync the token with the latest subscribed status
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Sync the session user data with the updated token information
      session.user.subscribed = token.subscribed;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function GET() {
  const session = await getServerSession(authOptions);

  // Re-fetch the latest session data and return it
  return NextResponse.json(session);
}
