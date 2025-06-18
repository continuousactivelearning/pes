import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacherExam extends Document {
  title: string;
  date: Date;
  course: mongoose.Types.ObjectId;
  batch: mongoose.Types.ObjectId;
}

const teacherExamSchema = new Schema<ITeacherExam>({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  course: { type: Schema.Types.ObjectId, ref: 'TeacherCourse', required: true },
  batch: { type: Schema.Types.ObjectId, ref: 'TeacherBatch', required: true },
});

// Avoid OverwriteModelError
export default mongoose.models.TeacherExam ||
  mongoose.model<ITeacherExam>('TeacherExam', teacherExamSchema);
