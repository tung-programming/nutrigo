import mongoose from 'mongoose';

export interface IProduct {
  barcode: string;
  name: string;
  brand: string;
  description: string;
  ingredients: {
    name: string;
    percentage: number;
  }[];
  nutritionFacts: {
    servingSize: string;
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    vitamins: {
      name: string;
      amount: string;
      dailyValue: number;
    }[];
  };
  allergens: string[];
  certifications: string[];
  healthScore: number;
  images: {
    front: string;
    nutrition: string;
    ingredients: string;
  };
  additives: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    barcode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    brand: {
      type: String,
      required: true,
      index: true,
    },
    description: String,
    ingredients: [{
      name: String,
      percentage: Number,
    }],
    nutritionFacts: {
      servingSize: String,
      calories: Number,
      protein: Number,
      carbohydrates: Number,
      fat: Number,
      fiber: Number,
      sugar: Number,
      sodium: Number,
      vitamins: [{
        name: String,
        amount: String,
        dailyValue: Number,
      }],
    },
    allergens: [String],
    certifications: [String],
    healthScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    images: {
      front: String,
      nutrition: String,
      ingredients: String,
    },
    additives: [String],
  },
  {
    timestamps: true,
  }
);

// Create indexes
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

// Add methods if needed
productSchema.methods.findAlternatives = async function(limit = 5) {
  const healthScore = this.healthScore;
  return this.model('Product').find({
    healthScore: { $gt: healthScore },
    _id: { $ne: this._id },
  })
  .sort({ healthScore: -1 })
  .limit(limit);
};

export const Product = mongoose.model<IProduct>('Product', productSchema);