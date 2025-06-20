import { Router } from 'express';
import {
  getFlaggedEvaluations,
  getEvaluationDetails,
  resolveFlag,
  escalateToTeacher
} from '../../controllers/ta/ta.controller.ts';
import { authMiddleware } from '../../middlewares/authMiddleware.ts';
import { authorizeRoles } from '../../middlewares/authorizeRoles.ts';

const router = Router();

// Wrap async middleware to handle errors properly
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.use(asyncHandler(authMiddleware));
// Ensure only TAs can access these routes
router.use(asyncHandler(authorizeRoles('ta')));

// Get all flagged evaluations that need TA review
router.get('/flagged-evaluations', getFlaggedEvaluations);

// Get detailed information about a specific evaluation
router.get('/evaluation/:id', getEvaluationDetails);

// Resolve a flagged evaluation
router.post('/resolve-flag/:flagId', resolveFlag);

// Escalate a flagged evaluation to a teacher
router.post('/escalate/:flagId', escalateToTeacher);

export default router;
