import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library"; // ✅ Correct import for Decimal

// Handle POST request to save ROIs
export async function POST(req: NextRequest) {
  try {
    const { userId, rois } = await req.json();

    if (!userId || !rois) {
      return NextResponse.json(
        { error: "Missing userId or ROIs." },
        { status: 400 }
      );
    }

    // Remove ROIs with null values before saving
    const filteredROIs = Object.entries(rois)
      .filter(([_, roi]) => roi !== null) // Remove null values
      .map(([tokenSymbol, roi]) => {
        if (typeof roi !== "number" && typeof roi !== "string") {
          throw new Error(`Invalid ROI value for token ${tokenSymbol}: ${roi}`);
        }
        return {
          userId: Number(userId),
          tokenSymbol,
          roi: new Decimal(roi), // Convert to Decimal
        };
      });

    // Delete old ROI records for the user
    await prisma.rOI.deleteMany({
      where: { userId: Number(userId) },
    });

    // Save new ROIs
    const created = await prisma.rOI.createMany({
      data: filteredROIs,
    });

    return NextResponse.json({
      message: "ROIs saved successfully.",
      count: created.count,
    });
  } catch (error) {
    console.error("Error in POST /api/roi:", error);
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

    const roiRecords = await prisma.rOI.findMany({
      where: { userId: Number(userId) },
    });

    // Convert Decimal to Number before returning
    const rois = roiRecords.reduce((acc, roi) => {
      acc[roi.tokenSymbol] = roi.roi.toNumber(); // ✅ Convert Decimal to Number
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json(rois);
  } catch (error) {
    console.error("Error in GET /api/roi:", error);
    return NextResponse.json(
      { error: "Failed to fetch ROIs." },
      { status: 500 }
    );
  }
}
