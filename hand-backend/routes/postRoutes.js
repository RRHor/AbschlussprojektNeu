import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Post from '../models/PostModel.js';

const router = express.Router();



// Alle Posts abrufen
router.get('/', async (req, res) => {
  const posts = await Post.find().populate('user', 'name');
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

