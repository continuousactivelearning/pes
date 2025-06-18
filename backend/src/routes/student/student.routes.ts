import { Router } from 'express';
import { getStudentDashboard } from '../../controllers/student/student.controller.ts';
import { getStudentExams } from '../../controllers/student/exam.controller.ts';
import { submitEvaluation } from '../../controllers/student/submitEvaluation.controller.ts';
import { getPendingEvaluations } from '../../controllers/student/getPendingEvaluations.controller.ts';
import { getEvaluationResults } from '../../controllers/student/getEvaluationResults.controller.ts';


const router = Router();

router.get('/dashboard', getStudentDashboard);
router.get('/exams', getStudentExams);
router.post('/evaluate', submitEvaluation);
router.get('/pending-evaluations', getPendingEvaluations);
router.get('/results', getEvaluationResults);

export default router;