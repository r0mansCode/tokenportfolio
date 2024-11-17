// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userEmail } = await req.json();

  // Update user's subscribed status in your database
  if (userEmail) {
    await prisma.user.update({
      where: { email: userEmail },
      data: { subscribed: false },
    });
  }

  return NextResponse.json({ received: true });
}
