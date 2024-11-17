import { NextResponse } from "next/server";
import Moralis from "moralis";
import { getPurchasePrices } from "@/utils/get-purchase-price";

export async function POST(request: Request) {
  const body = await request.json();
  const { transactionHistory } = body;

  if (!Moralis.Core.isStarted) {
    await Moralis.start({ apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY });
  }

  try {
    const purchasePrices = await getPurchasePrices({ transactionHistory });
    return NextResponse.json(purchasePrices);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchase prices" },
      { status: 500 }
    );
  }
}
