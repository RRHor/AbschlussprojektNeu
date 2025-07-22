import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import blogs from '../models/blogModel.js';
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
  const blogsList = await blogs.find(filter).populate('user', 'name');
  res.json(blogsList);
});

/*Die Suche ist case-insensitive.
Du kannst nach Titel, Beschreibung und Tags suchen.
Beispiel:
/api/blogs?q=hilfe findet alle blogsposts, die „hilfe“ im Titel, in der Beschreibung oder in den Tags haben.*/

// Einzelnen blogspost abrufen
router.get('/:id', async (req, res) => {
  const blogs = await blogs.findById(req.params.id).populate('user', 'name');
  if (!blogs) return res.status(404).json({ message: 'blogspost nicht gefunden' });
  res.json(blogs);
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
    const blogs = await blogs.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blogs) return res.status(404).json({ message: 'blogspost nicht gefunden' });
    res.json(blogs);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Bearbeiten', error });
  }
});

// blogspost löschen
router.delete('/:id', protect, async (req, res) => {
  const blogs = await blogs.findByIdAndDelete(req.params.id);
  if (!blogs) return res.status(404).json({ message: 'blogspost nicht gefunden' });
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