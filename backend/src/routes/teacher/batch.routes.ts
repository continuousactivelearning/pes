import { Router } from 'express';
import { createBatch, getBatches, updateBatch, deleteBatch } from '../../controllers/teacher/batchController.ts';

const router = Router();

router.post('/', createBatch);
router.get('/', getBatches);
router.put('/:id', updateBatch);
router.delete('/:id', deleteBatch);

export default router;