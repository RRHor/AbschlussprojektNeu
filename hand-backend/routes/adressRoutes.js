import express from 'express';
import Adresse from '../models/adressSchema.js';
import {protect} from '../middleware/authMiddleware.js';
import User from '../models/userSchema.js';

const router = express.Router();

router.post('/users/me/adresse', protect, async (req, res) => {
    try {
        const {firstName, lastName, street, zipCode, city, district} = req.body;

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

        // 2. User aktualisieren (Adresse zuweisen)
        const user = await User.findById(req.user._id);

        // User bekommt die Adresse zugewiesen
        req.user.adress = adresse._id;
        await req.user.save();
        res.status(201).json({message: 'Adresse erfolgrich angelegt', adresse});
    } catch (error) {
        // console.error('Fehler beim Anlegen der Adresse:', error);
        res.status(500).json({message: 'Serverfehler beim Anlegen der Adresse', error: error.message});
    }
})

export default router;