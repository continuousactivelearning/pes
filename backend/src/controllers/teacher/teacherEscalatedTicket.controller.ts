import { Request, Response } from 'express';

import Ticket from '../../models/TeacherTicket.ts';

export const getEscalatedTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const escalatedTickets = await Ticket.find({ escalatedToTeacher: true })
      .populate('student', 'name email')
      .populate('ta', 'name email');

    res.status(200).json(escalatedTickets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching escalated tickets', error: err });
  }
};

export const resolveEscalatedTicket = async (req: Request, res: Response): Promise<void> => {
console.log("🟢 resolveEscalatedTicket HIT with ID:", req.params.ticketId);
  const { ticketId } = req.params;

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    ticket.resolved = true;
    await ticket.save();

    res.status(200).json({ message: 'Ticket marked as resolved', ticket });
  } catch (err) {
    res.status(500).json({ message: 'Error resolving ticket', error: err });
  }

};


