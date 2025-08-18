import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { User } from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import { Course } from '../models/Course.js';
import { Batch } from '../models/Batch.js';
import { Enrollment } from '../models/Enrollment.js';
import { Examination } from '../models/Examination.js';
import mongoose from 'mongoose';


export const updateRole = async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: 'Email and role are required!' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'Role updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later!' });
  }
};

export const addCourse = async (req, res) => {
  const { courseId, courseName, openCourse, startDate, endDate } = req.body;

  if (!courseId || !courseName || !startDate || !endDate) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    const courseExists = await Course.findOne({ courseId });
    if (courseExists) {
      return res.status(400).json({ message: 'Course ID already exists!' });
    }

    const newCourse = new Course({
      courseId,
      courseName,
      openCourse,
      startDate,
      endDate,
    });

    await newCourse.save();

    res.status(200).json({ message: 'Course added successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later!' });
  }
};

export const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password');
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching teachers!' });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching courses!' });
  }
};

export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found!' });
        }
        
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error!' });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { editCourseId } = req.params;
        const { courseId, courseName, openCourse, startDate, endDate } = req.body;

        const existingCourse = await Course.findById(editCourseId);
        if (!existingCourse) {
            return res.status(404).json({ message: 'Course not found!' });
        }

        if (courseId !== existingCourse.courseId) {
            const duplicateCourse = await Course.findOne({ courseId });
            if (duplicateCourse) {
                return res.status(400).json({ message: 'Course ID already exists!' });
            }
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            editCourseId,
            {
                courseId,
                courseName,
                openCourse,
                startDate,
                endDate
            },
            { new: true }
        );

        res.json({ message: 'Course updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error!' });
    }
};

export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate('course')
      .populate('instructor', '_id name email');

    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching batches!' });
  }
};

export const addBatch = async (req, res) => {
  const { batchId, instructor, course } = req.body;

  if (!batchId || !instructor || !course) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    const instructorData = await User.findById(instructor);
    if (!instructorData) {
      return res.status(404).json({ message: 'Instructor not found!' });
    }

    const batchExists = await Batch.findOne({ batchId, course });
    if (batchExists) {
      return res.status(400).json({ message: 'Batch with this ID already exists for the selected course!' });
    }

    const newBatch = new Batch({
      batchId,
      instructor: instructorData._id,
      course,
    });

    await newBatch.save();

    res.status(200).json({ message: 'Batch added successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later!' });
  }
};

export const getBatchById = async (req, res) => {
  try {
    const { batchId } = req.params;
    
    const batch = await Batch.findById(batchId)
      .populate('instructor', 'name email')
      .populate('course', 'courseId courseName');
    
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found!' });
    }
    
    res.status(200).json(batch);
  } catch (error) {
    res.status(500).json({ message: 'Server error!', error: error });
  }
};

export const updateBatch = async (req, res) => {
  try {
    const { editBatchId } = req.params;
    const { batchId, instructor, course } = req.body;
    
    const existingBatch = await Batch.findById(editBatchId);
    if (!existingBatch) {
      return res.status(404).json({ message: 'Batch not found!' });
    }

    if (batchId !== existingBatch.batchId) {
      const batchIdExists = await Batch.findOne({ batchId, course });
      console.log('BatchIdExists:', batchIdExists);
      if (batchIdExists) {
        return res.status(400).json({ message: 'Batch with this ID already exists for the selected course!' });
      }
    }
    
    const instructorExists = await User.findById(instructor);
    if (!instructorExists || instructorExists.role !== 'teacher') {
      return res.status(400).json({ message: 'Invalid instructor selected!' });
    }
    
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(400).json({ message: 'Invalid course selected!' });
    }
    
    const updatedBatch = await Batch.findByIdAndUpdate(
      editBatchId,
      {
        batchId,
        instructor,
        course
      },
      { new: true }
    ).populate('instructor', 'name email').populate('course', 'courseId courseName');
    
    res.status(200).json({ message: 'Batch updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error!', error: error });
  }
};

export const getDashboardCounts = async (req, res) => {
  try {
    const [teacherCount, courseCount, batchCount, studentCount] = await Promise.all([
      User.countDocuments({ role: 'teacher' }),
      Course.countDocuments(),
      Batch.countDocuments(),
      User.countDocuments({ role: 'student' })
    ]);

    res.status(200).json({
      teachers: teacherCount,
      courses: courseCount,
      batches: batchCount,
      students: studentCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error!' });
  }
};

export const deleteCourse = async (req, res) => {
  const courseId = req.params.courseId || req.body.courseId;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: 'Invalid course ID!' });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found!' });
    }

    const batches = await Batch.find({ course: course._id });
    const batchIds = batches.map(batch => batch._id);

    await Batch.deleteMany({ course: course._id });

    await Enrollment.deleteMany({ course: courseId });

    await Examination.deleteMany({ batch: { $in: batchIds } });

    await Course.findByIdAndDelete(courseId);

    res.status(200).json({ message: 'Course and associated batches deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later!' });
  }
};

export const deleteBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    await Enrollment.deleteMany({ batch: batchId }); 

    await Examination.deleteMany({ batch: batchId });

    const deletedBatch = await Batch.findByIdAndDelete(batchId);

    if (!deletedBatch) {
      return res.status(404).json({ message: 'Batch not found!' });
    }

    res.status(200).json({ message: 'Batch deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting batch!' });
  }
};