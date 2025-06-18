import { Request, Response } from 'express';
import Course from '../../models/teacher/teacherCourse.ts';
import  { generateCourseCode } from '../../utils/teacher.codeGenerator.ts';

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const codeId = generateCourseCode(name);
    const course = new Course({ name, codeId });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create course', error: err });
  }
};

export const getCourses = async (_: Request, res: Response) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses', error: err });
  }
};
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update course', error: err });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete course', error: err });
  }
};