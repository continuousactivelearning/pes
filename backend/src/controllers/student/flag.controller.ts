import { Request, Response, NextFunction } from 'express';
import { Flag } from '../../models/Flag.ts';
import { Evaluation } from '../../models/Evaluation.ts';

export const flagEvaluation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { evaluationId, flaggedById } = req.body;

    if (!evaluationId || !flaggedById) {
      res.status(400).json({ error: 'Missing evaluationId or flaggedById' });
      return;
    }

    const evaluation = await Evaluation.findById(evaluationId);
    if (!evaluation) {
      res.status(404).json({ error: 'Evaluation not found' });
      return;
    }

    // Avoid duplicate flagging
    const alreadyFlagged = await Flag.findOne({
      evaluation: evaluationId,
      flaggedBy: flaggedById,
    });

    if (alreadyFlagged) {
      res.status(409).json({ error: 'You have already flagged this evaluation' });
      return;
    }

    // Mark evaluation as flagged
    evaluation.flagged = true;
    await evaluation.save();

    // Create flag document
    await Flag.create({
      evaluation: evaluationId,
      flaggedBy: flaggedById,
      resolutionStatus: 'pending',
    });

    res.status(201).json({ message: 'Evaluation flagged successfully' });
  } catch (err) {
    console.error(err);
    next(err);
  }
};