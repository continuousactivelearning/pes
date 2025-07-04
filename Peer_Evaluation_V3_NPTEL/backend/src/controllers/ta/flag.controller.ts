import { Request, Response, NextFunction } from 'express';
import { Flag } from '../../models/Flag.ts';
import { Evaluation } from '../../models/Evaluation.ts';
import { Notification } from '../../models/Notification.ts';
import { User } from '../../models/User.ts';

export const getFlaggedEvaluations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const flaggedEvaluations = await Flag.find({
      resolutionStatus: 'pending'
    })
      .populate({
        path: 'evaluation',
        populate: [
          { path: 'evaluator', select: 'name email' },
          { path: 'evaluatee', select: 'name email' },
          {
            path: 'exam',
            select: 'title startTime endTime numQuestions createdBy',
            populate: {
              path: 'course',
              select: 'name code startDate endDate'
            }
          }
        ]
      })
      .populate('flaggedBy', 'name email');

    res.json({ flaggedEvaluations });
  } catch (error) {
    console.error('Error fetching flagged evaluations:', error);
    next(error);
  }
};

export const resolveFlag = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { flagId } = req.params;
    const { resolution, newMarks, feedback } = req.body;
    const taId = (req as any).user.id;

    const flag = await Flag.findById(flagId).populate('evaluation');
    if (!flag) {
      res.status(404).json({ error: 'Flag not found' });
      return;
    }

    flag.resolutionStatus = 'resolved';
    flag.resolvedBy = taId;
    await flag.save();

    if (newMarks) {
      const evaluation = await Evaluation.findById(flag.evaluation)
        .populate({ path: 'exam', select: 'numQuestions' });
      if (!evaluation) {
        res.status(404).json({ error: 'Evaluation not found' });
        return;
      }
      if (!Array.isArray(newMarks)) {
        res.status(400).json({ error: 'Marks must be provided as an array' });
        return;
      }
      const expectedQuestions = (evaluation.exam as any)?.numQuestions || evaluation.marks.length;
      if (newMarks.length !== expectedQuestions) {
        res.status(400).json({ error: `Expected ${expectedQuestions} marks, but received ${newMarks.length}` });
        return;
      }
      for (const mark of newMarks) {
        if (typeof mark !== 'number' || mark < 0 || mark > 20) {
          res.status(400).json({ error: 'Each mark must be a number between 0 and 20' });
          return;
        }
      }
      await Evaluation.findByIdAndUpdate(flag.evaluation, {
        marks: newMarks,
        feedback: feedback || evaluation.feedback,
        status: 'completed'
      });
    }

    await Notification.create({
      recipient: flag.flaggedBy,
      message: `Your flagged evaluation has been resolved by a TA.`,
      relatedResource: { type: 'flag', id: flag._id }
    });

    res.json({ message: 'Flag resolved successfully', resolution });
  } catch (error) {
    console.error('Error resolving flag:', error);
    next(error);
  }
};

export const escalateToTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { flagId } = req.params;
    const { reason } = req.body;
    const flag = await Flag.findById(flagId);
    if (!flag) {
      res.status(404).json({ error: 'Flag not found' });
      return;
    }
    flag.resolutionStatus = 'escalated';
    flag.escalationReason = reason;
    await flag.save();
    const teachers = await User.find({ role: 'teacher' }).select('_id');
    const teacherNotifications = teachers.map(teacher => ({
      recipient: teacher._id,
      message: 'A flagged evaluation has been escalated and requires your attention',
      relatedResource: { type: 'flag', id: flag._id }
    }));
    if (teacherNotifications.length > 0) {
      await Notification.insertMany(teacherNotifications);
    }
    await Notification.create({
      recipient: flag.flaggedBy,
      message: 'Your flagged evaluation has been escalated to a teacher for review',
      relatedResource: { type: 'flag', id: flag._id }
    });
    res.json({ message: 'Flag escalated to teacher successfully', reason });
  } catch (error) {
    console.error('Error escalating flag:', error);
    next(error);
  }
};
