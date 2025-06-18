import express from "express";
import connectDB from "./config/db.ts";
import studentRoutes from "./routes/student/student.routes.ts";
import taRoutes from "./routes/ta/ta.routes.ts"; // Add this import
import batchRoutes from "./routes/teacher/batch.routes.ts";
import courseRoutes from "./routes/teacher/course.route.ts";
import examRoutes from "./routes/teacher/exam.routes.ts";
import "./models/Course.ts";
import "./models/Batch.ts";
import "./models/Exam.ts";
import "./models/User.ts";
import "./models/Flag.ts"; // Make sure Flag model is imported
import "./models/Notification.ts";
import "./models/teacher/teacherBatch.ts";
import "./models/teacher/teacherCourse.ts";
import "./models/teacher/teacherExam.ts";
import "./jobs/evaluationReminder.job.ts";
import authRoutes from './routes/authorization/auth.routes.ts';
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/student", studentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ta', taRoutes); // Add TA routes
app.use('/api/teacher/batch',batchRoutes);
app.use('/api/teacher/course',courseRoutes);
app.use('/api/teacher/exam',examRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});