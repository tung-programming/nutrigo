import mongoose from 'mongoose';

export interface ISubscription {
  user: mongoose.Types.ObjectId;
  type: 'free' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  paymentHistory: {
    amount: number;
    date: Date;
    status: 'success' | 'failed';
    transactionId: string;
  }[];
  features: string[];
}

const subscriptionSchema = new mongoose.Schema<ISubscription>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
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
subscriptionSchema.methods.isActive = function(): boolean {
  return this.status === 'active' && this.endDate > new Date();
};

// Method to extend subscription
subscriptionSchema.methods.extend = async function(months: number) {
  const newEndDate = new Date(this.endDate);
  newEndDate.setMonth(newEndDate.getMonth() + months);
  this.endDate = newEndDate;
  this.status = 'active';
  return this.save();
};

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);