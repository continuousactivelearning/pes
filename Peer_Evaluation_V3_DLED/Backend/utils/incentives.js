import { Enrollment } from "../models/Enrollment.js";
import { PeerEvaluation } from "../models/PeerEvaluation.js";
import { Statistics } from "../models/Statistics.js";
import { Incentivization } from "../models/Incentivization.js";

export const calculateIncentivesForBatch = async (batchId, examId) => {
  const PARTICIPATION_REWARD = 1;
  const BASE_EVALUATION_REWARD = 2;
  const ACCURACY_BONUS_MULTIPLIER = 3;
  const MAX_ACCURACY_BONUS = 5;

  try {
    const examStats = await Statistics.findOne({ exam_id: examId });
    if (!examStats) {
      return await calculateBasicIncentives(batchId, examId);
    }

    const enrolledStudents = await Enrollment.find({
      batch: batchId,
      status: "active",
    }).populate("student");

    if (!enrolledStudents.length) {
      return {
        success: false,
        message: "No enrolled students found for this batch!",
      };
    }

    const evaluations = await PeerEvaluation.find({ exam: examId }).populate(
      "student evaluator"
    );

    if (!evaluations.length) {
      return {
        success: false,
        message: "No evaluations found for this exam!",
      };
    }

    const studentAverages = calculateStudentAverages(evaluations);

    for (const enrollment of enrolledStudents) {
      const studentId = enrollment.student._id;

      const studentParticipated = evaluations.some(
        (evals) => evals.student._id.toString() === studentId.toString()
      );

      const evaluationsByStudent = evaluations.filter(
        (evals) =>
          evals.evaluator &&
          evals.evaluator._id.toString() === studentId.toString() &&
          evals.eval_status === "completed"
      );

      let examRewards = 0;

      if (studentParticipated) {
        examRewards += PARTICIPATION_REWARD;
      }

      let totalAccuracyScore = 0;
      let validEvaluations = 0;

      for (const evaluation of evaluationsByStudent) {
        if (
          evaluation.ticket !== 0 ||
          !evaluation.evaluated_by ||
          evaluation.evaluated_by.toString() !== studentId.toString()
        ) {
          continue;
        }

        const accuracyScore = calculateEvaluationAccuracy(
          evaluation,
          studentAverages,
          examStats
        );

        if (accuracyScore !== null) {
          totalAccuracyScore += accuracyScore;
          validEvaluations++;

          examRewards += BASE_EVALUATION_REWARD;

          const accuracyBonus = accuracyScore * MAX_ACCURACY_BONUS;
          examRewards += accuracyBonus;
        }
      }

      if (studentParticipated || evaluationsByStudent.length > 0) {
        const incentiveRecord = await Incentivization.findOne({
          batch: batchId,
          student: studentId,
        });

        if (incentiveRecord) {
          incentiveRecord.total_rewards += examRewards;
          incentiveRecord.exam_count += 1;
          incentiveRecord.total_evaluations += evaluationsByStudent.length;
          incentiveRecord.correct_evaluations += validEvaluations;

          if (!incentiveRecord.average_accuracy) {
            incentiveRecord.average_accuracy = 0;
          }

          if (validEvaluations > 0) {
            const currentAccuracy = totalAccuracyScore / validEvaluations;
            incentiveRecord.average_accuracy =
              (incentiveRecord.average_accuracy *
                (incentiveRecord.exam_count - 1) +
                currentAccuracy) /
              incentiveRecord.exam_count;
          }

          incentiveRecord.last_updated = new Date();
          await incentiveRecord.save();
        } else {
          const avgAccuracy =
            validEvaluations > 0 ? totalAccuracyScore / validEvaluations : 0;

          await Incentivization.create({
            batch: batchId,
            student: studentId,
            total_rewards: examRewards,
            exam_count: 1,
            total_evaluations: evaluationsByStudent.length,
            correct_evaluations: validEvaluations,
            average_accuracy: avgAccuracy,
          });
        }
      }
    }

    return {
      success: true,
      message:
        "Incentives calculated successfully with accuracy-based rewards!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to calculate incentives!",
    };
  }
};

const calculateStudentAverages = (evaluations) => {
  const studentTotals = {};

  evaluations.forEach((evaluation) => {
    if (evaluation.eval_status !== "completed") return;

    const studentId = evaluation.student._id.toString();
    const score = Array.isArray(evaluation.score)
      ? evaluation.score.reduce((a, b) => a + b, 0)
      : evaluation.score;

    if (!studentTotals[studentId]) {
      studentTotals[studentId] = { total: 0, count: 0 };
    }

    studentTotals[studentId].total += score;
    studentTotals[studentId].count += 1;
  });

  const studentAverages = {};
  Object.keys(studentTotals).forEach((studentId) => {
    studentAverages[studentId] =
      studentTotals[studentId].total / studentTotals[studentId].count;
  });

  return studentAverages;
};

const calculateEvaluationAccuracy = (
  evaluation,
  studentAverages,
  examStats
) => {
  try {
    const evaluatedStudentId = evaluation.student._id.toString();
    const evaluatedStudentAverage = studentAverages[evaluatedStudentId];

    if (!evaluatedStudentAverage) return null;

    const evaluationScore = Array.isArray(evaluation.score)
      ? evaluation.score.reduce((a, b) => a + b, 0)
      : evaluation.score;

    const deviation = Math.abs(evaluationScore - evaluatedStudentAverage);

    const normalizedDeviation =
      examStats.std_dev > 0 ? deviation / examStats.std_dev : 0;

    const accuracyScore = Math.exp(-normalizedDeviation);

    return Math.max(0, Math.min(1, accuracyScore));
  } catch (error) {
    return null;
  }
};

const calculateBasicIncentives = async (batchId, examId) => {
  const PARTICIPATION_REWARD = 1;
  const CORRECT_EVALUATION_REWARD = 5;

  try {
    const enrolledStudents = await Enrollment.find({
      batch: batchId,
      status: "active",
    }).populate("student");

    if (!enrolledStudents.length) {
      return {
        success: false,
        message: "No enrolled students found for this batch!",
      };
    }

    const evaluations = await PeerEvaluation.find({ exam: examId }).populate(
      "student evaluator"
    );

    if (!evaluations.length) {
      return {
        success: false,
        message: "No evaluations found for this exam!",
      };
    }

    for (const enrollment of enrolledStudents) {
      const studentId = enrollment.student._id;

      const studentParticipated = evaluations.some(
        (evals) => evals.student._id.toString() === studentId.toString()
      );

      const evaluationsByStudent = evaluations.filter(
        (evals) =>
          evals.evaluator &&
          evals.evaluator._id.toString() === studentId.toString() &&
          evals.eval_status === "completed"
      );

      const correctEvaluations = evaluationsByStudent.filter(
        (evals) =>
          evals.ticket === 0 &&
          evals.evaluated_by &&
          evals.evaluated_by.toString() === studentId.toString()
      );

      let examRewards = 0;
      if (studentParticipated) {
        examRewards += PARTICIPATION_REWARD;
      }
      examRewards += correctEvaluations.length * CORRECT_EVALUATION_REWARD;

      if (studentParticipated || evaluationsByStudent.length > 0) {
        const incentiveRecord = await Incentivization.findOne({
          batch: batchId,
          student: studentId,
        });

        if (incentiveRecord) {
          incentiveRecord.total_rewards += examRewards;
          incentiveRecord.exam_count += 1;
          incentiveRecord.total_evaluations += evaluationsByStudent.length;
          incentiveRecord.correct_evaluations += correctEvaluations.length;
          incentiveRecord.last_updated = new Date();
          await incentiveRecord.save();
        } else {
          await Incentivization.create({
            batch: batchId,
            student: studentId,
            total_rewards: examRewards,
            exam_count: 1,
            total_evaluations: evaluationsByStudent.length,
            correct_evaluations: correctEvaluations.length,
          });
        }
      }
    }

    return {
      success: true,
      message: "Incentives calculated successfully with basic reward system!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to calculate incentives!",
    };
  }
};
