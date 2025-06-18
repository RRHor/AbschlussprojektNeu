import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Comment from '../models/commentModel.js';

const router = express.Router();

// Alle Kommentare zu einem Post abrufen (z.B. Blog, Ad, Event)
router.get('/post/:postId', async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId }).populate('user', 'nickname');
  res.json(comments);
});

// Einzelnen Kommentar abrufen
router.get('/:id', async (req, res) => {
  const comment = await Comment.findById(req.params.id).populate('user', 'nickname');
  if (!comment) return res.status(404).json({ message: 'Kommentar nicht gefunden' });
  res.json(comment);
});

// Kommentar erstellen
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { text, post } = req.body;
    const comment = new Comment({ text, post, user: req.user._id });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Erstellen', error });
  }
});

// Kommentar bearbeiten (nur Ersteller oder Admin)
router.put('/:id', authMiddleware, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Kommentar nicht gefunden' });

  // Nur Ersteller oder Admin darf bearbeiten
  if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Keine Berechtigung' });
  }

  comment.text = req.body.text || comment.text;
  await comment.save();
  res.json(comment);
});

// Kommentar löschen (nur Ersteller oder Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Kommentar nicht gefunden' });

  // Nur Ersteller oder Admin darf löschen
  if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Keine Berechtigung' });
  }

  await comment.deleteOne();
  res.json({ message: 'Kommentar gelöscht' });
});

// Suche nach Kommentaren mit Text, z.B. /api/comments?q=Suchwort
router.get('/', async (req, res) => {
  const { q } = req.query;
  let filter = {};
  if (q) {
    filter = { text: { $regex: q, $options: 'i' } };
  }
  const comments = await Comment.find(filter).populate('user', 'name');
  res.json(comments);
});

export default router;

/*Wie benutzt du die Suche?
Alle User mit „max“ im Namen oder E-Mail:
GET /api/users?q=max
Alle Posts mit „Nachbarschaft“ im Titel oder Inhalt:
GET /api/posts?q=Nachbarschaft
Alle Kommentare mit „toll“ im Text:
GET /api/comments?q=toll*/ 