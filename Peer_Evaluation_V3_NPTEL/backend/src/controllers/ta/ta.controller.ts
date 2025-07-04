import { Request, Response } from 'express';
import { Course, ICourse } from '../../models/Course.ts';
import { Batch } from '../../models/Batch.ts';

interface AuthRequest extends Request {
  user?: any;
}

export const getTAProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const name = req.user?.name;
    const email = req.user?.email;

    if (!userId) {
      res.status(400).json({ error: 'Invalid user' });
      return;
    }

    // ✅ Fix: changed from 'tas' to 'ta'
    const batches = await Batch.find({ ta: userId }).populate<{ course: ICourse }>('course');

    const taFor = batches.map(batch => ({
      course: {
        name: batch.course.name,
        code: batch.course.code,
      },
      batch: {
        _id: batch._id,
        name: batch.name,
      }
    }));

    res.json({
      name,
      email,
      taFor,
    });

  } catch (err) {
    console.error("Error in getTAProfile:", err);
    res.status(500).json({ error: 'Server error' });
  }
};