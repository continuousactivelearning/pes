
import express from "express";
import connectDB from "./config/db.ts";
import teacherRoutes from "./routes/teacher/teacher.routes.ts";
import studentRoutes from "./routes/student/student.routes.ts";
import taRoutes from "./routes/ta/ta.routes.ts"; 

import authRoutes from './routes/authorization/auth.routes.ts';
import adminroutes from './routes/admin/admin.routes.ts';
// import adminstudentroutes from './routes/admin/student_admin.routes.ts';
// import adminteachroutes from './routes/admin/teacher.routes.ts';
import dashboardRoutes from './routes/admin/dashboard.ts';
import admincourseroutes from './routes/admin/admin.routes.ts';




import "./models/Course.ts";
import "./models/Batch.ts";
import "./models/Exam.ts";
import "./models/User.ts";
import "./models/Flag.ts"; 
import "./jobs/evaluationReminder.job.ts";
import "./models/TeacherTicket.ts";

import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
  } else {
    next();
  }
});

app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use('/api/teacher', teacherRoutes);
console.log("Teacher routes mounted at /api/teacher");
app.use("/api/admin",adminroutes);
// app.use("/api/admin/student",adminstudentroutes);
// app.use("/api/admin/teachers",adminteachroutes);
app.use("/api/student", studentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ta', taRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/admin/courses", admincourseroutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
