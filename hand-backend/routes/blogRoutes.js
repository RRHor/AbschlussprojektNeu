import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import blogs from '../models/blogModel.js';
import BlogComment from '../models/blogCommentModel.js';
import User from '../models/UserModel.js';

const router = express.Router();

// Suche nach blogsposts mit Titel, Beschreibung oder Tags.
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
  // Hole alle Blogs und populatiere Kommentare
  const blogsList = await blogs.find(filter)
    .populate('user', 'name')
    .lean();
  // Kommentare zu jedem Blog hinzufügen
  for (let blog of blogsList) {
    blog.comments = await BlogComment.find({ blogs: blog._id })
      .populate('user', 'nickname email')
      .sort({ createdAt: -1 })
      .lean();
  }
  res.json(blogsList);
});

/*Die Suche ist case-insensitive.
Du kannst nach Titel, Beschreibung und Tags suchen.
Beispiel:
/api/blogs?q=hilfe findet alle blogsposts, die „hilfe“ im Titel, in der Beschreibung oder in den Tags haben.*/

// Einzelnen blogspost abrufen
router.get('/:id', async (req, res) => {
  const blog = await blogs.findById(req.params.id).populate('user', 'name').lean();
  if (!blog) return res.status(404).json({ message: 'blogspost nicht gefunden' });
  blog.comments = await BlogComment.find({ blogs: blog._id })
    .populate('user', 'nickname email')
    .sort({ createdAt: -1 })
    .lean();
  res.json(blog);
});

// blogspost erstellen
router.post('/', protect, async (req, res) => {
  try {
    console.log('🔎 [Blog-POST] req.user:', req.user);
    if (!req.user || !req.user._id) {
      console.log('❌ [Blog-POST] Kein User im Request!');
      return res.status(401).json({ message: 'Nicht autorisiert - Kein User im Request' });
    }
    const blogData = { ...req.body, user: req.user._id };
    console.log('📝 [Blog-POST] blogData:', blogData);
    const blog = new blogs(blogData);
    await blog.save();
    console.log('✅ [Blog-POST] Blog gespeichert:', blog);
    res.status(201).json(blog);
  } catch (error) {
    console.log('❌ [Blog-POST] Fehler beim Erstellen:', error);
    res.status(400).json({ message: 'Fehler beim Erstellen', error });
  }
});

// blogspost bearbeiten
router.put('/:id', protect, async (req, res) => {
  try {
    // user-Feld immer mitgeben, damit required nicht verletzt wird
    const updateData = { ...req.body, user: req.user._id };
    const blog = await blogs.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!blog) return res.status(404).json({ message: 'blogspost nicht gefunden' });
    res.json(blog);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Bearbeiten', error });
  }
});

// blogspost löschen
router.delete('/:id', protect, async (req, res) => {
  const blog = await blogs.findByIdAndDelete(req.params.id);
  if (!blog) return res.status(404).json({ message: 'blogspost nicht gefunden' });
  res.json({ message: 'blogspost gelöscht' });
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