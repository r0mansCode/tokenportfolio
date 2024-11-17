import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const account = searchParams.get("account");

  if (!account) {
    return NextResponse.json(
      { error: "Account address is required" },
      { status: 400 }
    );
  }

  const COVALENT_API_KEY = "cqt_rQXxxXrWpDbfvdbh7KP6FC8J9RKt";
  const chainId = 1; // Ethereum mainnet

  try {
    const response = await fetch(
      `https://api.covalenthq.com/v1/${chainId}/address/${account}/balances_v2/?key=${COVALENT_API_KEY}`
    );
    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error_message }, { status: 500 });
    }

    return NextResponse.json(data.data.items);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch assets from Covalent" },
      { status: 500 }
    );
  }
}
