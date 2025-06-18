import { Request, Response } from 'express';
import {User} from '../../models/User.ts';
import bcrypt from 'bcryptjs';

export const getAllStudents = async (_req: Request, res: Response) => {
  try {
    const students = await User.find({ role: 'student' });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students', error });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student', error });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, password, enrolledCourses = [], reputationScore = 0 } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password

    const newStudent = new User({
      name,
      email,
      password: hashedPassword, // Store hashed password
      role: 'student',
      enrolledCourses,
      reputationScore
    });

    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create student', error });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const updatedStudent = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'student' },
      req.body,
      { new: true }
    );

    if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student', error });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const deletedStudent = await User.findOneAndDelete({ _id: req.params.id, role: 'student' });
    if (!deletedStudent) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete student', error });
  }
};