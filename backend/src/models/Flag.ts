import { Schema, model, Document, Types } from "mongoose";

export interface IFlag extends Document {
  evaluation: Types.ObjectId;
  flaggedBy: Types.ObjectId;
  resolvedBy?: Types.ObjectId;
  resolutionStatus: 'pending' | 'resolved' | 'escalated';
  reason?: string;
  escalationReason?: string;
  createdAt: Date;
}

const flagSchema = new Schema<IFlag>({
  evaluation: { type: Schema.Types.ObjectId, ref: 'Evaluation', required: true },
  flaggedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  resolutionStatus: {
    type: String,
    enum: ['pending', 'resolved', 'escalated'],
    default: 'pending',
  },
  reason: { type: String },
  escalationReason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Flag = model<IFlag>('Flag', flagSchema);