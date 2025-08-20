import mongoose from "mongoose";

const ExaminationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  number_of_questions: { type: Number, required: true },
  duration: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  k: { type: Number, required: true },
  total_students: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  flags: { type: Boolean, default: false },
  evaluations_sent: { type: Boolean, default: false },
  solutions: { type: Object },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export const Examination = mongoose.model("Examination", ExaminationSchema);
