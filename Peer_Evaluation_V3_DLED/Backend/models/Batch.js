import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema({
  batchId: { type: String, required: true },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

BatchSchema.index({ batchId: 1, course: 1 }, { unique: true });

BatchSchema.pre("save", async function (next) {
  next();
});

BatchSchema.pre("findOneAndDelete", async function (next) {
  const batch = await this.model.findOne(this.getQuery());
  if (batch) {
    await mongoose.model("Enrollment").deleteMany({ batch: batch._id });
    await mongoose.model("Examination").deleteMany({ batch: batch._id });
  }
  next();
});

mongoose.model("Course").schema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    await mongoose.model("Batch").deleteMany({ course: doc._id });
  }
  next();
});

mongoose.model("User").schema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    await mongoose.model("Batch").deleteMany({ instructor: doc._id });
  }
  next();
});

export const Batch = mongoose.model("Batch", BatchSchema);
