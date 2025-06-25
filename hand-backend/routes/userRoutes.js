import express from 'express';
import User from '../models/userSchema.js'; // Passe ggf. den Pfad/Dateinamen an
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Route für eingeloggten User (JWT-geschützt)
 * Gibt die Daten des aktuell eingeloggten Users zurück
 */
router.get('/users/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Serverfehler", error: error.message });
  }
});

/**
 * Einzelnen User abrufen (öffentlich)
 * Gibt die Daten eines Users anhand der ID zurück
 */
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Serverfehler", error: error.message });
  }
});

/**
 * Userdaten aktualisieren (geschützt)
 * Aktualisiert die Daten des Users mit der angegebenen ID
 */
router.put('/users/:id', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Aktualisierung fehlgeschlagen", error: error.message });
  }
});

export default router;