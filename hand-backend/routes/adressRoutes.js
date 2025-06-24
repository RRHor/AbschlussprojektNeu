import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/UserModel.js';

const router = express.Router();

/**
 * Fügt dem eingeloggten User eine neue Adresse hinzu.
 * Erwartet die Adressdaten im Request-Body.
 * Beispiel-Body:
 * {
 *   "street": "Beispielstraße 1",
 *   "city": "Beispielstadt",
 *   "district": "Mitte",
 *   "zip": 12345
 * }
 */
router.post('/users/me/adress', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.adress.push(req.body); // Neue Adresse ans Array anhängen
        await user.save();
        res.status(201).json({ message: "Adresse hinzugefügt", adress: user.adress });
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Hinzufügen der Adresse", error: error.message });
    }
});

/**
 * Überschreibt ALLE Adressen des Users mit einer neuen Adresse (nur sinnvoll, wenn User nur eine Adresse haben soll).
 * Erwartet die Adressdaten im Request-Body.
 */
router.put('/users/me/adress', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, street, city, district, zip, state } = req.body;

    if (!firstName || !lastName || !street || !city || !district || !zip || !state) {
      return res.status(400).json({ message: "Alle Felder sind erforderlich." });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { adress: [{ firstName, lastName, street, city, district, zip, state }] },
      { new: true }
    );

    res.json({ message: "Adresse aktualisiert", adress: user.adress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Aktualisieren der Adresse", error: error.message });
  }
});

/**
 * Aktualisiert eine bestimmte Adresse im Adress-Array des Users anhand des Index.
 * Beispiel: PUT /users/me/adress/0 aktualisiert die erste Adresse.
 * Erwartet die neuen Adressdaten im Body.
 */
router.put('/users/me/adress/:index', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const idx = parseInt(req.params.index, 10);
    if (user.adress[idx]) {
      user.adress[idx] = req.body; // Adresse ersetzen
      await user.save();
      res.json({ message: "Adresse aktualisiert", adress: user.adress });
    } else {
      res.status(404).json({ message: "Adresse nicht gefunden" });
    }
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Aktualisieren der Adresse", error: error.message });
  }
});

/**
 * Löscht eine bestimmte Adresse im Adress-Array des Users anhand des Index.
 * Beispiel: DELETE /users/me/adress/0 löscht die erste Adresse.
 */
router.delete('/users/me/adress/:index', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const idx = parseInt(req.params.index, 10);
    if (user.adress[idx]) {
      user.adress.splice(idx, 1); // Adresse entfernen
      await user.save();
      res.json({ message: "Adresse gelöscht", adress: user.adress });
    } else {
      res.status(404).json({ message: "Adresse nicht gefunden" });
    }
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Löschen der Adresse", error: error.message });
  }
});

export default router;