import { Request, Response } from "express";
import { User } from "../../models/User.ts";
import { Course } from "../../models/Course.ts";
import { Batch } from "../../models/Batch.ts";
import jwt from "jsonwebtoken";




// Add a new course
export const addCourse = async (req: Request, res: Response): Promise<void> => {
  try {
   // console.log(req);
    console.log(req.body);

    const { name, code } = req.body;

    const existing = await Course.findOne({ code });
    if (existing) {
      res.status(409).json({ message: "Course code already exists" });
      return;
    }

    const course = await Course.create({ name, code });
    res.status(201).json(course);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add course", error: err });
  }
};

// Update an existing course
export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const updated = await Course.findByIdAndUpdate(courseId, req.body, { new: true });

    if (!updated) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update course", error: err });
  }
};

// Delete a course
export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const deleted = await Course.findByIdAndDelete(courseId);

    if (!deleted) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete course", error: err });
  }
};
// Get all courses
export const getAllCourses = async (_req: Request, res: Response) => {
  const courses = await Course.find();
  console.log("All course codes:", courses.map(c => c.code)); // Debug log
  res.json(courses);
};

// Get course by ID
export const getCourseById = async (req: Request, res: Response) => {
  console.log("Searching for course with ID:", req.params.id);
  const course = await Course.findById(req.params.id);
  console.log("Course found:", course);
  course ? res.json(course) : res.status(404).json({ message: 'Course not found' });
};

export const getAllBatches = async (_req: Request, res: Response): Promise<void> => {
  try {
    const batches = await Batch.find().populate('course', 'code name'); 
    console.log("All batches:", batches.map(b => ({ id: b._id, name: b.name })));
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve batches', error: err });
  }
};
export const getBatchById = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Searching for batch with ID:", req.params.id);
    const batch = await Batch.findById(req.params.id).populate('course', 'code name');
    console.log("Batch found:", batch);

    if (batch) {
      res.json(batch);
    } else {
      res.status(404).json({ message: 'Batch not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve batch', error: err });
  }
};



// Create a batch for a course
export const createBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, courseId, students } = req.body;
    console.log(courseId);
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    const batch = await Batch.create({ name, course: courseId, students });
    res.status(201).json(batch);
  } catch (err) {
    res.status(500).json({ message: "Failed to create batch", error: err });
  }
};

// Update a batch
export const updateBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { batchId } = req.params;
    const updated = await Batch.findByIdAndUpdate(batchId, req.body, { new: true });

    if (!updated) {
      res.status(404).json({ message: "Batch not found" });
      return;
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update batch", error: err });
  }
};

// Delete a batch
export const deleteBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { batchId } = req.params;
    const deleted = await Batch.findByIdAndDelete(batchId);

    if (!deleted) {
      res.status(404).json({ message: "Batch not found" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete batch", error: err });
  }
};