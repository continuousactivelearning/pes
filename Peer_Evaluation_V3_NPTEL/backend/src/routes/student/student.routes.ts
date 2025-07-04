import { Router } from "express";
import multer from "multer";
import { getStudentProfile } from "../../controllers/student/student.controller.ts";
import {
  getStudentExams,
  getStudentExamsByCourse,
} from "../../controllers/student/exam.controller.ts";
import { submitEvaluation } from "../../controllers/student/submitEvaluation.controller.ts";
import { getPendingEvaluations } from "../../controllers/student/getPendingEvaluations.controller.ts";
import { getEvaluationResults } from "../../controllers/student/getEvaluationResults.controller.ts";
import { submitAnswer } from "../../controllers/student/submitAnswer.controller.ts";
import { getSubmissions } from "../../controllers/student/getSubmissions.controller.ts";
import { flagEvaluation } from "../../controllers/student/flagEvaluation.controller.ts"; // using correct file
import { submitPeerEvaluation } from "../../controllers/student/submitPeerEvaluation.controller.ts";
import { getSubmissionPdf } from "../../controllers/student/getSubmissionPdf.controller.ts";
import { authMiddleware } from "../../middlewares/authMiddleware.ts";
import {
  getAllCourses,
  getStudentCourses,
  getStudentCoursesWithBatches,
  getBatchesByCourse,
} from "../../controllers/student/course.controller.ts";
import { changePassword } from "../../controllers/student/changePassword.controller.ts";
import { raiseTicket } from "../../controllers/student/raiseTIcket.controller.ts";
import {
  createEnrollment,
  getStudentEnrollments,
} from "../../controllers/student/enrollment.controller.ts";
import { getAnswerKeyPdf } from "../../controllers/student/answerKeyPdf.controller.ts";
import { getQuestionPaperPdf } from "../../controllers/student/questionPaperPdf.controller.ts";
const router = Router();
const upload = multer();

router.get("/profile", authMiddleware, getStudentProfile);
router.get("/courses", authMiddleware, getStudentCourses);
router.get("/exams", authMiddleware, getStudentExams);
router.get("/courses/:courseId/exams", authMiddleware, getStudentExamsByCourse);
router.post("/evaluate", authMiddleware, submitEvaluation);
router.get("/pending-evaluations", authMiddleware, getPendingEvaluations);
router.get("/results", authMiddleware, getEvaluationResults);
router.post(
  "/submit-answer",
  authMiddleware,
  upload.single("pdf"),
  submitAnswer
);
router.get("/submissions", authMiddleware, getSubmissions);
router.post("/flag-evaluation", authMiddleware, flagEvaluation);
router.post("/submit-peer-evaluation", authMiddleware, submitPeerEvaluation);
router.get("/submission-pdf/:submissionId", authMiddleware, getSubmissionPdf);
router.get(
  "/enrolled-courses-batches",
  authMiddleware,
  getStudentCoursesWithBatches
);
router.post("/change-password", authMiddleware, changePassword);
router.post("/raise-ticket", authMiddleware, raiseTicket);
router.post("/enrollment", authMiddleware, upload.none(), createEnrollment);
router.get("/enrollment", authMiddleware, getStudentEnrollments);
router.get("/all-courses", authMiddleware, getAllCourses);
router.get("/batches-by-course", authMiddleware, getBatchesByCourse);
router.get("/answer-key/:examId", authMiddleware, getAnswerKeyPdf);
router.get("/question-paper/:examId", authMiddleware, getQuestionPaperPdf);
export default router;