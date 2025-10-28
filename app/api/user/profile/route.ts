// User profile endpoint (mock implementation)

import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      id: "user_123",
      name: "John Doe",
      email: "john@example.com",
      createdAt: new Date().toISOString(),
    },
  })
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    return NextResponse.json({
      success: true,
      data: {
        id: "user_123",
        ...data,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 })
  }
}
