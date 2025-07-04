// helpAnswerModel.js
// Modell für Antworten auf Community-Fragen

import mongoose from 'mongoose';

const helpAnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'HelpQuestion', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const HelpAnswer = mongoose.model('HelpAnswer', helpAnswerSchema);
export default HelpAnswer;
