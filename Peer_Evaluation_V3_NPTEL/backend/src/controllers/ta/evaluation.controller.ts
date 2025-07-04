import { Request, Response, NextFunction } from 'express';
import { Evaluation } from '../../models/Evaluation.ts';
import { Flag } from '../../models/Flag.ts';

export const getEvaluationDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const evaluation = await Evaluation.findById(id)
      .populate('evaluator', 'name email')
      .populate('evaluatee', 'name email')
      .populate({
        path: 'exam',
        select: 'title startTime endTime numQuestions createdBy',
        populate: {
          path: 'course',
          select: 'name code startDate endDate'
        }
      });
    if (!evaluation) {
      res.status(404).json({ error: 'Evaluation not found' });
      return;
    }
    const flags = await Flag.find({ evaluation: id }).populate('flaggedBy', 'name email');
    res.json({ evaluation, flags });
  } catch (error) {
    console.error('Error fetching evaluation details:', error);
    next(error);
  }
};
