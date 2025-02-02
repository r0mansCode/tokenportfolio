import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library"; // ✅ Correct import for Decimal

export async function POST(req: NextRequest) {
  try {
    const { userId, purchasePrices } = await req.json();

    if (!userId || !purchasePrices) {
      return NextResponse.json(
        { error: "Missing userId or purchasePrices." },
        { status: 400 }
      );
    }

    const filteredPurchasePrices = Object.entries(purchasePrices)
      .filter(([_, price]) => price !== null) // Remove null values
      .map(([tokenSymbol, price]) => {
        if (typeof price !== "number" && typeof price !== "string") {
          throw new Error(
            `Invalid purchasePrices value for token ${tokenSymbol}: ${purchasePrices}`
          );
        }
        return {
          userId: Number(userId),
          tokenSymbol,
          price: new Decimal(price), // Convert to Decimal
        };
      });

    await prisma.purchasePrices.deleteMany({
      where: { userId: Number(userId) },
    });

    const created = await prisma.purchasePrices.createMany({
      data: filteredPurchasePrices,
    });

    return NextResponse.json({
      message: "purchasePrices saved successfully.",
      count: created.count,
    });
  } catch (error) {
    console.error("Error in POST /api/purchase-price:", error);
    return NextResponse.json(
      { error: "Failed to save ROIs." },
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

    const purchasePricesRecords = await prisma.purchasePrices.findMany({
      where: { userId: Number(userId) },
    });

    const rois = purchasePricesRecords.reduce((acc, price) => {
      acc[price.tokenSymbol] = price.price.toNumber(); // ✅ Convert Decimal to Number
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json(rois);
  } catch (error) {
    console.error("Error in GET /api/purchase-price:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchasePrices." },
      { status: 500 }
    );
  }
}
