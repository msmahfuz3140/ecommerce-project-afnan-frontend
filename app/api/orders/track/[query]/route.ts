import { NextRequest, NextResponse } from "next/server";
import { trackMockOrderRecord } from "@/lib/mockData";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ query: string }> | { query: string } }
) {
  try {
    const resolvedParams = await context.params;
    const { query } = resolvedParams;

    const order = trackMockOrderRecord(decodeURIComponent(query));
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to track order" },
      { status: 500 }
    );
  }
}
