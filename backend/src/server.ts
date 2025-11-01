import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import scanRoutes from "./routes/scan.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Mount the scan routes here
app.use("/api/scan", scanRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 NutriGo backend running on port ${PORT}`);
});
