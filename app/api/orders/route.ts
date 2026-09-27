import { NextRequest, NextResponse } from "next/server";
import { createMockOrderRecord } from "@/lib/mockData";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, phone, address, city, note, items } = body;

    if (!customerName || !phone || !address || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields" },
        { status: 400 }
      );
    }

    const order = createMockOrderRecord({ customerName, phone, address, city, note, items });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
