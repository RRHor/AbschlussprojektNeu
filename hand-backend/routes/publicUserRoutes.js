
import express from 'express';
import User from '../models/UserModel.js';

const router = express.Router();

// Öffentliche User-Liste (nur nickname und Stadtteil Alle user)
router.get('/public-users', async (req, res) => {
  // für eine unscharfe Usersuche Unscharfe Suche = Teil vom Namen reicht, 
  // exakte Übereinstimmung ist nicht nötig.
  const { q } = req.query;
  let filter = {};
  if (q) {
    filter.nickname = { $regex: q, $options: 'i' }; // unscharfe Suche, case-insensitive
  }
  try {
    const users = await User.find({}, { nickname: 1, 'addresses.district': 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
});

// Einzelnen User nach Nickname suchen
router.get('/public-users/:nickname', async (req, res) => {
  try {
    const user = await User.findOne(
      { nickname: req.params.nickname },
      { nickname: 1, 'addresses.district': 1 }
    );
    if (!user) {
      return res.status(404).json({ message: 'User nicht gefunden' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
});

export default router;