import express from 'express';
import User from '../models/UserModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Route für eingeloggten User (JWT-geschützt)
 * GET /api/users/me
 */
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }
    res.json(user);
  } catch (error) {
    console.error('Fehler in /me:', error);
    res.status(500).json({ message: "Serverfehler", error: error.message });
  }
});

/**
 * Eigene Userdaten aktualisieren (geschützt)
 * PUT /api/users/me
 */
router.put('/me', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = req.body;

    // lastActivity bei jeder Aktualisierung setzen
    updateData.lastActivity = new Date();

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }
    res.json(user);
  } catch (error) {
    console.error('Fehler beim Update:', error);
    res.status(500).json({ message: "Aktualisierung fehlgeschlagen", error: error.message });
  }
});

/**
 * Aktive Nachbarn abrufen (öffentlich)
 * GET /api/users/active
 */
router.get('/active', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const activeUsers = await User.find({
      isVerified: true,
      $or: [
        { lastActivity: { $gte: thirtyDaysAgo } },
        { updatedAt: { $gte: thirtyDaysAgo } }
      ]
    })
    .select('nickname username createdAt updatedAt lastActivity')
    .sort({ lastActivity: -1, updatedAt: -1 })
    .limit(20);

    const shuffledUsers = activeUsers.sort(() => Math.random() - 0.5);
    
    const usersWithStatus = shuffledUsers.map(user => {
      const lastActivity = new Date(user.lastActivity || user.updatedAt);
      const hoursAgo = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60);
      
      return {
        _id: user._id,
        name: user.nickname || user.username,
        status: hoursAgo < 2 ? 'online' : 'away',
        lastSeen: lastActivity
      };
    });

    res.json(usersWithStatus);
  } catch (error) {
    console.error('Fehler beim Abrufen aktiver User:', error);
    res.status(500).json({ message: "Serverfehler", error: error.message });
  }
});

/**
 * User-Posts abrufen (geschützt)
 * GET /api/users/:userId/posts
 */
router.get('/:userId/posts', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Prüfen ob User seine eigenen Posts abruft oder Admin ist
    if (req.user._id.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Nicht autorisiert' });
    }

    let exchangePosts = [];
    let blogPosts = [];
    let eventComments = [];

    // Exchange-Posts laden
    try {
      const Exchange = (await import('../models/Exchange.js')).default;
      exchangePosts = await Exchange.find({ author: userId })
        .populate('author', 'nickname username')
        .sort({ createdAt: -1 });
    } catch (err) {
      console.log('Exchange-Model nicht gefunden');
    }

    // Blog-Posts laden
    try {
      const Blog = (await import('../models/Blog.js')).default;
      blogPosts = await Blog.find({ author: userId })
        .populate('author', 'nickname username')
        .sort({ createdAt: -1 });
    } catch (err) {
      console.log('Blog-Model nicht gefunden');
    }

    // Event-Kommentare laden
    try {
      const EventComment = (await import('../models/EventComment.js')).default;
      eventComments = await EventComment.find({ user: userId })
        .populate('user', 'nickname username')
        .populate('event', 'title')
        .sort({ createdAt: -1 });
    } catch (err) {
      console.log('EventComment-Model nicht gefunden');
    }

    res.json({
      exchangePosts,
      blogPosts,
      eventComments
    });
  } catch (error) {
    console.error('Fehler beim Laden der User-Posts:', error);
    res.status(500).json({ message: 'Serverfehler beim Laden der Posts' });
  }
});

/**
 * Einzelnen User abrufen (öffentlich)
 * GET /api/users/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }
    res.json(user);
  } catch (error) {
    console.error('Get public user error:', error);
    res.status(500).json({ message: "Serverfehler", error: error.message });
  }
});

export default router;