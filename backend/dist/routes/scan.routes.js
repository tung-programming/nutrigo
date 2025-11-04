"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/scan.routes.ts
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const scan_controller_1 = require("../controllers/scan.controller");
const scan_controller_2 = require("../controllers/scan.controller");
const supabase_1 = require("../lib/supabase");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: "uploads/" });
// ✅ Debug route to test connection
router.get("/test", (req, res) => {
    res.json({ message: "Scan route active ✅" });
});
// ✅ Image scan route
router.post("/image", upload.single("image"), scan_controller_1.scanController.lookupByImage);
// ✅ Barcode scan route
router.post("/barcode", scan_controller_1.scanController.lookupByBarcode);
// ✅ Get all scans (for history)
router.get("/history", async (req, res) => {
    try {
        const { data, error } = await supabase_1.supabase
            .from("scans")
            .select("*")
            .order("created_at", { ascending: false });
        if (error)
            throw error;
        res.status(200).json(data);
    }
    catch (err) {
        console.error("❌ History fetch error:", err);
        res.status(500).json({ error: "Failed to fetch scan history" });
    }
});
router.get("/alternatives", scan_controller_2.getAlternatives);
exports.default = router;
