import express from 'express';
import User from '../models/UserModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Route für eingeloggten User (JWT-geschützt)
 * Gibt die Daten des aktuell eingeloggten Users zurück
 */
router.get('/users/me', protect, async (req, res) => {
  try {
    // Password-Feld ausschließen und Existenz prüfen
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }
    res.json(user);
  } catch (error) {
    console.error('Fehler in /users/me:', error);
    res.status(500).json({ message: "Serverfehler", error: error.message });
  }
});

/**
 * Einzelnen User abrufen (öffentlich)
 * Gibt die Daten eines Users anhand der ID zurück (ohne Passwort)
 */
router.get('/users/:id', async (req, res) => {
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

/**
 * Eigene Userdaten aktualisieren (geschützt)
 * Aktualisiert die Daten des eingeloggten Users
 */
router.put('/me', protect, async (req, res) => {
  try {
    const userId = req.user._id; // aus dem Token
    const updateData = req.body;

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

export default router;