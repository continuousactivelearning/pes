import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../utils/fileUpload.js';
import { acceptEnrollment, declineEnrollment, getMyTABatches, getPendingEnrollments } from '../controllers/taController.js';

const router = express.Router();

router.get('/my-batches', protect, getMyTABatches);
router.get('/pending_enrollments/:batchId', protect, getPendingEnrollments);
router.put('/accept/:enrollmentId', protect, acceptEnrollment);
router.put('/decline/:enrollmentId', protect, declineEnrollment);
// router.get('/evaluations/:batchId', protect, getEvaluations);

export default router;