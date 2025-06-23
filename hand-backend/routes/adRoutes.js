import express from 'express';
import {protect} from '../middleware/authMiddleware.js';
import Ad from '../models/adModel.js';

const router = express.Router();

// Suche nach Anzeigen (Ads) mit Titel, Beschreibung, Typ oder Tags.
// Beispiel: /api/ads?q=suche
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

/*Hinweise:

Die Suche ist case-insensitive (Groß-/Kleinschreibung wird ignoriert).
Du kannst nach Titel, Beschreibung, Typ und Tags suchen.
Beispiel:
/api/ads?q=suche findet alle Anzeigen, die „suche“ im Titel, in der Beschreibung, im Typ oder in den Tags haben.*/

// Einzelne Anzeige abrufen
router.get('/:id', async (req, res) => {
  const ad = await Ad.findById(req.params.id).populate('user', 'nickname');
  if (!ad) return res.status(404).json({ message: 'Anzeige nicht gefunden' });
  res.json(ad);
});

// Neue Anzeige erstellen
// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const ad = new Ad({ ...req.body, user: req.user._id });
//     await ad.save();
//     res.status(201).json(ad);
//   } catch (error) {
//     res.status(400).json({ message: 'Fehler beim Erstellen', error });
//   }
// });

router.post('/', protect, async (req, res) => {
  try {
    const ad = new Ad({ ...req.body, user: req.user._id });
    await ad.save();
    res.status(201).json(ad);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Erstellen', error });
  }
});

// Anzeige bearbeiten
// router.put('/:id', authMiddleware, async (req, res) => {
//   try {
//     const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!ad) return res.status(404).json({ message: 'Anzeige nicht gefunden' });
//     res.json(ad);
//   } catch (error) {
//     res.status(400).json({ message: 'Fehler beim Bearbeiten', error });
//   }
// });

router.put('/:id', protect, async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ad) return res.status(404).json({ message: 'Anzeige nicht gefunden' });
    res.json(ad);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Bearbeiten', error });
  }
});

// Anzeige löschen
// router.delete('/:id', authMiddleware, async (req, res) => {
//   const ad = await Ad.findByIdAndDelete(req.params.id);
//   if (!ad) return res.status(404).json({ message: 'Anzeige nicht gefunden' });
//   res.json({ message: 'Anzeige gelöscht' });
// });

router.delete('/:id', protect, async (req, res) => {
  const ad = await Ad.findByIdAndDelete(req.params.id);
  if (!ad) return res.status(404).json({ message: 'Anzeige nicht gefunden' });
  res.json({ message: 'Anzeige gelöscht' });
});

export default router;