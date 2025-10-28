// Metrics endpoint (mock implementation)

import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      totalScans: 45,
      healthyChoices: 32,
      averageScore: 68,
      currentStreak: 7,
    },
  })
}
