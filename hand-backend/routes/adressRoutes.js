import express from 'express';
import Adresse from '../models/adressSchema.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/users/me/adress', authMiddleware, async (req, res) => {
    try {
        const {firstName, lastName, street, zipCode, city, district} = req.body;

        // Adresse anlegen und mit der User-ID verknüpfen
        const adress = new Adresse({
            firstName,
            lastName,
            street,
            zipCode,
            city,
            district,
            user: req.user._id
        });

        await adress.save();

        // User bekommt die Adresse zugewiesen
        req.user.adress = adress._id;
        await req.user.save();
        res.status(201).json({message: 'Adresse erfolgrich angelegt', adress});
    } catch (error) {
        // console.error('Fehler beim Anlegen der Adresse:', error);
        res.status(500).json({message: 'Serverfehler beim Anlegen der Adresse', error: error.message});
    }
})

export default router;