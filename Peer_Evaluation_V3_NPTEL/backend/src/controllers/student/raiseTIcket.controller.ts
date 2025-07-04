import { Request, Response, NextFunction } from "express";
import { Exam } from "../../models/Exam.ts";
import { Batch } from "../../models/Batch.ts";
import { Ticket } from "../../models/Ticket.ts";

export const raiseTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("HIT /raise-ticket controller");

  try {
    const studentId = req.user?._id;
    const { examId, evaluatorId, message } = req.body;

    if (!studentId || !examId || !evaluatorId || !message) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const exam = await Exam.findById(examId).lean();
    if (!exam) {
      res.status(404).json({ error: "Exam not found" });
      return;
    }

    const batch = await Batch.findOne({
      course: exam.course,
      students: studentId,
    });

    if (!batch) {
      res.status(404).json({ error: "Batch not found for student in this course" });
      return;
    }

    if (!batch.ta || batch.ta.length === 0) {
      res.status(404).json({ error: "No TAs assigned to this batch" });
      return;
    }

    // Create a ticket for each TA in the batch
    const tickets = [];
    for (const taId of batch.ta) {
      const newTicket = new Ticket({
        student: studentId,
        evaluator: evaluatorId,
        ta: taId,
        exam: examId,
        message,
      });
      
      await newTicket.save();
      tickets.push(newTicket._id);
    }

    res.status(201).json({ 
      message: `Ticket raised successfully and assigned to ${batch.ta.length} TA(s)`, 
      ticketIds: tickets 
    });
  } catch (err: any) {
    console.error("Error in raiseTicket:", err.message || err);
    res.status(500).json({ error: "Something went wrong while raising the ticket." });
  }
};