import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/mockData";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;

    const authHeader = request.headers.get("authorization");
    const isAdmin = Boolean(authHeader && authHeader.startsWith("Bearer "));

    const product = getProductById(id, isAdmin);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}
