import { Request, Response, NextFunction } from "express";
import { Submission } from "../../models/Submission.ts";
import { Exam } from "../../models/Exam.ts";
import { Evaluation } from "../../models/Evaluation.ts";
import { Batch } from "../../models/Batch.ts";
import { Types } from "mongoose";

export const submitAnswer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("submitAnswer called");
    const { examId, studentId } = req.body;

    if (!studentId) {
      res.status(400).json({ error: "studentId is required in body" });
      return;
    }
    if (!req.file || !examId) {
      res.status(400).json({ error: "PDF file and examId are required" });
      return;
    }

    // Check if exam exists and is within submission window
    const exam = await Exam.findById(examId);
    if (!exam) {
      res.status(404).json({ error: "Exam not found" });
      return;
    }

    const now = new Date();
    if (now < exam.startTime || now > exam.endTime) {
      res.status(403).json({ error: "Submission window is closed" });
      return;
    }

    // Prevent duplicate submissions
    const existing = await Submission.findOne({
      student: studentId,
      exam: examId,
    });
    if (existing) {
      res
        .status(409)
        .json({ error: "You have already submitted your answer" });
      return;
    }

    // Save the student's answer
    await Submission.create({
      student: studentId,
      exam: examId,
      course: exam.course,
      batch: exam.batch,
      answerPdf: req.file.buffer,
      answerPdfMimeType: req.file.mimetype,
      submittedAt: now,
    });

    // ------------------ PEER EVALUATION LOGIC ------------------
    const K = 3;

    const batch = await Batch.findById(exam.batch);
    if (!batch) {
      console.warn("Batch not found for exam, skipping peer assignment");
      res.json({ message: "PDF answer submitted, but peer assignment skipped" });
      return;
    }

    // Filter out the submitting student and shuffle
    const peerIds = batch.students
      .filter((id) => id.toString() !== studentId)
      .sort(() => 0.5 - Math.random())
      .slice(0, K);

    // Insert evaluations for the selected peers
    const evaluationDocs = peerIds.map((evaluatorId) => ({
      exam: exam._id,
      evaluator: new Types.ObjectId(evaluatorId),
      evaluatee: new Types.ObjectId(studentId),
      marks: [],
      feedback: "",
      status: "pending",
      flagged: false,
    }));

    await Evaluation.insertMany(evaluationDocs);
    console.log(`Assigned evaluation to ${peerIds.length} peers`);

    res.json({ message: "PDF answer submitted successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};