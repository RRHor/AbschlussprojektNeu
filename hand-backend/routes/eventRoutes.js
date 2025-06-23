import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Event from '../models/eventModel.js';

const router = express.Router();

/**
 * Alle Events abrufen
 * Gibt eine Liste aller Events mit Organisator- und Teilnehmernamen zurück
 */
router.get('/', async (req, res) => {
  const events = await Event.find()
    .populate('organizer', 'nickname')
    .populate('participants', 'nickname');
  res.json(events);
});

/**
 * Einzelnes Event abrufen
 * Gibt ein Event anhand der ID zurück, inkl. Organisator und Teilnehmer
 */
router.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('organizer', 'nickname')
    .populate('participants', 'nickname');
  if (!event) return res.status(404).json({ message: 'Event nicht gefunden' });
  res.json(event);
});

/**
 * Neues Event erstellen (geschützt)
 * Nur eingeloggte User können Events erstellen
 */
router.post('/', protect, async (req, res) => {
  try {
    const event = new Event({ ...req.body, organizer: req.user._id });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Erstellen', error });
  }
});

/**
 * Event bearbeiten (geschützt)
 * Nur eingeloggte User können Events bearbeiten
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event nicht gefunden' });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Bearbeiten', error });
  }
});

/**
 * Event löschen (geschützt)
 * Nur eingeloggte User können Events löschen
 */
router.delete('/:id', protect, async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event nicht gefunden' });
  res.json({ message: 'Event gelöscht' });
});

/**
 * An Event teilnehmen (geschützt)
 * Fügt den eingeloggten User als Teilnehmer zum Event hinzu
 */
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
 * Die Suche ist case-insensitive und durchsucht auch Organisator- und Teilnehmernamen.
 */
router.get('/', async (req, res) => {
  const { q } = req.query;
  let filter = {};
  if (q) {
    filter = {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    };
  }
  let events = await Event.find(filter)
    .populate('organizer', 'name nickname')
    .populate('participants', 'name nickname');

  // Nach Usernamen filtern, falls q gesetzt ist
  if (q) {
    const regex = new RegExp(q, 'i');
    events = events.filter(event =>
      regex.test(event.organizer?.name || '') ||
      regex.test(event.organizer?.nickname || '') ||
      event.participants.some(user =>
        regex.test(user.name || '') || regex.test(user.nickname || '')
      ) ||
      regex.test(event.title) ||
      regex.test(event.description) ||
      regex.test(event.location) ||
      (event.tags && event.tags.some(tag => regex.test(tag)))
    );
  }

  res.json(events);
});

/*
Hinweise:
- Die Suche ist case-insensitive.
- Du kannst nach Titel, Beschreibung, Ort, Tags, Organisator- und Teilnehmernamen suchen.
- Beispiel: /api/events?q=hilfe findet alle Events, die "hilfe" im Titel, in der Beschreibung, im Ort, in den Tags oder bei den Usernamen haben.
*/

export default router;