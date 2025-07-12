import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    evaluation: { type: mongoose.Schema.Types.ObjectId, ref: 'PeerEvaluation', required: true },
    evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

export const Ticket = mongoose.model('Ticket', TicketSchema);