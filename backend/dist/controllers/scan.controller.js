"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlternatives = exports.scanController = void 0;
const fs_1 = __importDefault(require("fs"));
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const openFoodFacts_1 = require("../lib/openFoodFacts");
const node_fetch_1 = __importDefault(require("node-fetch"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabase_1 = require("../lib/supabase");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
/**
 * Handles scanning by barcode or image upload.
 */
exports.scanController = {
    async lookupByBarcode(req, res) {
        try {
            const { barcode } = req.body;
            if (!barcode)
                return res.status(400).json({ error: "Barcode is required" });
            // Check cache first
            const { data: existing } = await supabase_1.supabase
                .from("scans")
                .select("*")
                .eq("barcode", barcode)
                .maybeSingle();
            if (existing)
                return res.status(200).json(existing);
            let product = await (0, openFoodFacts_1.getProductByBarcode)(barcode);
            if (!product) {
                // fallback to Gemini AI with text
                product = await fetchGeminiAIText(barcode);
            }
            if (!product)
                return res.status(404).json({ error: "Product not found" });
            const record = await saveScanToSupabase(product, barcode);
            return res.status(200).json(record);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Server error" });
        }
    },
    async lookupByImage(req, res) {
        try {
            const file = req.file;
            if (!file)
                return res.status(400).json({ error: "No image uploaded" });
            console.log("📸 Image uploaded:", file.filename);
            // Step 1: Try OCR to extract barcode
            const buffer = fs_1.default.readFileSync(file.path);
            const { data } = await tesseract_js_1.default.recognize(buffer, "eng");
            const text = data.text || "";
            const barcodeMatch = text.match(/\b\d{8,13}\b/);
            let product = null;
            // Step 2: If barcode found, search OpenFoodFacts
            if (barcodeMatch) {
                console.log("🔍 Barcode detected:", barcodeMatch[0]);
                product = await (0, openFoodFacts_1.getProductByBarcode)(barcodeMatch[0]);
            }
            // Step 3: If no barcode, try text search in OpenFoodFacts
            if (!product && text.length > 2) {
                console.log("🔍 Searching by text:", text.slice(0, 50));
                product = await (0, openFoodFacts_1.searchProductByText)(text.slice(0, 50));
            }
            // Step 4: If still no product, send IMAGE to Gemini Vision
            if (!product) {
                console.log("🤖 Sending image to Gemini Vision...");
                product = await fetchGeminiAIWithImage(file.path);
            }
            // Clean up uploaded file
            fs_1.default.unlinkSync(file.path);
            if (!product) {
                return res.status(404).json({ error: "No match found" });
            }
            const record = await saveScanToSupabase(product);
            return res.status(200).json(record);
        }
        catch (err) {
            console.error("❌ Error in lookupByImage:", err);
            return res.status(500).json({ error: "OCR or lookup failed" });
        }
    },
};
// =======================================================
// Gemini AI Vision - Analyze actual image
// =======================================================
async function fetchGeminiAIWithImage(imagePath) {
    try {
        console.log("🖼️ Reading image file...");
        const imageBuffer = fs_1.default.readFileSync(imagePath);
        const base64Image = imageBuffer.toString("base64");
        const resp = await (0, node_fetch_1.default)(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
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
        });
        const data = (await resp.json());
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
    }
    catch (error) {
        console.error("❌ Gemini Vision error:", error);
        return null;
    }
}
// =======================================================
// Gemini AI Text - For barcode/text queries (fallback)
// =======================================================
async function fetchGeminiAIText(input) {
    try {
        const resp = await (0, node_fetch_1.default)(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
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
        });
        const data = (await resp.json());
        const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
        if (!outputText)
            return null;
        const parsed = JSON.parse(outputText.replace(/```json|```/g, "").trim());
        return parsed;
    }
    catch (error) {
        console.error("❌ Gemini Text error:", error);
        return null;
    }
}
// =======================================================
// Supabase storage helper
// =======================================================
async function saveScanToSupabase(product, barcode) {
    const nutrition = product.nutriments || {};
    const record = {
        barcode: barcode || product.code || null,
        detected_name: product.product_name || product.name || "Unknown",
        brand: product.brands || product.brand || "",
        nutrition: {
            calories: nutrition.energy_kcal_100g ||
                product.calories ||
                nutrition["energy-kcal"] ||
                0,
            sugar: nutrition.sugars_100g || product.sugar || 0,
            protein: nutrition.proteins_100g || product.protein || 0,
            fat: nutrition.fat_100g || product.fat || 0,
            carbs: nutrition.carbohydrates_100g || product.carbs || 0,
        },
        warnings: (product.warnings || []).join(", "), // stored as text
        healthScore: product.healthScore || 70, // 🔥 match DB column name
        source: product.source || "gemini-vision",
        created_at: new Date().toISOString(),
    };
    const { data, error } = await supabase_1.supabase.from("scans").insert([record]).select();
    if (error) {
        console.error("❌ Supabase insert failed:", error.message, error.details);
    }
    else {
        console.log("✅ Scan saved to Supabase:", data);
    }
    return record;
}
// 🧠 Suggest healthier alternatives
const getAlternatives = async (req, res) => {
    try {
        const minScore = Number(req.query.minScore) || 50;
        // fetch all scans with a higher health score (healthier)
        const { data: scans, error } = await supabase_1.supabase
            .from("scans")
            .select("*")
            .gt("healthScore", minScore)
            .order("healthScore", { ascending: false })
            .limit(6);
        if (error)
            throw error;
        if (!scans || scans.length === 0) {
            // fallback to openfoodfacts healthier food search
            const response = await (0, node_fetch_1.default)("https://world.openfoodfacts.org/cgi/search.pl?search_simple=1&action=process&json=1&page_size=6&sort_by=nutriscore_score");
            const offData = await response.json(); // ✅ <-- add ": any" to fix the unknown type
            const altProducts = (offData.products || []).map((p) => ({
                name: p.product_name || "Unknown Product",
                brand: p.brands || "Unknown Brand",
                health_score: Math.floor(Math.random() * 20) + 70,
                nutrition: {
                    calories: p.nutriments?.["energy-kcal_100g"] || 0,
                    fat: p.nutriments?.["fat_100g"] || 0,
                    sugar: p.nutriments?.["sugars_100g"] || 0,
                    protein: p.nutriments?.["proteins_100g"] || 0,
                },
            }));
            return res.status(200).json({ alternatives: altProducts });
        }
        // Supabase results formatted cleanly
        const formatted = scans.map((s) => ({
            name: s.detected_name,
            brand: s.brand,
            health_score: s.healthScore,
            nutrition: s.nutrition,
        }));
        return res.status(200).json({ alternatives: formatted });
    }
    catch (err) {
        console.error("❌ Alternatives fetch failed:", err);
        return res.status(500).json({ error: "Failed to fetch alternatives" });
    }
};
exports.getAlternatives = getAlternatives;
