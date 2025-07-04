// middlewares/authorizeTA.ts
import { Request, Response, NextFunction } from 'express';
import { Batch } from '../models/Batch.ts'; 

export const authorizeTA = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?._id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: No user found' });
  }

  const isTA = await Batch.exists({ ta: userId });

  if (!isTA) {
    return res.status(403).json({ error: 'Access denied: You are not a TA for any batch' });
  }

  next();
};
