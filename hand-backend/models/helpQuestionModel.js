// helpQuestionModel.js
// Modell für Community-Fragen (Hilfe/FAQ)

import mongoose from 'mongoose';

const helpQuestionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  answer: { type: String },
  createdAt: { type: Date, default: Date.now },
  answeredAt: { type: Date }
});

const HelpQuestion = mongoose.model('HelpQuestion', helpQuestionSchema);
export default HelpQuestion;
