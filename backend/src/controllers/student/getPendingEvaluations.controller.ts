import { Request, Response, NextFunction } from 'express';
import { Evaluation } from '../../models/Evaluation.ts';
import { Exam } from '../../models/Exam.ts';
import { Batch } from '../../models/Batch.ts';
import { User } from '../../models/User.ts';

export const getPendingEvaluations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = (req.query.studentId as string)?.trim();
    const examId = (req.query.examId as string)?.trim();

    if (!studentId || !examId) {
      res.status(400).json({ error: 'studentId and examId are required' });
      return;
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      res.status(404).json({ error: 'Exam not found' });
      return;
    }

    const batch = await Batch.findById(exam.batch).populate('students', '_id name email');
    if (!batch) {
      res.status(404).json({ error: 'Batch not found' });
      return;
    }

    const allStudentsInBatch = batch.students as any[];

    const evaluated = await Evaluation.find({
      exam: examId,
      evaluator: studentId,
    }).select('evaluatee');

    const evaluatedIds = new Set(evaluated.map((e) => e.evaluatee.toString()));

    const pending = allStudentsInBatch.filter(
      (s) => s._id.toString() !== studentId && !evaluatedIds.has(s._id.toString())
    );

    res.json({ evaluatees: pending });
  } catch (err) {
    console.error(err);
    next(err);
  }
};