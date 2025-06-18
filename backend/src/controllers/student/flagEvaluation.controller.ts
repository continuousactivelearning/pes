import { Request, Response, NextFunction } from 'express';
import { Flag } from '../../models/Flag.ts';
import { Evaluation } from '../../models/Evaluation.ts';
import { User } from '../../models/User.ts';
import { Notification } from '../../models/Notification.ts';

export const flagEvaluation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.query.studentId as string;
    const { evaluationId, reason } = req.body;

    if (!studentId || !evaluationId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Check if the evaluation exists
    const evaluation = await Evaluation.findById(evaluationId);
    if (!evaluation) {
      res.status(404).json({ error: 'Evaluation not found' });
      return;
    }

    // Check if the student is the evaluatee
    if (evaluation.evaluatee.toString() !== studentId) {
      res.status(403).json({ error: 'You can only flag evaluations for your own submissions' });
      return;
    }

    // Check if this evaluation is already flagged
    const existingFlag = await Flag.findOne({ evaluation: evaluationId });
    if (existingFlag) {
      res.status(400).json({ error: 'This evaluation has already been flagged' });
      return;
    }

    // Create a new flag
    const flag = new Flag({
      evaluation: evaluationId,
      flaggedBy: studentId,
      reason,
      resolutionStatus: 'pending',
    });

    await flag.save();

    // Update evaluation to mark it as flagged
    evaluation.flagged = true;
    await evaluation.save();

    // Find all TAs to notify them
    const tas = await User.find({ role: 'ta' }).select('_id');

    // Create notifications for all TAs
    const notifications = tas.map(ta => ({
      recipient: ta._id,
      message: 'New evaluation flag requires your review',
      relatedResource: {
        type: 'flag',
        id: flag._id
      }
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({ 
      message: 'Evaluation flagged successfully',
      flag: flag._id
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};