// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // apiVersion: "2022-11-15",
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    const rawBody = await req.text(); // Use raw body for webhook signature verification
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("Customer session: =======>", session);

    // Update user's subscribed status in your database
    if (session.customer_email) {
      await prisma.user.update({
        where: { email: session.customer_email },
        data: { subscribed: true },
      });

      const user = await prisma.user.update({
        where: { email: session.customer_email },
        data: { subscribed: true },
      });

      console.log("Updated user:", user);
    }
  }

  return NextResponse.json({ received: true });
}
