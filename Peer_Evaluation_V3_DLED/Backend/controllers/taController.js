import { User } from '../models/User.js';
import { Enrollment } from '../models/Enrollment.js';
import { Examination } from '../models/Examination.js';
import { Document } from '../models/Document.js';
import { Batch } from '../models/Batch.js';
import { Course } from '../models/Course.js';
import { UIDMap } from '../models/UIDMap.js';
import { TA } from '../models/TA.js';


export const getMyTABatches = async (req, res) => {
  try {
    const taUserId = req.user._id;

    const taAssignments = await TA.find({ userId: taUserId });
    if (!taAssignments.length) {
      return res.status(404).json({ message: 'No batch assigned to you as TA.' });
    }

    const results = await Promise.all(
      taAssignments.map(async (ta) => {
        const batch = await Batch.findById(ta.batch);
        if (!batch) return null;
        const course = await Course.findById(batch.course);
        const instructor = await User.findById(batch.instructor);

        return {
          course_id: course?._id || '',
          courseName: course?.courseName || '',
          courseId: course?.courseId || '',
          batchId: batch.batchId,
          batch_id: batch._id,
          instructorName: instructor?.name || '',
          instructor_id: instructor?._id || '',
        };
      })
    );

    // Filter out any nulls (in case of missing batch/course/instructor)
    const filteredResults = results.filter(Boolean);

    if (!filteredResults.length) {
      return res.status(404).json({ message: 'No valid batch assignments found.' });
    }

    res.json(filteredResults);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch TA batch info.' });
  }
};

export const getPendingEnrollments = async (req, res) => {
  try {
    const { batchId } = req.params;
    const enrollments = await Enrollment.find({ batch: batchId, status: "pending" })
      .populate("student", "name email");

    // console.log("Pending enrollments for batch:", batchId, "->", enrollments);

    if (!enrollments.length) {
      return res.status(404).json({ message: 'No pending enrollments found!' });
    }

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending enrollments!" });
  }
};

export const acceptEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found!" });
    }

    enrollment.status = "active";
    await enrollment.save();

    res.status(200).json({ message: "Enrollment accepted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to accept enrollment!" });
  }
};

export const declineEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found!" });
    }

    enrollment.status = "dropped";
    await enrollment.save();

    res.status(200).json({ message: "Enrollment declined successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to decline enrollment!" });
  }
};