import express from 'express';
import { getAllExamsForStudent, getAvailableCourses, getBatchesForCourse, getEnrolledBatches, getEnrolledCourses, getEvaluationsByBatchAndExam, getPeerResultsEvaluations, getResultsBatches, getResultsBatchExams, getStudentDashboardStats, raiseTicket, requestEnrollment, submitEvaluation, uploadExamDocument } from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../utils/fileUpload.js';

const router = express.Router();

router.get('/dashboard-stats', protect, getStudentDashboardStats);
router.get('/enrolled-courses', protect, getEnrolledCourses);
router.get('/available-courses', protect, getAvailableCourses);
router.get('/course-batches/:courseId', protect, getBatchesForCourse);
router.post('/request-enrollment', protect, requestEnrollment);
router.get('/enrolled-batches', protect, getEnrolledBatches);
router.get('/all-exams', protect, getAllExamsForStudent);
router.post('/upload-exam-document', protect, upload.single('file'), uploadExamDocument);
router.get('/evaluations', protect, getEvaluationsByBatchAndExam);
router.post('/submit-evaluation', protect, submitEvaluation);
router.get('/results-batches', protect, getResultsBatches);
router.get('/result-batch-exams/:batchId', protect, getResultsBatchExams);
router.get('/peer-result-evals/:examId', protect, getPeerResultsEvaluations);
router.put('/raise-ticket/:evaluationId', protect, raiseTicket);

export default router;