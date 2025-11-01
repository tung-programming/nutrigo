// backend/src/routes/scan.routes.ts
import express from "express";
import multer from "multer";
import {scanController} from "../controllers/scan.controller";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Debug route to test connection
router.get("/test", (req, res) => {
  res.json({ message: "Scan route active ✅" });
});

// ✅ Image scan route
router.post("/image", upload.single("image"), scanController.lookupByImage);

// ✅ Barcode scan route
router.post("/barcode", scanController.lookupByBarcode);

export default router;
