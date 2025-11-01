import ProductModel from "../models/product.model";
import { getProductByBarcode } from "../lib/openFoodFacts";
import { calculateHealthScore, getScoreInterpretation } from "../utils/healthScoreCalculator";

type Normalized = {
  barcode?: string;
  name: string;
  brand?: string;
  nutrition?: any;
  ingredients_text?: string;
  image_url?: string;
  health_score?: number;
};

function normalizeOFF(product: any, barcode?: string): Normalized {
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

export async function getOrFetchProductByBarcode(barcode: string) {
  // Check DB first
  const found = await ProductModel.findOne({ barcode }).lean();
  if (found) return found;

  // Fetch from OFF
  const offProduct = await fetchByBarcode(barcode);
  if (!offProduct) return null;

  const normalized = normalizeOFF(offProduct, barcode);
  normalized.health_score = calculateHealthScore(normalized.nutrition);
  const { rating, message, color } = getScoreInterpretation(normalized.health_score);
  // Save to DB (ignore unique errors)
  try {
    const created = await ProductModel.create(normalized);
    return created.toObject();
  } catch (err) {
    // if unique race, read again
    const again = await ProductModel.findOne({ barcode }).lean();
    if (again) return again;
    throw err;
  }
}
