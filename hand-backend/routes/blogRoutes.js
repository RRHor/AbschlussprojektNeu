import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Blog from '../models/blogModel.js';

const router = express.Router();

// Alle Blogposts abrufen
router.get('/', async (req, res) => {
  const blogs = await Blog.find().populate('user', 'name');
  res.json(blogs);
});

// Einzelnen Blogpost abrufen
router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('user', 'name');
  if (!blog) return res.status(404).json({ message: 'Blogpost nicht gefunden' });
  res.json(blog);
});

// Blogpost erstellen
router.post('/', authMiddleware, async (req, res) => {
  try {
    const blog = new Blog({ ...req.body, user: req.user._id });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Erstellen', error });
  }
});

// Blogpost bearbeiten
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ message: 'Blogpost nicht gefunden' });
    res.json(blog);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Bearbeiten', error });
  }
});

// Blogpost löschen
router.delete('/:id', authMiddleware, async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blogpost nicht gefunden' });
  res.json({ message: 'Blogpost gelöscht' });
});

export default router;