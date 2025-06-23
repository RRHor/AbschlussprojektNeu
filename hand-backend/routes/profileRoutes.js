
import express from 'express';
import {protect} from '../middleware/authMiddleware.js'; // oder { protect } je nach Export
import User from '../models/userSchema.js';

const router = express.Router();

// Profil-Endpunkt (geschützt)
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

export default router;