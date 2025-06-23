
import express from 'express';
import User from '../models/userSchema.js';
import { protect } from '../middleware/authMiddleware.js'; // Assuming you have an auth middleware for protection

const router = express.Router();

router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('adress');
    if (!user) {
      return res.status(404).json({ message: 'User nicht gefunden' });
    }
    res.json(user);
  // } catch (error) {
  //   res.status(500).json({ message: 'Serverfehler', error: error.message });
  // }
  } catch (error) {
    console.error('Fehler in /user/:id:', error);
    res.status(500).json({ message: 'Serverfehler', error: error.message, stack: error.stack });
  }
});

// Route für eingeloggten User (JWT-geschützt)
router.get('/users/me', protect, async (req, res) => {
  res.json(req.user);
});

// Hier mit GET alle User aus Datenbank holen
router.get('/users', protect, async (req, res) => {
  try {
    // Optional: Nur fpr Admins freigeben
    if (!req.user.isAdmin) {
      return res.status(402).json({ message: 'Zuggriff verweigert. Nur Admins fürfen alle User sehen.' });
    }
    // Alle User mit Adresse abrufen
    const users = await User.find();
    // const users = await User.find().populate('adress');
    res.json(users);

  } catch (error) {
    res.status(500).json({ message: 'Serverfehler', error: error.message });
  }  
});



// Admin kann andere User zu Admins machen
// router.patch('/user/:id/make-admin', async (req, res) => {
//     try {
//         // Hier sollte geprüft werden, ob der aktuelle User Admin ist (z.B. per JWT und Middleware)
//         const user = await User.findByIdAndUpdate(
//             req.params.id,
//             { isAdmin: true },
//             { new: true }
//         );
//         if (!user) return res.status(404).json({ message: 'User nicht gefunden' });
//         res.json({ message: 'User ist jetzt Admin', user });
//     } catch (error) {
//         res.status(500).json({ message: 'Serverfehler', error: error.message });
//     }
// });

export default router;