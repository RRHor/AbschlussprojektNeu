import express from 'express';
import User from '../models/UserModel.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Einzelnen User abrufen
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('adress');
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

// Userdaten aktualisieren (nur für eingeloggten User oder Admin)
router.put('/users/:id', authMiddleware, async (req, res) => {
  try {
    // Optional: Prüfen, ob req.user._id === req.params.id oder req.user.isAdmin
    if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Keine Berechtigung' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('adress');
    if (!user) {
      return res.status(404).json({ message: 'User nicht gefunden' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Aktualisierung fehlgeschlagen', error: error.message });
  }
});

// Admin kann andere User zu Admins machen (Admin-Check enthalten)
router.patch('/users/:id/make-admin', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Nur Admins dürfen diese Aktion durchführen' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User nicht gefunden' });
    res.json({ message: 'User ist jetzt Admin', user });
  } catch (error) {
    res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
});

export default router;