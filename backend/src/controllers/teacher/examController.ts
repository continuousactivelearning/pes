import { Request, Response } from 'express';
import Exam from '../../models/teacher/teacherExam.ts';

export const createExam = async (req: Request, res: Response) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create exam', error: err });
  }
};

export const getExams = async (_: Request, res: Response) => {
  try {
    const exams = await Exam.find().populate('course').populate('batch');
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch exams', error: err });
  }
};
export const updateExam = async (req: Request, res: Response) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedExam);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update exam', error: err });
  }
};

export const deleteExam = async (req: Request, res: Response) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete exam', error: err });
  }
};

