import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, tokens } = await req.json();

    if (!userId || !tokens) {
      return NextResponse.json(
        { error: "Missing userId or tokens." },
        { status: 400 }
      );
    }
    // Clear old balances for the user
    await prisma.tokenBalance.deleteMany({
      where: { userId: Number(userId) },
    });

    const transformedData = tokens.map((token: any) => ({
      userId: Number(userId),
      name: token.name,
      symbol: token.symbol,
      balance: token.balance.toString(), // Ensure balance is a string
      price: Number(token.price), // Ensure price is a number
      valueInUSD: Number(token.valueInUSD), // Ensure valueInUSD is a number
      logo: token.logo || null,
    }));

    const created = await prisma.tokenBalance.createMany({
      data: transformedData,
    });

    return NextResponse.json({
      message: "Token balances saved.",
      count: created.count,
    });
  } catch (error) {
    console.error("Error in POST /api/token-balances:", error);
    return NextResponse.json(
      { error: "Failed to save token balances." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId." }, { status: 400 });
    }

    const balances = await prisma.tokenBalance.findMany({
      where: { userId: Number(userId) },
    });

    return NextResponse.json(balances);
  } catch (error) {
    console.error("Error in GET /api/token-balances:", error);
    return NextResponse.json(
      { error: "Failed to fetch token balances." },
      { status: 500 }
    );
  }
}
