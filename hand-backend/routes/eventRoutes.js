import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
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
router.post('/', authMiddleware, async (req, res) => {
  try {
    const event = new Event({ ...req.body, organizer: req.user._id });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Erstellen', error });
  }
});

// Event bearbeiten
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event nicht gefunden' });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Bearbeiten', error });
  }
});

// Event löschen
router.delete('/:id', authMiddleware, async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event nicht gefunden' });
  res.json({ message: 'Event gelöscht' });
});

// An Event teilnehmen
router.post('/:id/join', authMiddleware, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event nicht gefunden' });
  if (!event.participants.includes(req.user._id)) {
    event.participants.push(req.user._id);
    await event.save();
  }
  res.json({ message: 'Teilnahme bestätigt', event });
});

export default router;