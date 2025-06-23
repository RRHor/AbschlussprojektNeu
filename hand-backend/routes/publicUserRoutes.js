
import express from 'express';
import User from '../models/userSchema.js';

const router = express.Router();

// Öffentliche User-Liste (nur nickname und Stadtteil)
router.get('/public-users', async (req, res) => {
  try {
    const users = await User.find({}, { nickname: 1, 'adress.district': 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
});

export default router;