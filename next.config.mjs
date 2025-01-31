/** @type {import('next').NextConfig} */

import path from "path";

const nextConfig = {
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_MORALIS_API_KEY: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_SUBSCRIPTION_PRICE_ID: process.env.STRIPE_SUBSCRIPTION_PRICE_ID,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  sassOptions: {
    includePaths: [path.resolve("./src/styles"), path.resolve("./src/fonts")], // Adjust the path if necessary
    prependData: `@import "variables";`, // Optional: Inject variables globally
  },
};

export default nextConfig;
