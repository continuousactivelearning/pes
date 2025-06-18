import { Router } from 'express';
import { createExam, getExams,updateExam, deleteExam  } from '../../controllers/teacher/examController.ts';

const router = Router();

router.post('/', createExam);
router.get('/', getExams);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);

export default router;