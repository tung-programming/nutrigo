import axios from "axios";

const OFF_BASE = "https://world.openfoodfacts.org";

interface OpenFoodFactsResponse {
  status?: number;
  code?: string;
  product?: any;
  products?: any[];
  message?: string;
}

/**
 * Fetch product by barcode from OpenFoodFacts.
 */
export async function getProductByBarcode(barcode: string) {
  if (!barcode) return null;
  const url = `${OFF_BASE}/api/v2/product/${barcode}.json`;

  try {
    const response = await axios.get<OpenFoodFactsResponse>(url, {
      timeout: 8000,
      headers: {
        "User-Agent": "NutriGo/1.0 (https://nutrigo.app)",
      },
      validateStatus: (status) => status < 500,
    });

    const data: OpenFoodFactsResponse = response.data || {};
    if (!data || data.status === 0 || !data.product) return null;

    const product = data.product || {};
    product.code = product.code || barcode;
    product.product_name = product.product_name?.trim() || "Unknown Product";
    product.brands = product.brands?.trim() || "Unknown Brand";
    product.nutriments = product.nutriments || {};

    const n = product.nutriments;
    product.nutriments = {
      energy_kcal_100g:
        n["energy-kcal_100g"] || n["energy_100g"] / 4.184 || 0,
      fat_100g: n["fat_100g"] || 0,
      saturated_fat_100g: n["saturated-fat_100g"] || 0,
      sugars_100g: n["sugars_100g"] || 0,
      proteins_100g: n["proteins_100g"] || 0,
      carbohydrates_100g: n["carbohydrates_100g"] || 0,
      fiber_100g: n["fiber_100g"] || 0,
      sodium_100g: n["sodium_100g"] || 0,
      salt_100g: n["salt_100g"] || n["sodium_100g"] * 2.5 || 0,
    };

    return product;
  } catch (error: any) {
    console.error("❌ OFF getProductByBarcode error:", error.message);
    return null;
  }
}

/**
 * Search a product by text using OpenFoodFacts search API.
 */
export async function searchProductByText(query: string) {
  if (!query || query.length < 2) return null;

  const url = `${OFF_BASE}/cgi/search.pl?search_terms=${encodeURIComponent(
    query
  )}&search_simple=1&action=process&json=1&page_size=1`;

  try {
    const response = await axios.get<OpenFoodFactsResponse>(url, {
      timeout: 8000,
      headers: {
        "User-Agent": "NutriGo/1.0 (https://nutrigo.app)",
      },
    });

    const data: OpenFoodFactsResponse = response.data || {};
    if (!data.products || data.products.length === 0) return null;

    const product = (data.products?.[0] as any) || {};
    product.product_name = product.product_name?.trim() || query;
    product.brands = product.brands?.trim() || "Unknown Brand";
    product.nutriments = product.nutriments || {};

    return product;
  } catch (error: any) {
    console.error("❌ OFF searchProductByText error:", error.message);
    return null;
  }
}

/**
 * Quick barcode existence check
 */
export async function checkBarcodeExists(barcode: string): Promise<boolean> {
  try {
    const url = `${OFF_BASE}/api/v0/product/${barcode}.json`;
    const response = await axios.head(url, { timeout: 5000 });
    return response.status === 200;
  } catch {
    return false;
  }
}
