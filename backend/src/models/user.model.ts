import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  subscription_tier: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    subscription_tier: { type: String, default: "NutriGo" }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
