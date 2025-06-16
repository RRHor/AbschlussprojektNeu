import express from 'express';
import { sendVerificationEmail } from '../utils/emailService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, code } = req.body;
  try {
    const result = await sendVerificationEmail(email, code);
    if (result.success) {
      res.status(200).json({ success: true, message: 'E-Mail erfolgreich gesendet!', messageId: result.messageId });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
    res.status(500).json({ success: false, error: 'Interner Serverfehler' });
  }
});

export default router;