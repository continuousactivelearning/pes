import { Schema, model, Document, Types } from "mongoose";

export interface IExam extends Document {
  title: string;
  course: Types.ObjectId;
  batch: Types.ObjectId;
  startTime: Date;
  endTime: Date;
}

const examSchema = new Schema<IExam>({
  title: { type: String, required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  batch: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

export const Exam = model<IExam>('Exam', examSchema);