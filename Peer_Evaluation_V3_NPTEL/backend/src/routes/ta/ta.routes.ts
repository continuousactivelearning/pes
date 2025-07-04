import { Router } from 'express';
import {
  getFlaggedEvaluations,
  getEvaluationDetails,
  resolveFlag,
  escalateToTeacher,
  getSubmissionPdf,
  getTAStats
} from '../../controllers/ta/ta.controller.ts';
import { authMiddleware } from '../../middlewares/authMiddleware.ts';
import { authorizeTA } from '../../middlewares/authorizeTA.ts'; // <-- NEW middleware

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
router.get('/stats', asyncHandler(getTAStats));
router.get('/flagged-evaluations', asyncHandler(getFlaggedEvaluations));
router.get('/evaluation/:id', asyncHandler(getEvaluationDetails));
router.get('/submission/:evaluationId', asyncHandler(getSubmissionPdf));
router.post('/resolve-flag/:flagId', asyncHandler(resolveFlag));
router.post('/escalate/:flagId', asyncHandler(escalateToTeacher));

export default router;
