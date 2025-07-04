import { Request, Response, NextFunction } from 'express';
import { Evaluation } from '../../models/Evaluation.ts';
import { Submission } from '../../models/Submission.ts';

export const getSubmissionPdf = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { evaluationId } = req.params;
    const evaluation = await Evaluation.findById(evaluationId)
      .populate('exam')
      .populate('evaluatee');
    if (!evaluation) {
      res.status(404).json({ error: 'Evaluation not found' });
      return;
    }
    if (!evaluation.exam) {
      res.status(404).json({ error: 'Associated exam not found' });
      return;
    }
    const submission = await Submission.findOne({
      exam: evaluation.exam,
      student: evaluation.evaluatee
    });
    if (!submission) {
      res.status(404).json({ error: 'Submission not found' });
      return;
    }
    if (!submission.answerPdf || !submission.answerPdfMimeType) {
      res.status(404).json({ error: 'Submission PDF data not found' });
      return;
    }
    const evaluateeName = (evaluation.evaluatee as any)?.name || 'student';
    const safeFilename = `submission_${evaluateeName.replace(/[^a-zA-Z0-9]/g, '_')}_${evaluationId.slice(-6)}.pdf`;
    res.setHeader('Content-Type', submission.answerPdfMimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    res.send(submission.answerPdf);
  } catch (error) {
    console.error('Error fetching submission PDF:', error);
    next(error);
  }
};
