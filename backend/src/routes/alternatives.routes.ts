import express from "express";
import { supabase } from "../lib/supabase";

const router = express.Router();

// Debug route to test this router
router.get("/test", (req, res) => {
  res.json({ message: "Alternatives route is working" });
});

// Get healthier alternatives
router.get("/", async (req, res) => {
  try {
    console.log("📥 Received alternatives request");
    const minScore = Number(req.query.minScore || 50);
    console.log("🎯 Min score:", minScore);

    // Query Supabase for alternatives
    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .gt("healthScore", minScore)
      .order("healthScore", { ascending: false })
      .limit(10);

    if (error) {
      console.error("❌ Supabase error:", error);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (!data || data.length === 0) {
      console.log("ℹ️ No alternatives found");
      return res.status(200).json({ alternatives: [] });
    }

    // Format the response
    const alternatives = data.map(item => ({
      name: item.detected_name || "Unknown Product",
      brand: item.brand || "",
      health_score: item.healthScore || 0,
      nutrition: item.nutrition || {}
    }));

    console.log(`✅ Returning ${alternatives.length} alternatives`);
    return res.status(200).json({ alternatives });
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({
      error: "Failed to fetch alternatives",
      details: err instanceof Error ? err.message : "Unknown error"
    });
  }
});

export default router;