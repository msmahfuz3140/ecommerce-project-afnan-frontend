import { NextRequest, NextResponse } from "next/server";
import { LIVE_BACKEND_API } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get("authorization");

    const headers: Record<string, string> = {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const res = await fetch(`${LIVE_BACKEND_API}/products?${searchParams.toString()}`, {
      cache: "no-store",
      headers,
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      });
    }

    return NextResponse.json({
      success: true,
      count: 0,
      total: 0,
      products: [],
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      count: 0,
      total: 0,
      products: [],
    });
  }
}
