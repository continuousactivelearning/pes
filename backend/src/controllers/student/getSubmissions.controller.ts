import { Request, Response, NextFunction } from "express";
import { Submission } from "../../models/Submission.ts";

export const getSubmissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentId, examId } = req.query;

    if (!studentId || !examId) {
      res.status(400).json({
        error: "studentId and examId are required as query parameters",
      });
      return;
    }

    const submissions = await Submission.find({
      student: studentId,
      exam: examId,
    });

    res.json({ submissions });
  } catch (err) {
    next(err);
  }
};