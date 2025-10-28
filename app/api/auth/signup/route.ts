// Signup endpoint (mock implementation)

import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: "All fields required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, error: "Password must be at least 8 characters" }, { status: 400 })
    }

    // Mock user creation - in production, save to database
    return NextResponse.json({
      success: true,
      data: {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
