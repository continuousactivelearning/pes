import mongoose from "mongoose";

const IncentivizationSchema = new mongoose.Schema(
  {
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    total_rewards: {
      type: Number,
      default: 0,
    },
    exam_count: {
      type: Number,
      default: 0,
    },
    total_evaluations: {
      type: Number,
      default: 0,
    },
    correct_evaluations: {
      type: Number,
      default: 0,
    },
    average_accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

IncentivizationSchema.index({ batch: 1, student: 1 }, { unique: true });

export const Incentivization = mongoose.model(
  "Incentivization",
  IncentivizationSchema
);
