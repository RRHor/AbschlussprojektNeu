import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Blog from '../models/blogModel.js';
import User from '../models/UserModel.js';

const router = express.Router();

// Suche nach Blogposts mit Titel, Beschreibung oder Tags.
// Beispiel: /api/blogs?q=hilfe
router.get('/', async (req, res) => {
  const { q } = req.query;
  let filter = {};
  if (q) {
    filter = {
      $or: [
        { title: { $regex: q, $options: 'i' } },         // Suche im Titel
        { description: { $regex: q, $options: 'i' } },   // Suche in der Beschreibung
        { tags: { $regex: q, $options: 'i' } }           // Suche in Tags
      ]
    };
  }
  const blogs = await Blog.find(filter).populate('author', 'nickname username email');
  res.json(blogs);
});

/*Die Suche ist case-insensitive.
Du kannst nach Titel, Beschreibung und Tags suchen.
Beispiel:
/api/blogs?q=hilfe findet alle Blogposts, die „hilfe“ im Titel, in der Beschreibung oder in den Tags haben.*/

// Einzelnen Blogpost abrufen
router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author', 'nickname username email');
  if (!blog) return res.status(404).json({ message: 'Blogpost nicht gefunden' });
  res.json(blog);
});

// Blogpost erstellen
router.post('/', protect, async (req, res) => {
  try {
    const blog = new Blog({ ...req.body, author: req.user._id }); // author = eingeloggter User
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Erstellen', error });
  }
});

// Blogpost bearbeiten
router.put('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ message: 'Blogpost nicht gefunden' });
    res.json(blog);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Bearbeiten', error });
  }
});

// Blogpost löschen
router.delete('/:id', protect, async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blogpost nicht gefunden' });
  res.json({ message: 'Blogpost gelöscht' });
});

// Suche nach User anhand von E-Mail oder Nickname
router.post('/searchUser', async (req, res) => {
  const user = await User.findOne({ 
    $or: [
      { email: req.body.email }, 
      { nickname: req.body.nickname }
    ] 
  });
  if (!user) return res.status(404).json({ message: 'User nicht gefunden' });
  res.json(user);
});

export default router;