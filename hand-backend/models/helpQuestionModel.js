// helpQuestionModel.js
// Modell für Community-Fragen (Hilfe/FAQ)


import mongoose from 'mongoose';


const answerSchema = new mongoose.Schema({
  user: { type: String, required: true },
  answer: { type: String, required: true },
  date: { type: String, required: true }
});

const helpQuestionSchema = new mongoose.Schema({
  user: { type: String, required: true },
  question: { type: String, required: true },
  date: { type: String, required: true },
  answers: [answerSchema]
});

const HelpQuestion = mongoose.model('HelpQuestion', helpQuestionSchema);
export default HelpQuestion;
