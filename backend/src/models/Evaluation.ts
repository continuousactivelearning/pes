import { Schema, model, Document, Types } from "mongoose";

export interface IEvaluation extends Document {
  exam: Types.ObjectId;
  evaluator: Types.ObjectId;
  evaluatee: Types.ObjectId;
  marks: number[];
  feedback: string;
  status: 'pending' | 'completed';
  flagged: boolean;
}

const evaluationSchema = new Schema<IEvaluation>({
  exam: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  evaluator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  evaluatee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  marks: [{ type: Number, required: true }],
  feedback: { type: String },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  flagged: { type: Boolean, default: false },
});

export const Evaluation = model<IEvaluation>('Evaluation', evaluationSchema);