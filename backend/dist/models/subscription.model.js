"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const subscriptionSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free',
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    endDate: {
        type: Date,
        required: true,
    },
    paymentHistory: [{
            amount: {
                type: Number,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
            status: {
                type: String,
                enum: ['success', 'failed'],
                required: true,
            },
            transactionId: {
                type: String,
                required: true,
            },
        }],
    features: [{
            type: String,
        }],
}, {
    timestamps: true,
});
// Index for efficient queries
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 }, { expireAfterSeconds: 0 });
// Method to check if subscription is active
subscriptionSchema.methods.isActive = function () {
    return this.status === 'active' && this.endDate > new Date();
};
// Method to extend subscription
subscriptionSchema.methods.extend = async function (months) {
    const newEndDate = new Date(this.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + months);
    this.endDate = newEndDate;
    this.status = 'active';
    return this.save();
};
exports.Subscription = mongoose_1.default.model('Subscription', subscriptionSchema);
