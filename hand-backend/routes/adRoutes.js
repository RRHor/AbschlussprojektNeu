import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Ad from '../models/adModel.js';

const router = express.Router();

// Alle Anzeigen abrufen
router.get('/', async (req, res) => {
  const ads = await Ad.find().populate('user', 'nickname');
  res.json(ads);
});

// Einzelne Anzeige abrufen
router.get('/:id', async (req, res) => {
  const ad = await Ad.findById(req.params.id).populate('user', 'nickname');
  if (!ad) return res.status(404).json({ message: 'Anzeige nicht gefunden' });
  res.json(ad);
});

// Neue Anzeige erstellen
router.post('/', authMiddleware, async (req, res) => {
  try {
    const ad = new Ad({ ...req.body, user: req.user._id });
    await ad.save();
    res.status(201).json(ad);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Erstellen', error });
  }
});

// Anzeige bearbeiten
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ad) return res.status(404).json({ message: 'Anzeige nicht gefunden' });
    res.json(ad);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Bearbeiten', error });
  }
});

// Anzeige löschen
router.delete('/:id', authMiddleware, async (req, res) => {
  const ad = await Ad.findByIdAndDelete(req.params.id);
  if (!ad) return res.status(404).json({ message: 'Anzeige nicht gefunden' });
  res.json({ message: 'Anzeige gelöscht' });
});

export default router;