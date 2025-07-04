import express from 'express';
import HelpAnswer from '../models/helpAnswerModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Neue Antwort speichern
router.post('/', protect, async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    if (!questionId || !answer) return res.status(400).json({ error: 'questionId und answer sind erforderlich.' });
    const helpAnswer = new HelpAnswer({
      questionId,
      user: req.user.id,
      answer
    });
    await helpAnswer.save();
    res.status(201).json(helpAnswer);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Speichern der Antwort.' });
  }
});

// Alle Antworten zu einer Frage abrufen
router.get('/:questionId', async (req, res) => {
  try {
    const answers = await HelpAnswer.find({ questionId: req.params.questionId }).populate('user', 'nickname email');
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden der Antworten.' });
  }
});

export default router;
