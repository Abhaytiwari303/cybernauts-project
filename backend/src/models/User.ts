import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  age: number;
  hobbies: string[];
  friends: mongoose.Types.ObjectId[];
  createdAt: Date;
  popularityScore: number;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  age: { type: Number, required: true },
  hobbies: { type: [String], required: true },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  popularityScore: { type: Number, default: 0 }
});

export default mongoose.model<IUser>("User", userSchema);
