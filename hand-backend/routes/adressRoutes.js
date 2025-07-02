import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/UserModel.js';

const router = express.Router();

/**
 * Fügt dem eingeloggten User eine neue Adresse hinzu.
 * Erwartet die Adressdaten im Request-Body.
 */
router.post('/users/me/adress', protect, async (req, res) => {
    try {
        const { firstName, lastName, street, zip, city, district, state } = req.body;

        // Validierung
        if (!firstName || !lastName || !street || !zip || !city || !district || !state) {
            return res.status(400).json({ message: 'Alle Felder sind erforderlich.' });
        }

        // Neue Adresse direkt zum User hinzufügen
        const user = await User.findById(req.user._id);
        
        // Neue Adresse zum Array hinzufügen
        user.adress.push({
            firstName,
            lastName,
            street,
            zip: parseInt(zip, 10),
            city,
            district,
            state
        });

        await user.save();

        res.status(201).json({ 
            message: 'Adresse erfolgreich hinzugefügt', 
            adress: user.adress 
        });
    } catch (error) {
        console.error('Fehler beim Hinzufügen der Adresse:', error);
        res.status(500).json({ 
            message: 'Serverfehler beim Anlegen der Adresse', 
            error: error.message 
        });
    }
});

/**
 * Überschreibt ALLE Adressen des Users mit einer neuen Adresse.
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
            { adress: [{ 
                firstName, 
                lastName, 
                street, 
                city, 
                district, 
                zip: parseInt(zip, 10), 
                state 
            }] },
            { new: true }
        );

        res.json({ message: "Adresse aktualisiert", adress: user.adress });
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Adresse:', error);
        res.status(500).json({ 
            message: "Fehler beim Aktualisieren der Adresse", 
            error: error.message 
        });
    }
});

/**
 * Aktualisiert eine bestimmte Adresse im Adress-Array des Users anhand des Index.
 * Beispiel: PUT /users/me/adress/0 aktualisiert die erste Adresse.
 */
router.put('/users/me/adress/:index', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const idx = parseInt(req.params.index, 10);
        
        if (idx < 0 || idx >= user.adress.length) {
            return res.status(404).json({ message: "Adresse nicht gefunden" });
        }

        const { firstName, lastName, street, city, district, zip, state } = req.body;

        // Validierung
        if (!firstName || !lastName || !street || !city || !district || !zip || !state) {
            return res.status(400).json({ message: "Alle Felder sind erforderlich." });
        }

        // Adresse aktualisieren
        user.adress[idx] = {
            firstName,
            lastName,
            street,
            city,
            district,
            zip: parseInt(zip, 10),
            state
        };

        await user.save();
        res.json({ message: "Adresse aktualisiert", adress: user.adress });
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Adresse:', error);
        res.status(500).json({ 
            message: "Fehler beim Aktualisieren der Adresse", 
            error: error.message 
        });
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
        
        if (idx < 0 || idx >= user.adress.length) {
            return res.status(404).json({ message: "Adresse nicht gefunden" });
        }

        user.adress.splice(idx, 1); // Adresse entfernen
        await user.save();
        
        res.json({ message: "Adresse gelöscht", adress: user.adress });
    } catch (error) {
        console.error('Fehler beim Löschen der Adresse:', error);
        res.status(500).json({ 
            message: "Fehler beim Löschen der Adresse", 
            error: error.message 
        });
    }
});

export default router;