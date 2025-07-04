import { Request, Response } from 'express';
import Enrollment from '../../models/Enrollment.ts';
import { Batch } from '../../models/Batch.ts';
import { User } from '../../models/User.ts';

interface AuthRequest extends Request {
  user?: any;
}

// GET: Fetch all pending enrollment requests for this TA's batches
export const getPendingEnrollments = async (req: AuthRequest, res: Response) => {
  try {
    const taId = req.user._id;

    // Find all batch IDs where this user is a TA
    const batches = await Batch.find({ ta: taId }).select('_id');
    const batchIds = batches.map(b => b._id);

    // Get pending enrollment requests for those batches
    const pending = await Enrollment.find({
      batchId: { $in: batchIds },
      status: 'pending',
    }).populate('studentId courseId batchId');

    res.status(200).json(pending);
  } catch (err) {
    console.error('Error fetching pending enrollments:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST: Accept or reject an enrollment request
export const respondToEnrollment = async (req: AuthRequest, res: Response) => {
  try {
    const taId = req.user._id;
    const { enrollmentId } = req.params;
    const { action } = req.body; // "accept" or "reject"

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    const batch = await Batch.findById(enrollment.batchId);
    if (!batch || !batch.ta.includes(taId)) {
      return res.status(403).json({ message: 'Not authorized to manage this enrollment' });
    }

    if (enrollment.status !== 'pending') {
      return res.status(400).json({ message: 'Enrollment already processed' });
    }

    if (action === 'accept') {
      enrollment.status = 'completed';
      await enrollment.save();

      // Add student to batch
      if (!batch.students.includes(enrollment.studentId)) {
        batch.students.push(enrollment.studentId);
        await batch.save();
      }

      // Add course to student's enrolledCourses
      const student = await User.findById(enrollment.studentId);
      if (student && !student.enrolledCourses.includes(enrollment.courseId)) {
        student.enrolledCourses.push(enrollment.courseId);
        await student.save();
      }

      return res.status(200).json({ message: 'Enrollment accepted' });
    } else if (action === 'reject') {
      enrollment.status = 'rejected';
      await enrollment.save();
      return res.status(200).json({ message: 'Enrollment rejected' });
    } else {
      return res.status(400).json({ message: 'Invalid action. Use "accept" or "reject".' });
    }
  } catch (err) {
    console.error('Error responding to enrollment:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
