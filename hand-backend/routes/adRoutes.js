import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Ad from '../models/adModel.js';

const router = express.Router();

/**
 * Suche nach Anzeigen (Ads) mit Titel, Beschreibung, Typ oder Tags.
 * Beispiel: /api/ads?q=suche
 * Die Suche ist case-insensitive (Groß-/Kleinschreibung wird ignoriert).
 */
router.get('/', async (req, res) => {
  const { q } = req.query;
  let filter = {};
  if (q) {
    filter = {
      $or: [
        { title: { $regex: q, $options: 'i' } },         // Suche im Titel
        { description: { $regex: q, $options: 'i' } },   // Suche in der Beschreibung
        { type: { $regex: q, $options: 'i' } },          // Suche im Typ (biete/suche/tausche)
        { tags: { $regex: q, $options: 'i' } }           // Suche in Tags
      ]
    };
  }
  const ads = await Ad.find(filter).populate('user', 'name');
  res.json(ads);
});

/**
 * Einzelne Anzeige abrufen
 * Beispiel: GET /api/ads/:id
 */
router.get('/:id', async (req, res) => {
  const ad = await Ad.findById(req.params.id).populate('user', 'nickname');
  if (!ad) return res.status(404).json({ message: 'Anzeige nicht gefunden' });
  res.json(ad);
});

/**
 * Neue Anzeige erstellen (nur für eingeloggte User)
 * Beispiel: POST /api/ads
 * Body: { ... }
 */
router.post('/', protect, async (req, res) => {
  try {
    const ad = new Ad({ ...req.body, user: req.user._id });
    await ad.save();
    res.status(201).json(ad);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Erstellen', error });
  }
});

/**
 * Anzeige bearbeiten (nur für eingeloggte User)
 * Beispiel: PUT /api/ads/:id
 * Body: { ... }
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ad) return res.status(404).json({ message: 'Anzeige nicht gefunden' });
    res.json(ad);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Bearbeiten', error });
  }
});

/**
 * Anzeige löschen (nur für eingeloggte User)
 * Beispiel: DELETE /api/ads/:id
 */
router.delete('/:id', protect, async (req, res) => {
  const ad = await Ad.findByIdAndDelete(req.params.id);
  if (!ad) return res.status(404).json({ message: 'Anzeige nicht gefunden' });
  res.json({ message: 'Anzeige gelöscht' });
});

export default router;