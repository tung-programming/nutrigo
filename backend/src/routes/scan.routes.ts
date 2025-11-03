// backend/src/routes/scan.routes.ts
import express from "express";
import multer from "multer";
import {scanController} from "../controllers/scan.controller";
import { createClient } from "@supabase/supabase-js";
import { getAlternatives } from "../controllers/scan.controller";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_KEY!);
// ✅ Debug route to test connection
router.get("/test", (req, res) => {
  res.json({ message: "Scan route active ✅" });
});

// ✅ Image scan route
router.post("/image", upload.single("image"), scanController.lookupByImage);

// ✅ Barcode scan route
router.post("/barcode", scanController.lookupByBarcode);

// ✅ Get all scans (for history)
router.get("/history", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ History fetch error:", err);
    res.status(500).json({ error: "Failed to fetch scan history" });
  }
});

router.get("/alternatives", getAlternatives);

export default router;
