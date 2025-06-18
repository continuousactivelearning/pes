import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacherBatch extends Document {
  name: string;
  course: mongoose.Types.ObjectId;
}

const teacherBatchSchema = new Schema<ITeacherBatch>({
  name: { type: String, required: true },
  course: { type: Schema.Types.ObjectId, ref: 'TeacherCourse', required: true },
});

//  Avoid OverwriteModelError
export default mongoose.models.TeacherBatch ||
  mongoose.model<ITeacherBatch>('TeacherBatch', teacherBatchSchema);
