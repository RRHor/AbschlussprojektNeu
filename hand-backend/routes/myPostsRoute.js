// myPostsRoute.js
// Gibt alle eigenen Blogposts des eingeloggten Users zurück (basierend auf JWT)

import express from 'express';
import Blog from '../models/blogModel.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
// GET /api/my-posts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const blogs = await Blog.find({ user: userId }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Fehler beim Laden der eigenen Blogposts:', err);
    res.status(500).json({ message: 'Fehler beim Laden der eigenen Blogposts' });
  }
});

export default router;
