// helpQuestionRoutes.js
// Routen für Community-Fragen (Hilfe/FAQ)

import express from 'express';
import HelpQuestion from '../models/helpQuestionModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Neue Frage stellen
router.post('/', protect, async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Frage darf nicht leer sein.' });
    const helpQuestion = new HelpQuestion({
      user: req.user.id,
      question
    });
    await helpQuestion.save();
    res.status(201).json(helpQuestion);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Speichern der Frage.' });
  }
});

// Alle Fragen abrufen
router.get('/', async (req, res) => {
  try {
    const questions = await HelpQuestion.find().populate('user', 'nickname email');
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden der Fragen.' });
  }
});

// Einzelne Frage beantworten
router.put('/:id/answer', protect, async (req, res) => {
  try {
    const { answer } = req.body;
    const question = await HelpQuestion.findById(req.params.id);
    if (!question) return res.status(404).json({ error: 'Frage nicht gefunden.' });
    question.answer = answer;
    question.answeredAt = new Date();
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Beantworten der Frage.' });
  }
});

export default router;
