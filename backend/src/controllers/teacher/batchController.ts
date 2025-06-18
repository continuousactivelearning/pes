import { Request, Response } from 'express';
import Batch from '../../models/teacher/teacherBatch.ts';

export const createBatch = async (req: Request, res: Response) => {
  try {
    const batch = new Batch(req.body);
    await batch.save();
    res.status(201).json(batch);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create batch', error: err });
  }
};

export const getBatches = async (_: Request, res: Response) => {
  try {
    const batches = await Batch.find().populate('course');
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch batches', error: err });
  }
};
export const updateBatch = async (req: Request, res: Response) => {
  try {
    const updatedBatch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBatch);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update batch', error: err });
  }
};

export const deleteBatch = async (req: Request, res: Response) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);
    res.json({ message: 'Batch deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete batch', error: err });
  }
};

