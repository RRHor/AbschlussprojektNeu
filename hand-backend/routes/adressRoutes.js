import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/UserModel.js';

const router = express.Router();

/**
 * Fügt dem eingeloggten User eine neue Adresse hinzu.
 * Erwartet die Adressdaten im Request-Body.
 */
router.post('/users/me/adresses', protect, async (req, res) => {
    try {
        const { firstName, lastName, street, zipCode, city, district, state } = req.body;

        // Validierung
        if (!firstName || !lastName || !street || !zipCode || !city || !district || !state) {
            return res.status(400).json({ message: 'Alle Felder sind erforderlich.' });
        }

        // Neue Adresse direkt zum User hinzufügen
        const user = await User.findById(req.user._id);
        
        // Neue Adresse zum Array hinzufügen
        user.adresses.push({
            firstName,
            lastName,
            street,
            zipCode: parseInt(zipCode, 10),
            city,
            district,
            state
        });

        await user.save();

        res.status(201).json({ 
            message: 'Adresse erfolgreich hinzugefügt', 
            adresses: user.adresses 
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
router.put('/users/me/adresses', protect, async (req, res) => {
    try {
        let addresses = req.body.addresses;
        // Falls der Client ein einzelnes Objekt schickt, in ein Array umwandeln
        if (!Array.isArray(addresses) && typeof addresses === 'object') {
            addresses = [addresses];
        }
        // Validierung: alle Felder in jedem Adress-Objekt prüfen
        if (!addresses || !addresses.length || addresses.some(addr =>
            !addr.firstName || !addr.lastName || !addr.street || !addr.city || !addr.district || !addr.zipCode || !addr.state
        )) {
            return res.status(400).json({ message: "Alle Felder sind erforderlich." });
        }
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { addresses: addresses.map(addr => ({
                ...addr,
                zipCode: parseInt(addr.zipCode, 10)
            })) },
            { new: true }
        );
        res.json({ message: "Adresse aktualisiert", addresses: user.addresses });
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
router.put('/users/me/adresses/:index', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const idx = parseInt(req.params.index, 10);
        
        if (idx < 0 || idx >= user.adresses.length) {
            return res.status(404).json({ message: "Adresse nicht gefunden" });
        }

        const { firstName, lastName, street, city, district, zipCode, state } = req.body;

        // Validierung
        if (!firstName || !lastName || !street || !city || !district || !zipCode || !state) {
            return res.status(400).json({ message: "Alle Felder sind erforderlich." });
        }

        // Adresse aktualisieren
        user.adresses[idx] = {
            firstName,
            lastName,
            street,
            city,
            district,
            zipCode: parseInt(zipCode, 10),
            state
        };

        await user.save();
        res.json({ message: "Adresse aktualisiert", adresses: user.adresses });
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
router.delete('/users/me/adresses/:index', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const idx = parseInt(req.params.index, 10);
        
        if (idx < 0 || idx >= user.adresses.length) {
            return res.status(404).json({ message: "Adresse nicht gefunden" });
        }

        user.adresses.splice(idx, 1); // Adresse entfernen
        await user.save();
        
        res.json({ message: "Adresse gelöscht", adresses: user.adresses });
    } catch (error) {
        console.error('Fehler beim Löschen der Adresse:', error);
        res.status(500).json({ 
            message: "Fehler beim Löschen der Adresse", 
            error: error.message 
        });
    }
});

export default router;