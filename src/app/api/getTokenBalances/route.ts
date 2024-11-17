// app/api/getTokenBalances/route.js
import { NextRequest, NextResponse } from "next/server";
import { initializeMoralis } from "@/lib/moralis";
import Moralis from "moralis";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  await initializeMoralis();
  if (!!address) {
    try {
      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        address,
        chain: "0x1",
      });
      const validTokens = response.raw.filter((token) => !token.possible_spam);
      return NextResponse.json(validTokens);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch token balances" },
        { status: 500 }
      );
    }
  }
}
