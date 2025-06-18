import { Schema, model, Document } from "mongoose";
console.log('Course model loaded');

export interface ICourse extends Document {
  name: string;
  code: string;
}

const courseSchema = new Schema<ICourse>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
});

export const Course = model<ICourse>('Course', courseSchema);