import { Request, Response, NextFunction } from 'express';
import { Evaluation } from '../../models/Evaluation.ts';

export const getEvaluationResults = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.query.studentId as string;
    const examId = req.query.examId as string;

    if (!studentId || !examId) {
      res.status(400).json({ error: 'studentId and examId are required' });
      return;
    }

    const evaluations = await Evaluation.find({
      exam: examId,
      evaluatee: studentId,
      status: 'completed',
    });

    if (!evaluations || evaluations.length === 0) {
      res.status(404).json({ message: 'No evaluations found' });
      return;
    }

    const questionCount = evaluations[0].marks.length;
    const totalMarks = Array(questionCount).fill(0);
    const feedback: string[] = [];

    evaluations.forEach((evalDoc) => {
      evalDoc.marks.forEach((mark, i) => {
        totalMarks[i] += mark;
      });
      if (evalDoc.feedback) {
        feedback.push(evalDoc.feedback);
      }
    });

    const averageMarks = totalMarks.map((sum) => parseFloat((sum / evaluations.length).toFixed(2)));

    res.json({
      marks: averageMarks,
      average: parseFloat(
        (averageMarks.reduce((acc, m) => acc + m, 0) / questionCount).toFixed(2)
      ),
      feedback,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};