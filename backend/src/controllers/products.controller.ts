import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export const productsController = {
  async getHealthierAlternatives(req: Request, res: Response) {
    try {
      const minScore = Number(req.query.minScore || 50);
      console.log("🔍 Fetching alternatives with minScore:", minScore);

      // First verify Supabase connection
      if (!supabase) {
        console.error("❌ Supabase client not initialized");
        return res.status(500).json({ error: "Database connection error" });
      }

      console.log("📊 Querying scans table...");
      const { data, error } = await supabase
        .from("scans")
        .select("*")
        .gt("healthScore", minScore)
        .order("healthScore", { ascending: false })
        .limit(10);

      if (error) throw error;

      if (error) {
        console.error("❌ Supabase query error:", error);
        return res.status(500).json({ error: "Database query failed" });
      }

      if (!data) {
        console.log("ℹ️ No data found");
        return res.status(200).json({ alternatives: [] });
      }

      console.log(`✅ Found ${data.length} alternatives`);
      
      // Format response data
      const alternatives = data.map(item => ({
        name: item.detected_name || "Unknown Product",
        brand: item.brand || "",
        health_score: item.healthScore || 0,
        nutrition: item.nutrition || {}
      }));

      return res.status(200).json({ alternatives });
    } catch (err) {
      console.error("❌ Server error in getHealthierAlternatives:", err);
      return res.status(500).json({ 
        error: "Server error", 
        details: err instanceof Error ? err.message : "Unknown error"
      });
    }
  },
};
