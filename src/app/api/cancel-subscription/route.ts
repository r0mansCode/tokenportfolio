// src/app/api/cancel-subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  const { userEmail } = await req.json();

  // Retrieve the user's subscription from Stripe using the email
  const customers = await stripe.customers.list({
    email: userEmail,
    limit: 1,
  });

  if (customers.data.length > 0) {
    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: true,
      });
    }
  }

  return NextResponse.json({ message: "Subscription cancellation requested." });
}
