import { Request, Response, NextFunction } from 'express';
import { Flag } from '../../models/Flag.ts';

export const getTAStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pendingFlags = await Flag.countDocuments({ resolutionStatus: 'pending' });
    const resolvedFlags = await Flag.countDocuments({ resolutionStatus: 'resolved' });
    const escalatedFlags = await Flag.countDocuments({ resolutionStatus: 'escalated' });
    res.json({
      stats: {
        pendingFlags,
        resolvedFlags,
        escalatedFlags,
        totalFlags: pendingFlags + resolvedFlags + escalatedFlags
      }
    });
  } catch (error) {
    console.error('Error fetching TA stats:', error);
    next(error);
  }
};
