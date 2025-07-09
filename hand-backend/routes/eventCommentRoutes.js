import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import EventComment from '../models/eventCommentModel.js'; // <-- Das Event-Kommentar-Model!

const router = express.Router();

/**
 * Alle Kommentare zu einem bestimmten Event abrufen
 * Beispiel: GET /api/event-comments/event/<eventId>
 */
router.get('/event/:eventId', async (req, res) => {
  const comments = await EventComment.find({ event: req.params.eventId })
    .populate('user', 'nickname');
  res.json(comments);
});

/**
 * Einzelnen Kommentar abrufen
 * Beispiel: GET /api/event-comments/<id>
 */
router.get('/:id', async (req, res) => {
  const comment = await EventComment.findById(req.params.id)
    .populate('user', 'nickname');
  if (!comment) return res.status(404).json({ message: 'Kommentar nicht gefunden' });
  res.json(comment);
});

/**
 * Kommentar zu Event erstellen (nur für eingeloggte User)
 * Beispiel: POST /api/event-comments
 * Body: { text: "...", event: "<eventId>" }
 */
router.post('/', protect, async (req, res) => {
  try {
    const comment = new EventComment({
      ...req.body,
      user: req.user._id // <-- User-ID aus Token setzen!
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Erstellen', error });
  }
});

/**
 * Kommentar bearbeiten (nur Ersteller oder Admin)
 */
router.put('/:id', protect, async (req, res) => {
  const comment = await EventComment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Kommentar nicht gefunden' });

  if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Keine Berechtigung' });
  }

  comment.text = req.body.text || comment.text;
  await comment.save();
  res.json(comment);
});

/**
 * Kommentar löschen (nur Ersteller oder Admin)
 */
router.delete('/:id', protect, async (req, res) => {
  const comment = await EventComment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Kommentar nicht gefunden' });

  if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Keine Berechtigung' });
  }

  await comment.deleteOne();
  res.json({ message: 'Kommentar gelöscht' });
});

export default router;