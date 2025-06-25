import express from 'express';
import User from '../models/userSchema.js';
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
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: "Serverfehler", error: error.message });
  }
});

/**
 * Einzelnen User abrufen (öffentlich - aber sicher!)
 * Gibt nur öffentliche Daten eines Users zurück
 */
router.get('/users/:id', async (req, res) => {
  try {
    // Nur öffentliche Felder zeigen (nickname und Stadtteil)
    const user = await User.findById(req.params.id)
      .select('nickname adress.district -_id');
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
 * Userdaten aktualisieren (geschützt + Autorisierung)
 * Aktualisiert die Daten des Users mit der angegebenen ID
 */
router.put('/users/:id', protect, async (req, res) => {
  try {
    // Sicherheit: Nur eigene Daten ändern (außer Admin)
    if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Zugriff verweigert' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true  // Mongoose-Validierung aktivieren
    }).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }
    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: "Aktualisierung fehlgeschlagen", error: error.message });
  }
});

export default router;