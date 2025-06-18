import { Request, Response, NextFunction } from 'express';

import { RequestHandler } from 'express';

export const getStudentDashboard: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json({ message: 'Student backend route working' });
  } catch (err) {
    next(err);
  }
};