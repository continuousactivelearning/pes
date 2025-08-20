import mongoose from "mongoose";

const StatisticsSchema = new mongoose.Schema({
  exam_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Examination",
    required: true,
  },
  avg_score: { type: Number, required: true },
  std_dev: {
    type: Number,
    required: true,
    help_text: "Standard deviation of scores",
  },
});

export const Statistics = mongoose.model("Statistics", StatisticsSchema);
