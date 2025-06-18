import { Request, Response, NextFunction } from 'express';
import { Evaluation } from '../../models/Evaluation.ts';
import { Exam } from '../../models/Exam.ts';
import { User } from '../../models/User.ts';

export const submitEvaluation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const evaluatorId = req.query.studentId as string;
    const { examId, evaluateeId, marks, feedback } = req.body;

    if (!evaluatorId || !examId || !evaluateeId || !marks) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const existing = await Evaluation.findOne({
      exam: examId,
      evaluator: evaluatorId,
      evaluatee: evaluateeId,
    });

    if (existing) {
      res.status(400).json({ error: 'Evaluation already submitted' });
      return;
    }

    const evaluation = new Evaluation({
      exam: examId,
      evaluator: evaluatorId,
      evaluatee: evaluateeId,
      marks,
      feedback,
      status: 'completed',
    });

    await evaluation.save();

    await User.findByIdAndUpdate(evaluatorId, {
      $inc: { reputationScore: 1 },
    });

    res.status(201).json({ message: 'Evaluation submitted successfully' });
  } catch (err) {
    console.error(err);
    next(err);
  }
};