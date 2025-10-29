import { config } from "dotenv";
config();
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
