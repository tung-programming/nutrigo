"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrFetchProductByBarcode = getOrFetchProductByBarcode;
const product_model_1 = __importDefault(require("../models/product.model"));
const openFoodFacts_1 = require("../lib/openFoodFacts");
const healthScoreCalculator_1 = require("../utils/healthScoreCalculator");
function normalizeOFF(product, barcode) {
    const nutriments = product?.nutriments ?? {};
    return {
        barcode: barcode,
        name: product?.product_name || product?.product_name_en || product?.generic_name || "Unknown",
        brand: product?.brands,
        nutrition: nutriments,
        ingredients_text: product?.ingredients_text || product?.ingredients_text_en,
        image_url: product?.image_small_url || product?.image_front_small_url || product?.image_url
    };
}
async function getOrFetchProductByBarcode(barcode) {
    // Check DB first
    const found = await product_model_1.default.findOne({ barcode }).lean();
    if (found)
        return found;
    // Fetch from OFF
    const offProduct = await (0, openFoodFacts_1.getProductByBarcode)(barcode);
    if (!offProduct)
        return null;
    const normalized = normalizeOFF(offProduct, barcode);
    normalized.health_score = (0, healthScoreCalculator_1.calculateHealthScore)(normalized.nutrition);
    const { rating, message, color } = (0, healthScoreCalculator_1.getScoreInterpretation)(normalized.health_score);
    // Save to DB (ignore unique errors)
    try {
        const created = await product_model_1.default.create(normalized);
        return created.toObject();
    }
    catch (err) {
        // if unique race, read again
        const again = await product_model_1.default.findOne({ barcode }).lean();
        if (again)
            return again;
        throw err;
    }
}
