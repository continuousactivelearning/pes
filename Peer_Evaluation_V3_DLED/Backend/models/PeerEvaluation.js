import mongoose from "mongoose";

const PeerEvaluationSchema = new mongoose.Schema({
  evaluator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  evaluated_on: { type: Date, default: Date.now },
  deadline: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  uid: { type: mongoose.Schema.Types.ObjectId, ref: "UIDMap", required: true },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Examination",
    required: true,
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true,
  },
  feedback: { type: [String], required: true, default: [] },
  ticket: { type: Number, required: true, default: 0 },
  score: { type: [Number], required: true, default: [] },
  eval_status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  evaluated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export const PeerEvaluation = mongoose.model(
  "PeerEvaluation",
  PeerEvaluationSchema
);
