// app/api/scans/route.ts
import { type NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "scans.json");

const readScansFromFile = () => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, "utf8");
      return fileContent ? JSON.parse(fileContent) : [];
    }
  } catch (error) {
    console.error("Error reading from scans data file:", error);
  }
  return [];
};

const writeScansToFile = (data: any[]) => {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to scans data file:", error);
  }
};

export async function GET(request: NextRequest) {
  try {
    const scans = readScansFromFile();
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      // Be explicit: returning all scans without userId is allowed only for dev/debug.
      // In production you should require authentication and a userId.
      return NextResponse.json({
        success: false,
        error: "Missing userId query parameter. Use ?userId=<your-id>"
      }, { status: 400 });
    }

    const filtered = scans.filter((s: any) => s.userId === userId);
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("GET /api/scans error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch scans" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const idToDelete = body?.id;
    const userId = body?.userId;

    if (!idToDelete || !userId) {
      return NextResponse.json({ success: false, error: 'Missing id or userId' }, { status: 400 });
    }

    const allScans = readScansFromFile();
    const scanToDelete = allScans.find((s: any) => s.id === idToDelete);

    if (!scanToDelete) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    // Enforce ownership: only owner can delete
    if (scanToDelete.userId !== userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const filtered = allScans.filter((s: any) => s.id !== idToDelete);
    writeScansToFile(filtered);
    return NextResponse.json({ success: true, data: { id: idToDelete } });
  } catch (error) {
    console.error('Error deleting scan:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const scanData = await request.json();

    // Require userId on the request body.
    const userId = scanData?.userId;
    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId in request body" }, { status: 400 });
    }

    const allScans = readScansFromFile();

    const formatArray = (arr: any[] | undefined | null) => {
      return Array.isArray(arr) ? arr : [];
    };

    const newScan = {
      id: `scan_${Date.now()}`,
      userId: userId,
      ...scanData,
      productName: scanData.productName || scanData.detected_name || scanData.name || scanData.product_name || scanData.brand || "",
      ingredients: formatArray(scanData.ingredients),
      warnings: formatArray(scanData.warnings),
      scannedAt: new Date().toISOString(),
    };

    // Add the new scan to the beginning of the array
    allScans.unshift(newScan);
    writeScansToFile(allScans);

    return NextResponse.json({ success: true, data: newScan }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error";
    return NextResponse.json(
      { success: false, error: `Failed to create scan: ${errorMessage}` },
      { status: 500 }
    );
  }
}
