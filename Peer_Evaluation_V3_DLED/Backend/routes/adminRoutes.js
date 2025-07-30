import express from 'express';
import { updateRole, addCourse, getTeachers, getCourses, addBatch, getDashboardCounts, deleteCourse, getBatches, deleteBatch, getCourseById, updateCourse, getBatchById, updateBatch } from '../controllers/adminController.js';
import { protect, adminOrTeacherOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/update-role', protect, adminOrTeacherOnly, updateRole);
router.post('/add-course', protect, adminOrTeacherOnly, addCourse);
router.get('/teachers', protect, adminOrTeacherOnly, getTeachers);
router.get('/courses', protect, adminOrTeacherOnly, getCourses);
router.get('/course/:courseId', protect, adminOrTeacherOnly, getCourseById);
router.put('/update-course/:editCourseId', protect, adminOrTeacherOnly, updateCourse);
router.get('/batches', protect, adminOrTeacherOnly, getBatches);
router.post('/add-batch', protect, adminOrTeacherOnly, addBatch);
router.get('/batch/:batchId', protect, adminOrTeacherOnly, getBatchById);
router.put('/update-batch/:batchId', protect, adminOrTeacherOnly, updateBatch);
router.get('/dashboard-counts', protect, adminOrTeacherOnly, getDashboardCounts);
router.delete('/delete-course/:courseId', protect, adminOrTeacherOnly, deleteCourse);
router.delete('/delete-batch/:batchId', protect, adminOrTeacherOnly, deleteBatch);

export default router;