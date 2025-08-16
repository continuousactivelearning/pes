import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    courseId: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    openCourse: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
});

export const Course = mongoose.model('Course', CourseSchema);
