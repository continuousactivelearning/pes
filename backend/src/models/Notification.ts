import { Schema, model, Document, Types } from "mongoose";

export interface INotification extends Document {
  recipient: Types.ObjectId;
  message: string;
  relatedResource?: {
    type: string;
    id: Types.ObjectId;
  };
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  relatedResource: {
    type: { type: String, enum: ['evaluation', 'flag', 'exam'] },
    id: { type: Schema.Types.ObjectId }
  },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = model<INotification>('Notification', notificationSchema);