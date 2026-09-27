import { NextRequest, NextResponse } from "next/server";
import { getPublicProducts, getAdminProducts } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const isOffer = searchParams.get("isOffer") === "true";
    const sort = searchParams.get("sort") || undefined;

    // Check if admin token is sent in header
    const authHeader = request.headers.get("authorization");
    const isAdmin = Boolean(authHeader && authHeader.startsWith("Bearer "));

    const products = isAdmin
      ? getAdminProducts({ category, search, sort })
      : getPublicProducts({ category, search, isOffer, sort });

    return NextResponse.json({
      success: true,
      count: products.length,
      total: products.length,
      products,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
