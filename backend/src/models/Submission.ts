import { Schema, model, Document, Types } from "mongoose";

export interface ISubmission extends Document {
  student: Types.ObjectId;
  exam: Types.ObjectId;
  course: Types.ObjectId;
  batch: Types.ObjectId;
  answerPdf: Buffer;
  answerPdfMimeType: string;
  submittedAt: Date;
}

const submissionSchema = new Schema<ISubmission>({
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  exam: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  batch: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
  answerPdf: { type: Buffer, required: true },
  answerPdfMimeType: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

submissionSchema.index({ student: 1, exam: 1 }, { unique: true });

export const Submission = model<ISubmission>("Submission", submissionSchema);