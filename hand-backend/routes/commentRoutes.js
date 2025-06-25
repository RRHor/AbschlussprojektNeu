import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Comment from '../models/commentModel.js';

const router = express.Router();

/**
 * Alle Kommentare zu einem bestimmten Post abrufen
 * Beispiel: GET /api/comments/post/<postId>
 */
router.get('/post/:postId', async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate('user', 'nickname');
  res.json(comments);
});

/**
 * Einzelnen Kommentar abrufen
 * Beispiel: GET /api/comments/<id>
 */
router.get('/:id', async (req, res) => {
  const comment = await Comment.findById(req.params.id)
    .populate('user', 'nickname');
  if (!comment) return res.status(404).json({ message: 'Kommentar nicht gefunden' });
  res.json(comment);
});

/**
 * Kommentar erstellen (nur für eingeloggte User)
 * Beispiel: POST /api/comments
 * Body: { text: "...", post: "<postId>" }
 */
router.post('/', protect, async (req, res) => {
  try {
    const comment = new Comment({
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
 * Beispiel: PUT /api/comments/<id>
 * Body: { text: "Neuer Text" }
 */
router.put('/:id', protect, async (req, res) => {
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

/**
 * Kommentar löschen (nur Ersteller oder Admin)
 * Beispiel: DELETE /api/comments/<id>
 */
router.delete('/:id', protect, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Kommentar nicht gefunden' });

  // Nur Ersteller oder Admin darf löschen
  if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Keine Berechtigung' });
  }

  await comment.deleteOne();
  res.json({ message: 'Kommentar gelöscht' });
});

/**
 * Suche nach Kommentaren mit Text ODER Username/Nickname
 * Beispiel: GET /api/comments?q=Suchwort
 */
router.get('/', async (req, res) => {
  const { q } = req.query;
  let comments = await Comment.find().populate('user', 'name nickname');
  
  if (q) {
    const regex = new RegExp(q, 'i'); // case-insensitive Suche
    comments = comments.filter(comment =>
      regex.test(comment.text) ||
      (comment.user && (
        regex.test(comment.user.name || '') ||
        regex.test(comment.user.nickname || '')
      ))
    );
  }
  res.json(comments);
});

/*
Hinweise:
- Die Suche ist case-insensitive.
- Du kannst nach Kommentartext, Usernamen oder Nickname suchen.
- Beispiel: /api/comments?q=max findet alle Kommentare von Usern mit "max" im Namen oder Nickname oder im Kommentartext.
*/

export default router;