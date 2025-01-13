// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Update user's subscribed status in your database
      if (session.customer_details?.email) {
        await prisma.user.update({
          where: { email: session.customer_details?.email },
          data: { subscribed: true },
        });

        const user = await prisma.user.update({
          where: { email: session.customer_details?.email },
          data: { subscribed: true },
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Retrieve the customer to get the email
      const customer = await stripe.customers.retrieve(customerId);

      if ((customer as Stripe.Customer).email) {
        const customerEmail = (customer as Stripe.Customer).email as string;

        // Update user's subscribed status in your database
        await prisma.user.update({
          where: { email: customerEmail },
          data: { subscribed: false },
        });
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
