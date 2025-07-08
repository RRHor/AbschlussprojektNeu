import express from 'express';
import {protect} from '../middleware/authMiddleware.js'; // oder { protect } je nach Export
import User from '../models/UserModel.js';
import Post from '../models/postModel.js'; // Importiere das Post-Modell


const router = express.Router();

// Profil-Endpunkt (geschützt) - für Team-Kompatibilität
router.get('/profile', protect, async (req, res) => {
  try {
    // req.user wird im protect-Middleware gesetzt
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User nicht gefunden' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Gleiche Route als /users/me - für einheitliche API-Struktur
router.get('/users/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User nicht gefunden' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Neuen Endpunkt für das Abrufen von Beiträgen eines Benutzers
/*
router.get('/profile/posts', protect, async (req, res) => {
  try {
    // Finde den Benutzer und beziehe die zugehörigen Beiträge
    const userWithPosts = await User.findById(req.user._id)
      .select('-password')
      .populate('posts'); // Angenommen, das Feld heißt 'posts'

    if (!userWithPosts) return res.status(404).json({ message: 'User nicht gefunden' });

    res.json(userWithPosts.posts);
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});
*/

// Beispiel für einen geschützten Endpunkt zum Erstellen eines Beitrags
/*
router.post('/profile/posts', protect, async (req, res) => {
  const { title, content } = req.body;

  try {
    // Erstelle einen neuen Beitrag
    const newPost = await Post.create({
      title,
      content,
      user: req.user._id, // Setze den Benutzer, der den Beitrag erstellt hat
    });

    // Füge den neuen Beitrag zum Benutzerprofil hinzu
    await User.findByIdAndUpdate(req.user._id, { $push: { posts: newPost._id } });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler' });
  // }
});
*/

// Beispiel für einen geschützten Endpunkt zum Abrufen eines bestimmten Beitrags
/*
router.get('/profile/posts/:id', protect, async (req, res) => {
  try {
    // Finde den Beitrag anhand der ID und beziehe den Benutzer
    const post = await Post.findById(req.params.id).populate('user', 'nickname');

    if (!post) return res.status(404).json({ message: 'Beitrag nicht gefunden' });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});
*/

export default router;