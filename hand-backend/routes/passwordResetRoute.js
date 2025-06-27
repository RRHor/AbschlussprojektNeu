import express from 'express';
import User from '../models/UserModel.js'; // UserModel verwenden!

const router = express.Router();

router.post('/password-reset', async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    
    // User finden und Code überprüfen
    const user = await User.findOne({ 
      email, 
      resetCode,
      resetCodeExpires: { $gt: Date.now() } // Code noch gültig
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Ungültiger oder abgelaufener Code' });
    }

    // Neues Passwort setzen
    user.password = newPassword; // Wird automatisch gehasht durch Schema-Middleware
    user.resetCode = null;
    user.resetCodeExpires = null;
    await user.save();

    res.json({ message: 'Passwort erfolgreich zurückgesetzt' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

export default router;