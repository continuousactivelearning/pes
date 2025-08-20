import mongoose from "mongoose";

const UIDMapSchema = new mongoose.Schema({
  uniqueId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Examination",
    required: true,
  },
});

UIDMapSchema.index({ userId: 1, examId: 1 }, { unique: true });

export const UIDMap = mongoose.model("UIDMap", UIDMapSchema);
