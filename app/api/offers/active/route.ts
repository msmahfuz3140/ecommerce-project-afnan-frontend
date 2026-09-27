import { NextResponse } from "next/server";
import { getOffersData } from "@/lib/mockData";

export async function GET() {
  try {
    const { banners, notices } = getOffersData();
    return NextResponse.json({
      success: true,
      banners,
      notices,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch offers" },
      { status: 500 }
    );
  }
}
