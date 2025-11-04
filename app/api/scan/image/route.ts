import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000"

export const maxDuration = 300 // 5 minutes timeout
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Receiving image upload request...")
    const formData = await request.formData()
    
    // Log form data details
    const image = formData.get('image')
    if (!image) {
      console.error("❌ No image file found in form data")
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 }
      )
    }
    console.log("📁 Image file received:", (image as File).name, (image as File).type)

    console.log("🔄 Forwarding request to backend:", `${BACKEND_URL}/api/scan/image`)
    const response = await fetch(`${BACKEND_URL}/api/scan/image`, {
      method: "POST",
      body: formData,
    })

    console.log("📥 Backend response status:", response.status)
    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Backend error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      throw new Error(`Backend error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("✅ Successfully processed image")
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ Error in image processing:", {
      message: error.message,
      stack: error.stack,
    })
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to process image",
        details: error.message 
      },
      { status: 500 }
    )
  }
}
