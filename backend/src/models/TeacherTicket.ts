import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    description: { type: String, required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // updated
    ta: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },      // updated
    resolved: { type: Boolean, default: false },
    escalatedToTeacher: { type: Boolean, default: false },
    evaluationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Evaluation' },
  },
  { timestamps: true }
);

const Ticket = mongoose.model('TeacherTicket', ticketSchema);
export default Ticket;
