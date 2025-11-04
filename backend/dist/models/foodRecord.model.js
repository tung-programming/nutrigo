"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodRecord = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const foodRecordSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
foodRecordSchema.statics.getUserAverageHealthScore = async function (userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const result = await this.aggregate([
        {
            $match: {
                user: new mongoose_1.default.Types.ObjectId(userId),
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
exports.FoodRecord = mongoose_1.default.model('FoodRecord', foodRecordSchema);
