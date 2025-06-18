import { Request, Response, NextFunction } from 'express';
import { Exam } from '../../models/Exam.ts';
import { Batch } from '../../models/Batch.ts';
import { User } from '../../models/User.ts';
import { Course } from '../../models/Course.ts';


export const getStudentExams = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.query.studentId as string;
    if (!studentId) {
      res.status(400).json({ error: 'studentId is required' });
      return;
    }

    const student = await User.findById(studentId);
    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    const enrolledCourseIds = student.enrolledCourses;
    const batches = await Batch.find({ students: student._id });
    const batchIds = batches.map((b) => b._id);

    const now = new Date();
    const exams = await Exam.find({
      course: { $in: enrolledCourseIds },
      batch: { $in: batchIds },
      endTime: { $gte: now },
    })
      .populate('course', 'name code')
      .populate('batch', 'name');

    res.json({ exams });
  } catch (err) {
    console.error(err);
    next(err);
  }
};