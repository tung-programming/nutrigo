import axios from "axios";

const OFF_BASE = "https://world.openfoodfacts.org";

interface OpenFoodFactsResponse {
  status: number;
  product?: any;
  message?: string;
}

export async function fetchByBarcode(barcode: string) {
  try {
    const url = `${OFF_BASE}/api/v0/product/${barcode}.json`;

    // 👇 your updated line goes here
    const resp = await axios.get<OpenFoodFactsResponse>(url, {
      timeout: 8000,
      headers: {
        "User-Agent": "NutriGo/1.0 (https://nutrigo.app)"
      }
    });

    if (resp.data && resp.data.status === 1) return resp.data.product;
    return null;

  } catch (err: any) {
    console.error("OFF fetch error:", err?.message || err);
    return null;
  }
}
