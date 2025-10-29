import mongoose from 'mongoose';

export interface IFoodRecord {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  scanDate: Date;
  servings: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  notes?: string;
  healthScore: number;
}

const foodRecordSchema = new mongoose.Schema<IFoodRecord>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  scanDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
    min: 0,
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true,
  },
  notes: String,
  healthScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
}, {
  timestamps: true,
});

// Add indexes for common queries
foodRecordSchema.index({ user: 1, scanDate: -1 });
foodRecordSchema.index({ user: 1, mealType: 1, scanDate: -1 });

// Static method to get user's average health score
foodRecordSchema.statics.getUserAverageHealthScore = async function(userId: string, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const result = await this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        scanDate: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: null,
        averageScore: { $avg: '$healthScore' },
      },
    },
  ]);

  return result[0]?.averageScore || 0;
};

export const FoodRecord = mongoose.model<IFoodRecord>('FoodRecord', foodRecordSchema);