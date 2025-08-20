import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../utils/fileUpload.js";
import {
  acceptEnrollment,
  declineEnrollment,
  getFlaggedEvaluations,
  getMyTABatches,
  getPendingEnrollments,
  removeFlaggedEvaluation,
  taFlagEvaluation,
  updateFlaggedEvaluation,
} from "../controllers/taController.js";

const router = express.Router();

router.get("/my-batches", protect, getMyTABatches);
router.get("/pending_enrollments/:batchId", protect, getPendingEnrollments);
router.put("/accept/:enrollmentId", protect, acceptEnrollment);
router.delete("/decline/:enrollmentId", protect, declineEnrollment);
router.get("/flagged_evaluations/:batchId", protect, getFlaggedEvaluations);
router.put(
  "/update-evaluation/:evaluationId",
  protect,
  updateFlaggedEvaluation
);
router.put("/flag-evaluation/:evaluationId", protect, taFlagEvaluation);
router.put(
  "/remove-evaluation/:evaluationId",
  protect,
  removeFlaggedEvaluation
);

export default router;
