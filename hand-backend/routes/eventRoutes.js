import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Event from '../models/eventModel.js';

const router = express.Router();

/**
 * Alle Events abrufen ODER suchen
 * Beispiel: /api/events oder /api/events?q=nachbarschaft
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
    .populate('organizer', 'nickname')
    .populate('participants', 'nickname');

  // Zusätzliche Filterung nach Usernamen (falls q gesetzt)
  if (q) {
    const regex = new RegExp(q, 'i');
    events = events.filter(event =>
      regex.test(event.organizer?.nickname || '') ||
      event.participants.some(user => regex.test(user.nickname || '')) ||
      regex.test(event.title) ||
      regex.test(event.description) ||
      regex.test(event.location) ||
      (event.tags && event.tags.some(tag => regex.test(tag)))
    );
  }

  res.json(events);
});

/**
 * Einzelnes Event abrufen
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
 */
router.delete('/:id', protect, async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event nicht gefunden' });
  res.json({ message: 'Event gelöscht' });
});

/**
 * An Event teilnehmen (geschützt)
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

export default router;