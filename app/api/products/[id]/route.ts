import { NextRequest, NextResponse } from "next/server";
import { LIVE_BACKEND_API } from "@/lib/api";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;

    const authHeader = request.headers.get("authorization");
    const headers: Record<string, string> = {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const res = await fetch(`${LIVE_BACKEND_API}/products/${encodeURIComponent(id)}`, {
      cache: "no-store",
      headers,
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: 200 });
    }

    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}
