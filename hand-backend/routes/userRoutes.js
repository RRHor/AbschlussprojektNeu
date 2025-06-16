import express from 'express';
import User from '../models/userSchema.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Korrigierter Import

const router = express.Router();

// Einzelnen User abrufen
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('adress'); // Feldname angepasst
    if (!user) {
      return res.status(404).json({ message: 'User nicht gefunden' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
});

// Route für eingeloggten User (JWT-geschützt)
router.get('/users/me', authMiddleware, async (req, res) => {
  res.json(req.user);
});

// Admin kann andere User zu Admins machen (nur als Vorlage, Admin-Check fehlt noch!)
// router.patch('/user/:id/make-admin', authMiddleware, async (req, res) => {
//   try {
//     // Hier sollte geprüft werden, ob req.user.isAdmin === true
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { isAdmin: true },
//       { new: true }
//     );
//     if (!user) return res.status(404).json({ message: 'User nicht gefunden' });
//     res.json({ message: 'User ist jetzt Admin', user });
//   } catch (error) {
//     res.status(500).json({ message: 'Serverfehler', error: error.message });
//   }
// });

export default router;