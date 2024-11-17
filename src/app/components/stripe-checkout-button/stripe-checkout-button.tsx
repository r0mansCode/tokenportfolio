"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const handleCheckout = async () => {
    setLoading(true);
    const stripe = await stripePromise;

    // Call backend to create checkout session
    const response = await fetch("/api/checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail }),
    });

    if (!response.ok) {
      console.error("Failed to create checkout session");
      setLoading(false);
      return;
    }

    const { sessionId } = await response.json();

    // Redirect to Stripe checkout
    if (stripe && sessionId) {
      await stripe.redirectToCheckout({ sessionId });
    }
    setLoading(false);
  };

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? "Processing..." : "Subscribe for $5/month"}
    </button>
  );
}
