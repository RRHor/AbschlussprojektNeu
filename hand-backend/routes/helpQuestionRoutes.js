// helpQuestionRoutes.js
// Routen für Community-Fragen (Hilfe/FAQ)


import express from 'express';
import HelpQuestion from '../models/helpQuestionModel.js';

const router = express.Router();


// Alle Fragen & Antworten abrufen
router.get('/questions', async (req, res) => {
  try {
    const questions = await HelpQuestion.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden der Fragen.' });
  }
});

// Neue Frage speichern
router.post('/questions', async (req, res) => {
  try {
    const { user, question, date } = req.body;
    if (!question) return res.status(400).json({ error: 'Frage darf nicht leer sein.' });
    const newQuestion = new HelpQuestion({ user, question, date, answers: [] });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ error: 'Fehler beim Speichern der Frage.' });
  }
});

// Antwort zu einer Frage speichern
router.post('/questions/:id/answer', async (req, res) => {
  try {
    const { user, answer, date } = req.body;
    const question = await HelpQuestion.findById(req.params.id);
    if (!question) return res.status(404).json({ error: 'Frage nicht gefunden.' });
    question.answers.push({ user, answer, date });
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: 'Fehler beim Speichern der Antwort.' });
  }
});

export default router;
