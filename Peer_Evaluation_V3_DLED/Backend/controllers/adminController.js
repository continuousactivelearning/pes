import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { User } from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import { Course } from '../models/Course.js';
import emailExistence from 'email-existence';
import { Batch } from '../models/Batch.js';
import { Enrollment } from '../models/Enrollment.js';
import { Examination } from '../models/Examination.js';
import mongoose from 'mongoose';


export const updateRole = async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: 'Email and role are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'Role updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const addCourse = async (req, res) => {
  const { courseId, courseName, openCourse, startDate, endDate } = req.body;

  if (!courseId || !courseName || !startDate || !endDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const courseExists = await Course.findOne({ courseId });
    if (courseExists) {
      return res.status(400).json({ message: 'Course ID already exists.' });
    }

    const newCourse = new Course({
      courseId,
      courseName,
      openCourse,
      startDate,
      endDate,
    });

    await newCourse.save();

    res.status(201).json({ message: 'Course added successfully.', course: newCourse });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password'); // exclude password if stored
    res.status(200).json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Server error while fetching teachers' });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find(); // No populate needed
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error while fetching courses' });
  }
};

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        
        res.json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update course by ID
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { courseId, courseName, openCourse, startDate, endDate } = req.body;

        // Check if course exists
        const existingCourse = await Course.findById(id);
        if (!existingCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if courseId is being changed and if it already exists
        if (courseId !== existingCourse.courseId) {
            const duplicateCourse = await Course.findOne({ courseId });
            if (duplicateCourse) {
                return res.status(400).json({ message: 'Course ID already exists' });
            }
        }

        // Update the course
        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            {
                courseId,
                courseName,
                openCourse,
                startDate,
                endDate
            },
            { new: true }
        );

        res.json({ 
            message: 'Course updated successfully', 
            course: updatedCourse 
        });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate('course', 'courseName')         // Populates course name
      .populate('instructor', 'name');          // Populates instructor name

    res.status(200).json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ message: 'Server error while fetching batches.' });
  }
};

export const addBatch = async (req, res) => {
  const { batchId, instructor, course } = req.body;

  if (!batchId || !instructor || !course) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Find the instructor's ObjectId based on the name
    const instructorData = await User.findOne({ name: instructor, role: 'teacher' });
    if (!instructorData) {
      return res.status(404).json({ message: 'Instructor not found.' });
    }

    // Check for existing batch with same batchId and course combination
    const batchExists = await Batch.findOne({ batchId, course });
    if (batchExists) {
      return res.status(400).json({ message: 'Batch with this ID already exists for the selected course.' });
    }

    const newBatch = new Batch({
      batchId,
      instructor: instructorData._id, // Use the ObjectId of the instructor
      course,
    });

    await newBatch.save();

    res.status(201).json({ message: 'Batch added successfully.', batch: newBatch });
  } catch (error) {
    console.error('Error adding batch:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const getDashboardCounts = async (req, res) => {
  try {
    const [teacherCount, courseCount, studentCount] = await Promise.all([
      User.countDocuments({ role: 'teacher' }),
      Course.countDocuments(),
      User.countDocuments({ role: 'student' })
    ]);

    res.status(200).json({
      teachers: teacherCount,
      courses: courseCount,
      students: studentCount,
    });
  } catch (error) {
    console.error('Error fetching dashboard counts:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const deleteCourse = async (req, res) => {
  const courseId = req.params.courseId || req.body.courseId;
  // console.log('Received courseId:', courseId);

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: 'Invalid course ID.' });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

     // Delete all batches associated with this course
    const batches = await Batch.find({ course: course._id });
    const batchIds = batches.map(batch => batch._id);

    // Delete all batches associated with this course
    await Batch.deleteMany({ course: course._id });

    // Delete all enrollments associated with this course
    await Enrollment.deleteMany({ course: courseId });

    // Delete all examinations associated with the batches of this course
    await Examination.deleteMany({ batch: { $in: batchIds } });

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    res.status(200).json({ message: 'Course and associated batches deleted successfully.' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const deleteBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    // Delete all enrollments associated with the batch
    await Enrollment.deleteMany({ batch: batchId }); 

    // Delete all exams associated with the batch
    await Examination.deleteMany({ batch: batchId });

    const deletedBatch = await Batch.findByIdAndDelete(batchId);

    if (!deletedBatch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json({ message: 'Batch deleted successfully', batch: deletedBatch });
  } catch (error) {
    console.error('Error deleting batch:', error);
    res.status(500).json({ message: 'Server error while deleting batch' });
  }
};