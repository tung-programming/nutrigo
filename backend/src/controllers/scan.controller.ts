import { Request, Response } from "express";
import fs from "fs";
import Tesseract from "tesseract.js";
import { getProductByBarcode, searchProductByText } from "../lib/openFoodFacts";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

/**
 * Handles scanning by barcode or image upload.
 */
export const scanController = {
  async lookupByBarcode(req: Request, res: Response) {
    try {
      const { barcode } = req.body;
      if (!barcode)
        return res.status(400).json({ error: "Barcode is required" });

      // Check cache first
      const { data: existing } = await supabase
        .from("scans")
        .select("*")
        .eq("barcode", barcode)
        .maybeSingle();

      if (existing) return res.status(200).json(existing);

      let product = await getProductByBarcode(barcode);
      if (!product) {
        // fallback to Gemini AI with text
        product = await fetchGeminiAIText(barcode);
      }

      if (!product)
        return res.status(404).json({ error: "Product not found" });

      const record = await saveScanToSupabase(product, barcode);
      return res.status(200).json(record);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  },

  async lookupByImage(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ error: "No image uploaded" });

      console.log("📸 Image uploaded:", file.filename);

      // Step 1: Try OCR to extract barcode
      const buffer = fs.readFileSync(file.path);
      const { data } = await Tesseract.recognize(buffer, "eng");
      const text = data.text || "";
      const barcodeMatch = text.match(/\b\d{8,13}\b/);

      let product = null;

      // Step 2: If barcode found, search OpenFoodFacts
      if (barcodeMatch) {
        console.log("🔍 Barcode detected:", barcodeMatch[0]);
        product = await getProductByBarcode(barcodeMatch[0]);
      }

      // Step 3: If no barcode, try text search in OpenFoodFacts
      if (!product && text.length > 2) {
        console.log("🔍 Searching by text:", text.slice(0, 50));
        product = await searchProductByText(text.slice(0, 50));
      }

      // Step 4: If still no product, send IMAGE to Gemini Vision
      if (!product) {
        console.log("🤖 Sending image to Gemini Vision...");
        product = await fetchGeminiAIWithImage(file.path);
      }

      // Clean up uploaded file
      fs.unlinkSync(file.path);

      if (!product) {
        return res.status(404).json({ error: "No match found" });
      }

      const record = await saveScanToSupabase(product);
      return res.status(200).json(record);
    } catch (err) {
      console.error("❌ Error in lookupByImage:", err);
      return res.status(500).json({ error: "OCR or lookup failed" });
    }
  },
};

// =======================================================
// Gemini AI Vision - Analyze actual image
// =======================================================
async function fetchGeminiAIWithImage(imagePath: string): Promise<any> {
  try {
    console.log("🖼️ Reading image file...");
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this food product image. Extract all visible information including product name, brand, nutrition facts (calories, fat, sugar, protein, carbs per 100g), ingredients, and calculate a health score (0-100). Return ONLY valid JSON with this exact structure:
{
  "name": "product name",
  "brand": "brand name",
  "calories": 0,
  "fat": 0,
  "sugar": 0,
  "protein": 0,
  "carbs": 0,
  "category": "food category",
  "healthScore": 0,
  "ingredients": ["ingredient1", "ingredient2"],
  "warnings": ["warning1", "warning2"]
}`,
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Image,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    const data = (await resp.json()) as any;
    console.log("🤖 Gemini Vision Response:", JSON.stringify(data, null, 2));

    const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!outputText) {
      console.error("❌ No text output from Gemini");
      return null;
    }

    // Parse JSON response
    const cleanedText = outputText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanedText);

    console.log("✅ Parsed Gemini data:", parsed);
    return parsed;
  } catch (error) {
    console.error("❌ Gemini Vision error:", error);
    return null;
  }
}

// =======================================================
// Gemini AI Text - For barcode/text queries (fallback)
// =======================================================
async function fetchGeminiAIText(input: string): Promise<any> {
  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this food: ${input}. Return ONLY valid JSON with fields { name, brand, calories, fat, sugar, protein, carbs, category, healthScore (0-100), ingredients, warnings }`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = (await resp.json()) as any;
    const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!outputText) return null;

    const parsed = JSON.parse(outputText.replace(/```json|```/g, "").trim());
    return parsed;
  } catch (error) {
    console.error("❌ Gemini Text error:", error);
    return null;
  }
}

// =======================================================
// Supabase storage helper
// =======================================================
async function saveScanToSupabase(product: any, barcode?: string) {
  const nutrition = product.nutriments || {};
  const record = {
    barcode: barcode || product.code || null,
    detected_name: product.product_name || product.name || "Unknown",
    brand: product.brands || product.brand || "",
    nutrition: {
      calories:
        nutrition.energy_kcal_100g ||
        product.calories ||
        nutrition["energy-kcal"] ||
        0,
      sugar: nutrition.sugars_100g || product.sugar || 0,
      protein: nutrition.proteins_100g || product.protein || 0,
      fat: nutrition.fat_100g || product.fat || 0,
      carbs: nutrition.carbohydrates_100g || product.carbs || 0,
    },
    warnings: product.warnings || [],
    healthScore: product.healthScore || 70,
    source: product.source || "gemini-vision",
    created_at: new Date().toISOString(),
  };

  await supabase.from("scans").insert([record]);
  return record;
}