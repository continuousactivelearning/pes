import { Request, Response, NextFunction } from 'express';
import { Flag } from '../../models/Flag.ts';
import { Evaluation } from '../../models/Evaluation.ts';
import { User } from '../../models/User.ts';
import { Notification } from '../../models/Notification.ts';

/**
 * Get all flagged evaluations that need TA review
 */
export const getFlaggedEvaluations = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    // Find all flags with pending status
    const flaggedEvaluations = await Flag.find({ 
      resolutionStatus: 'pending' 
    })
    .populate({
      path: 'evaluation',
      populate: [
        { path: 'evaluator', select: 'name email' },
        { path: 'evaluatee', select: 'name email' },
        { path: 'exam', select: 'title' }
      ]
    })
    .populate('flaggedBy', 'name email');

    res.json({ flaggedEvaluations });
  } catch (error) {
    console.error('Error fetching flagged evaluations:', error);
    next(error);
  }
};

/**
 * Get detailed information about a specific evaluation
 */
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
      .populate('exam');
    
    if (!evaluation) {
      res.status(404).json({ error: 'Evaluation not found' });
      return;
    }

    const flags = await Flag.find({ 
      evaluation: id 
    }).populate('flaggedBy', 'name email');

    res.json({ evaluation, flags });
  } catch (error) {
    console.error('Error fetching evaluation details:', error);
    next(error);
  }
};

/**
 * Resolve a flagged evaluation
 */
export const resolveFlag = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const { flagId } = req.params;
    const { resolution, newMarks, feedback } = req.body;
    const taId = (req as any).user.id; // TA ID from auth middleware
    
    const flag = await Flag.findById(flagId);
    if (!flag) {
      res.status(404).json({ error: 'Flag not found' });
      return;
    }
    
    // Update flag status
    flag.resolutionStatus = 'resolved';
    flag.resolvedBy = taId;
    await flag.save();
    
    // If new marks are provided, update the evaluation
    if (newMarks) {
      await Evaluation.findByIdAndUpdate(flag.evaluation, { 
        marks: newMarks,
        feedback: feedback || undefined,
      });
    }
    
    // Notify the student who flagged the evaluation
    await Notification.create({
      recipient: flag.flaggedBy,
      message: `Your flagged evaluation has been resolved by a TA.`,
      relatedResource: {
        type: 'flag',
        id: flag._id
      }
    });
    
    res.json({ 
      message: 'Flag resolved successfully', 
      resolution 
    });
  } catch (error) {
    console.error('Error resolving flag:', error);
    next(error);
  }
};

/**
 * Escalate a flagged evaluation to a teacher
 */
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
    
    // Update flag status to escalated
    flag.resolutionStatus = 'escalated';
    flag.escalationReason = reason;
    await flag.save();
    
    // Find teachers to notify
    const teachers = await User.find({ role: 'teacher' }).select('_id');
    
    // Create notifications for teachers
    const teacherNotifications = teachers.map(teacher => ({
      recipient: teacher._id,
      message: 'A flagged evaluation has been escalated and requires your attention',
      relatedResource: {
        type: 'flag',
        id: flag._id
      }
    }));
    
    if (teacherNotifications.length > 0) {
      await Notification.insertMany(teacherNotifications);
    }
    
    // Also notify the student who flagged the evaluation
    await Notification.create({
      recipient: flag.flaggedBy,
      message: 'Your flagged evaluation has been escalated to a teacher for review',
      relatedResource: {
        type: 'flag',
        id: flag._id
      }
    });
    
    res.json({ 
      message: 'Flag escalated to teacher successfully',
      reason
    });
  } catch (error) {
    console.error('Error escalating flag:', error);
    next(error);
  }
};