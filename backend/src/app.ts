import express from "express";
import cors from "cors";
import scanRoutes from "./routes/scan.routes";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Mount the scanner routes under /api/scan
app.use("/api/scan", scanRoutes);

export default app;
