"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const scan_routes_1 = __importDefault(require("./routes/scan.routes"));
const alternatives_routes_1 = __importDefault(require("./routes/alternatives.routes"));
const app = (0, express_1.default)();
// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});
// Enable CORS and JSON parsing
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Mount API routes with debug logging
console.log("📍 Mounting /api/scan routes...");
app.use("/api/scan", scan_routes_1.default);
console.log("📍 Mounting /api/alternatives routes...");
app.use("/api/alternatives", alternatives_routes_1.default);
// Test route to verify Express is working
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", routes: ["/api/scan", "/api/alternatives"] });
});
// Global error handler
app.use((error, req, res, next) => {
    console.error("❌ Server error:", error);
    res.status(500).json({
        error: "Internal server error",
        details: error.message,
        path: req.path
    });
});
exports.default = app;
