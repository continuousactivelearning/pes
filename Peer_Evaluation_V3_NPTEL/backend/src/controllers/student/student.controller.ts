import { Request, Response } from 'express';
import { Batch } from '../../models/Batch.ts'; // Make sure the path is correct

interface AuthRequest extends Request {
  user?: any;
}

export const getStudentProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const student = req.user;

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    // Check if the student is a TA in any batch
    const isTA = await Batch.exists({ ta: student._id });

    res.json({
      id: student._id,
      name: student.name,
      email: student.email,
      role: "student",
      isTA: !!isTA, // Ensures it's a boolean
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
