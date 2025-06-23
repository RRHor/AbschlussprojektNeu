import express from 'express';
import {protect} from '../middleware/authMiddleware.js';
import Event from '../models/eventModel.js';

const router = express.Router();

// Alle Events abrufen
router.get('/', async (req, res) => {
  const events = await Event.find().populate('organizer', 'nickname').populate('participants', 'nickname');
  res.json(events);
});

// Einzelnes Event abrufen
router.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'nickname').populate('participants', 'nickname');
  if (!event) return res.status(404).json({ message: 'Event nicht gefunden' });
  res.json(event);
});

// Neues Event erstellen
<<<<<<< HEAD
=======
// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const event = new Event({ ...req.body, organizer: req.user._id });
//     await event.save();
//     res.status(201).json(event);
//   } catch (error) {
//     res.status(400).json({ message: 'Fehler beim Erstellen', error });
//   }
// });

>>>>>>> 3721eefb9d95a337e082e1e867930b8f4f605d4d
router.post('/', protect, async (req, res) => {
  try {
    const event = new Event({ ...req.body, organizer: req.user._id });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Erstellen', error });
  }
});

// Event bearbeiten
<<<<<<< HEAD
=======
// router.put('/:id', authMiddleware, async (req, res) => {
//   try {
//     const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!event) return res.status(404).json({ message: 'Event nicht gefunden' });
//     res.json(event);
//   } catch (error) {
//     res.status(400).json({ message: 'Fehler beim Bearbeiten', error });
//   }
// });

>>>>>>> 3721eefb9d95a337e082e1e867930b8f4f605d4d
router.put('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event nicht gefunden' });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Bearbeiten', error });
  }
});

// Event löschen
<<<<<<< HEAD
=======
// router.delete('/:id', authMiddleware, async (req, res) => {
//   const event = await Event.findByIdAndDelete(req.params.id);
//   if (!event) return res.status(404).json({ message: 'Event nicht gefunden' });
//   res.json({ message: 'Event gelöscht' });
// });

>>>>>>> 3721eefb9d95a337e082e1e867930b8f4f605d4d
router.delete('/:id', protect, async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event nicht gefunden' });
  res.json({ message: 'Event gelöscht' });
});

// An Event teilnehmen
<<<<<<< HEAD
=======
// router.post('/:id/join', authMiddleware, async (req, res) => {
//   const event = await Event.findById(req.params.id);
//   if (!event) return res.status(404).json({ message: 'Event nicht gefunden' });
//   if (!event.participants.includes(req.user._id)) {
//     event.participants.push(req.user._id);
//     await event.save();
//   }
//   res.json({ message: 'Teilnahme bestätigt', event });
// });

>>>>>>> 3721eefb9d95a337e082e1e867930b8f4f605d4d
router.post('/:id/join', protect, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event nicht gefunden' });
  if (!event.participants.includes(req.user._id)) {
    event.participants.push(req.user._id);
    await event.save();
  }
  res.json({ message: 'Teilnahme bestätigt', event });
});

/**
 * Suche nach Events mit Titel, Beschreibung, Ort oder Tags.
 * Beispiel: /api/events?q=nachbarschaft
 */
router.get('/', async (req, res) => {
  const { q } = req.query;
  let filter = {};
  if (q) {
    filter = {
      $or: [
        { title: { $regex: q, $options: 'i' } },         // Suche im Titel
        { description: { $regex: q, $options: 'i' } },   // Suche in der Beschreibung
        { location: { $regex: q, $options: 'i' } },      // Suche im Ort
        { tags: { $regex: q, $options: 'i' } }           // Suche in Tags
      ]
    };
  }
  // Events mit Userdaten holen
  let events = await Event.find(filter)
    .populate('organizer', 'name nickname')
    .populate('participants', 'name nickname');

  // Falls q gesetzt ist, auch nach Usernamen filtern
  if (q) {
    const regex = new RegExp(q, 'i');
    events = events.filter(event =>
      regex.test(event.organizer?.name || '') ||
      regex.test(event.organizer?.nickname || '') ||
      event.participants.some(user =>
        regex.test(user.name || '') || regex.test(user.nickname || '')
      ) ||
      // Die bisherigen Felder bleiben erhalten
      regex.test(event.title) ||
      regex.test(event.description) ||
      regex.test(event.location) ||
      (event.tags && event.tags.some(tag => regex.test(tag)))
    );
  }

  res.json(events);
});

/*Hinweise:
- die Suche ist case-insensitive
- du kannst nach Titel, Beschreibung, Ort und Tags suchen
- Beispiel: /api/events?q= hilfe findet alle Events, die "hilfe" im Titel, in der Beschreibung, im Ort oder in den Tags haben
- mit populate('organizer', 'name') und populate('participants', 'name') bekommst du die Namen der Organisatoren und Teilnehmer direkt mitgeliefert*/

export default router;