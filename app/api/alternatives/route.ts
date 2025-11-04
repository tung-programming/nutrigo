import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get minScore from URL params
    const { searchParams } = new URL(request.url);
    const minScore = searchParams.get("minScore") || "50";

    // Forward the request to backend with proper error handling
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    const url = `${backendUrl}/api/alternatives?minScore=${minScore}`;
    
    console.log(`🔄 Forwarding request to backend:
    URL: ${url}
    BACKEND_URL env: ${process.env.BACKEND_URL || 'not set'}
    minScore: ${minScore}`);
    
    const response = await fetch(url);
    
    // Get response body as text first
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error(`❌ Backend error (${response.status}):`, responseText);
      throw new Error(`Backend returned ${response.status}: ${responseText}`);
    }

    try {
      // Try to parse the response as JSON
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error("❌ Failed to parse backend response:", responseText);
      throw new Error("Invalid JSON response from backend");
    }
  } catch (error) {
    console.error("❌ Error in alternatives API route:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch alternatives",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}