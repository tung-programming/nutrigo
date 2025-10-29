import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  barcode?: string;
  name: string;
  brand?: string;
  nutrition?: any;
  ingredients_text?: string;
  image_url?: string;
  health_score?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>({
  barcode: { type: String, index: true, unique: true, sparse: true },
  name: { type: String, required: true },
  brand: String,
  nutrition: Schema.Types.Mixed,
  ingredients_text: String,
  image_url: String,
  health_score: Number
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
