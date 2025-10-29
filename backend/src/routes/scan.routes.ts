import { Router } from "express";
import { scanBarcode } from "../controllers/scan.controller";

const router = Router();

router.post("/barcode", scanBarcode);

export default router;
