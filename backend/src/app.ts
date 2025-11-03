import express from "express";
import cors from "cors";
import scanRoutes from "./routes/scan.routes";
import alternativesRoutes from "./routes/alternatives.routes";

const app = express();

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Mount API routes with debug logging
console.log("📍 Mounting /api/scan routes...");
app.use("/api/scan", scanRoutes);

console.log("📍 Mounting /api/alternatives routes...");
app.use("/api/alternatives", alternativesRoutes);

// Test route to verify Express is working
app.get("/api/health", (req: express.Request, res: express.Response) => {
  res.json({ status: "ok", routes: ["/api/scan", "/api/alternatives"] });
});

// Global error handler
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("❌ Server error:", error);
  res.status(500).json({ 
    error: "Internal server error", 
    details: error.message,
    path: req.path
  });
});

export default app;
