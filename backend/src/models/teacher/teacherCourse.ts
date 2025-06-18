import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacherCourse extends Document {
  name: string;
  codeId: string;
}

const teacherCourseSchema = new Schema<ITeacherCourse>({
  name: { type: String, required: true },
  codeId: { type: String, required: true, unique: true },
});

// Use a unique model name and prevent overwrite
export default mongoose.models.TeacherCourse ||
  mongoose.model<ITeacherCourse>('TeacherCourse', teacherCourseSchema);
