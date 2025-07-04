import mongoose, { Schema, Document } from "mongoose";

export interface IEnrollment extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  batchId: mongoose.Types.ObjectId;
  enrollmentDate: Date;
  status: "pending" | "completed" | "rejected";
  notes?: string;
}

const EnrollmentSchema: Schema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", required: true }, 
    enrollmentDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "completed", "rejected"],
      default: "pending",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);
