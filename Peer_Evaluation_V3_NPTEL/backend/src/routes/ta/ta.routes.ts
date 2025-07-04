import { Router } from 'express';
import {
  getFlaggedEvaluations,
  resolveFlag,
  escalateToTeacher,
} from '../../controllers/ta/flag.controller.ts';
import { getSubmissionPdf } from '../../controllers/ta/submission.controller.ts';
import { getEvaluationDetails as getEvalDetails } from '../../controllers/ta/evaluation.controller.ts';
import { getTAStats } from '../../controllers/ta/stats.controller.ts';
import { authMiddleware } from '../../middlewares/authMiddleware.ts';
import { authorizeTA } from '../../middlewares/authorizeTA.ts'; // <-- NEW middleware
import { getTAProfile } from '../../controllers/ta/ta.controller.ts';
import { getPendingEnrollments, respondToEnrollment } from '../../controllers/ta/taEnrollment.controller.ts';

const router = Router();

// Wrap async middleware to handle errors properly
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Apply authentication middleware to all routes
router.use(asyncHandler(authMiddleware));

// ✅ Replace role-based check with our dynamic TA check
router.use(asyncHandler(authorizeTA));

// TA-specific routes
router.get('/profile', getTAProfile);
router.get('/enrollments/pending', asyncHandler(getPendingEnrollments));
router.post('/enrollments/respond/:enrollmentId', asyncHandler(respondToEnrollment));


router.get('/stats', asyncHandler(getTAStats));
router.get('/flagged-evaluations', asyncHandler(getFlaggedEvaluations));
router.get('/evaluation/:id', asyncHandler(getEvalDetails));
router.get('/submission/:evaluationId', asyncHandler(getSubmissionPdf));
router.post('/resolve-flag/:flagId', asyncHandler(resolveFlag));
router.post('/escalate/:flagId', asyncHandler(escalateToTeacher));

export default router;