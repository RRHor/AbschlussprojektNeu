import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Post from '../models/PostModel.js';

const router = express.Router();



// Suche nach Posts mit Titel oder Inhalt, z.B. /api/posts?q=Suchwort
router.get('/', async (req, res) => {
  const { q } = req.query;
  let filter = {};
  if (q) {
    filter = {
      $or: [
        { title: { $regex: q, $options: 'i' } },   // Suche im Titel (case-insensitive)
        { content: { $regex: q, $options: 'i' } }  // Suche im Inhalt
      ]
    };
  }
  const posts = await Post.find(filter).populate('user', 'name');
  res.json(posts);
});

// Einzelnen Post abrufen
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('user', 'name');
  if (!post) return res.status(404).json({ message: 'Post nicht gefunden' });
  res.json(post);
});

// Neuen Post erstellen
router.post('/', authMiddleware, async (req, res) => {
  const post = new Post({ ...req.body, user: req.user._id });
  await post.save();
  res.status(201).json(post);
});

// Post aktualisieren
router.put('/:id', authMiddleware, async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!post) return res.status(404).json({ message: 'Post nicht gefunden' });
  res.json(post);
});

// Post löschen
router.delete('/:id', authMiddleware, async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post nicht gefunden' });
  res.json({ message: 'Post gelöscht' });
});

export default router;

/*Wie benutzt du die Suche?
Alle User mit „max“ im Namen oder E-Mail:
GET /api/users?q=max
Alle Posts mit „Nachbarschaft“ im Titel oder Inhalt:
GET /api/posts?q=Nachbarschaft
Alle Kommentare mit „toll“ im Text:
GET /api/comments?q=toll*/ 

