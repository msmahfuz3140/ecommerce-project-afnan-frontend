import { NextRequest, NextResponse } from "next/server";
import { trackMockOrders } from "@/lib/mockData";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ query: string }> | { query: string } }
) {
  try {
    const resolvedParams = await context.params;
    const { query } = resolvedParams;

    const decodedQuery = decodeURIComponent(query);
    const orders = trackMockOrders(decodedQuery);

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "আপনার দেওয়া অর্ডার আইডি বা মোবাইল নাম্বারে কোনো অর্ডার পাওয়া যায়নি।",
          orders: [],
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      orders,
      order: orders[0],
      count: orders.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to track order", orders: [] },
      { status: 500 }
    );
  }
}

