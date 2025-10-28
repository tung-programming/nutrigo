// Login endpoint (mock implementation)

import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 })
    }

    // Mock authentication - in production, verify against database
    if (email && password.length >= 8) {
      return NextResponse.json({
        success: true,
        data: {
          id: "user_123",
          name: "John Doe",
          email: email,
          createdAt: new Date().toISOString(),
        },
      })
    }

    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
