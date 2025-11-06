// app/api/auth/login/route.ts
import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function makeUserIdFromEmail(email: string) {
  // deterministic short id derived from email (safe for mock)
  return "user_" + crypto.createHash("sha256").update(email).digest("hex").slice(0, 12);
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 });
    }

    if (password.length >= 8) {
      const id = makeUserIdFromEmail(email);
      return NextResponse.json({
        success: true,
        data: {
          id,
          name: "John Doe",
          email,
          createdAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
