import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const cleanEmail = (email || "").toLowerCase().trim();

    if (
      (cleanEmail === "admin@gaxinmart.com" && (password === "gaxinmart3140" || password === "afnan31403140")) ||
      (cleanEmail === "afnan@gmail.com" && (password === "afnan31403140" || password === "gaxinmart3140"))
    ) {
      return NextResponse.json({
        success: true,
        token: `gaxinmart_jwt_token_${Date.now()}`,
        admin: {
          id: "admin-1",
          name: "GAXIN MART Admin",
          email: cleanEmail,
          role: "admin",
        },
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
