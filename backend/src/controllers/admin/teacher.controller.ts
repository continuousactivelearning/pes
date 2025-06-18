import { Request, Response } from 'express';
import { User } from '../../models/User.ts';

// Create teacher
export const createTeacher = async (req: Request, res: Response) => {
  try {
    const newTeacher = new User({ ...req.body, role: 'teacher' });
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create teacher', details: err });
  }
};

// Get all teachers
export const getAllTeachers = async (_req: Request, res: Response) => {
  try {
    const teachers = await User.find({ role: 'teacher' });
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
};

// Get teacher by id
export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const teacher = await User.findOne({ _id: req.params.id, role: 'teacher' });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch teacher' });
  }
};

// Update teacher
export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const updated = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'teacher' },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Teacher not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update teacher' });
  }
};

// Delete teacher
export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const deleted = await User.findOneAndDelete({ _id: req.params.id, role: 'teacher' });
    if (!deleted) return res.status(404).json({ error: 'Teacher not found' });
    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
};