import { Router } from 'express';
import { createCourse, getCourses, updateCourse, deleteCourse } from '../../controllers/teacher/courseController.ts';

const router = Router();

router.post('/', createCourse);
router.get('/', getCourses);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;
