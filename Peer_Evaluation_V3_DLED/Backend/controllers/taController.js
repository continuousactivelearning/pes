import { User } from '../models/User.js';
import { Enrollment } from '../models/Enrollment.js';
import { Examination } from '../models/Examination.js';
import { Document } from '../models/Document.js';
import { Batch } from '../models/Batch.js';
import { Course } from '../models/Course.js';
import { UIDMap } from '../models/UIDMap.js';
import { TA } from '../models/TA.js';
import { PeerEvaluation } from '../models/PeerEvaluation.js';


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

    const enrollment = await Enrollment.findByIdAndDelete(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found!" });
    }
    res.status(200).json({ message: "Enrollment declined successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to decline enrollment!" });
  }
};

export const getFlaggedEvaluations = async (req, res) => {
  try {
    const { batchId } = req.params;
    if (!batchId) {
      return res.status(400).json({ message: "Batch ID is required!" });
    }

    const exams = await Examination.find({
      batch: batchId,
      flags: true,
      evaluations_sent: true,
    });

    if (!exams.length) {
      return res.status(404).json({ message: "No exams found for the batch!" });
    }

    const examIds = exams.map((exam) => exam._id);

    const evaluations = await PeerEvaluation.find({
      exam: { $in: examIds },
      $or: [{ eval_status: "pending", ticket: { $in: [0, 1] } }, { eval_status: "completed", ticket: 1 }],
    }).populate("document")
    .populate("exam")
    .populate("evaluator")
    .populate("student");

    if (!evaluations.length) {
      return res.status(404).json({ message: "No flagged evaluations found!" });
    }

    const groupedEvaluations = exams.map((exam) => ({
      exam: exam,
      evaluations: evaluations.filter((evaluation) => evaluation.exam._id.toString() === exam._id.toString()),
    }));

    res.status(200).json(groupedEvaluations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flagged evaluations." });
  }
};

export const updateFlaggedEvaluation = async (req, res) => {
  try {
    const { evaluationId } = req.params;
    const updateData = req.body;

    const updatedEvaluation = await PeerEvaluation.findByIdAndUpdate(
      evaluationId, 
      { ...updateData, ticket: 0, eval_status: "completed", evaluated_on: new Date(), evaluated_by: req.user._id }, 
      { new: true }
    );
    
    if (!updatedEvaluation) {
      return res.status(404).json({ message: "Evaluation not found!" });
    }
    
    res.status(200).json({ message: "Evaluation updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update flagged evaluation!" });
  }
};

export const removeFlaggedEvaluation = async (req, res) => {
  try {
    const { evaluationId } = req.params;

    const updatedEvaluation = await PeerEvaluation.findByIdAndUpdate(
      evaluationId,
      { ticket: 0 },
      { new: true }
    );

    if (!updatedEvaluation) {
      return res.status(404).json({ message: "Evaluation not found!" });
    }

    res.status(200).json({ message: "Evaluation rejected and unflagged successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject evaluation!" });
  }
};

export const taFlagEvaluation = async (req, res) => {
  try {
    const { evaluationId } = req.params;

    const updatedEvaluation = await PeerEvaluation.findByIdAndUpdate(
      evaluationId,
      { ticket: 2, evaluated_on: new Date(), evaluated_by: req.user._id },
      { new: true }
    );

    if (!updatedEvaluation) {
      return res.status(404).json({ message: "Evaluation not found!" });
    }

    res.status(200).json({ message: "Evaluation flagged to teacher successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to flag evaluation!" });
  }
};