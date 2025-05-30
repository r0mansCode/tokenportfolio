import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
  );

  const data = await response.json();

  return NextResponse.json(data);
}
