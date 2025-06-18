import { Schema, model, Document } from "mongoose";

export type Role = 'admin' | 'teacher' | 'ta' | 'student';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  enrolledCourses: string[];
  reputationScore: number;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'ta', 'student'], required: true },
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  reputationScore: { type: Number, default: 0 },
});

export const User = model<IUser>('User', userSchema);