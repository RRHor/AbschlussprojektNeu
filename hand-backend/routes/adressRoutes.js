import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/userSchema.js'; // Passe ggf. den Pfad an

const router = express.Router();

/**
 * Fügt dem eingeloggten User eine neue Adresse hinzu.
 * Erwartet die Adressdaten im Request-Body.
 * Beispiel-Body:
 * {
 *   "firstName": "Max",
 *   "lastName": "Mustermann",
 *   "street": "Beispielstraße 1",
 *   "zipCode": 12345,
 *   "city": "Beispielstadt",
 *   "district": "Mitte"
 * }
 */
router.post('/users/me/adress', protect, async (req, res) => {
    try {
        const { firstName, lastName, street, zipCode, city, district } = req.body;

        // Adresse anlegen und mit der User-ID verknüpfen
        const adresse = new Adresse({
            firstName,
            lastName,
            street,
            zipCode,
            city,
            district,
            user: req.user._id
        });

        await adresse.save();

        // User aktualisieren (Adresse zuweisen)
        const user = await User.findById(req.user._id);
        user.adress = adresse._id;
        await user.save();

        res.status(201).json({ message: 'Adresse erfolgreich angelegt', adresse });
    } catch (error) {
        res.status(500).json({ message: 'Serverfehler beim Anlegen der Adresse', error: error.message });
    }
});

/**
 * Überschreibt ALLE Adressen des Users mit einer neuen Adresse (nur sinnvoll, wenn User nur eine Adresse haben soll).
 * Erwartet die Adressdaten im Request-Body.
 */
router.put('/users/me/adress', protect, async (req, res) => {
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
router.put('/users/me/adress/:index', protect, async (req, res) => {
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
router.delete('/users/me/adress/:index', protect, async (req, res) => {
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