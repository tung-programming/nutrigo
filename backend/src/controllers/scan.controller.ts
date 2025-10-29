import { Request, Response } from "express";
import { getOrFetchProductByBarcode } from "../services/product.service";

interface ScanRequest extends Request {
  body: { barcode?: string };
}

export const scanBarcode = async (req: ScanRequest, res: Response) => {
  try {
    const { barcode } = req.body;
    if (!barcode) return res.status(400).json({ message: "barcode is required" });

    const product = await getOrFetchProductByBarcode(String(barcode));
    if (!product) return res.status(404).json({ message: "Product not found" });

    const alternatives: any[] = []; // explicitly type this

    return res.json({ product, alternatives });
  } catch (err: any) {
    console.error("scanBarcode error:", err);
    return res.status(500).json({ message: "Scan failed", error: err?.message || err });
  }
};
