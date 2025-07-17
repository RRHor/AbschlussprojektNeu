
import express from 'express';
import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

/**
 * Passwort-Reset-Route
 * Diese Route setzt das Passwort eines Users zurück, wenn ein gültiger Reset-Code oder Reset-Token vorliegt.
 * Sie akzeptiert sowohl "resetCode" als auch "code" im Request-Body, damit Frontend und Backend flexibel bleiben.
 */
router.post('/reset-password', async (req, res) => {
  try {
    // Hole alle möglichen Felder aus dem Request-Body
    // "resetCode" und "code" sind beide erlaubt, damit verschiedene Frontends funktionieren
    const { email, resetCode, code, resetPasswordToken, newPassword } = req.body;

    // Nutze entweder resetCode oder code (je nachdem, was gesendet wurde)
    const realResetCode = resetCode || code;

    let user = null;

    // 1. Suche User mit gültigem Reset-Code (6-stelliger Code aus E-Mail)
    if (realResetCode) {
      user = await User.findOne({
        email,
        resetCode: realResetCode,
        resetCodeExpires: { $gt: Date.now() } // Code darf nicht abgelaufen sein
      });
    }

    // 2. Alternativ: Suche User mit gültigem Reset-Token (z.B. für Links)
    if (!user && resetPasswordToken) {
      user = await User.findOne({
        email,
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() }
      });
    }

    // 3. Wenn kein User gefunden wurde, ist der Code/Token ungültig oder abgelaufen
    if (!user) {
      return res.status(400).json({ message: 'Ungültiger oder abgelaufener Code' });
    }

    // 4. Neues Passwort hashen (bcryptjs) – Sicherheit!
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 5. Passwort und Reset-Felder im User-Objekt aktualisieren
    user.password = hashedPassword;
    user.resetCode = null;
    user.resetCodeExpires = null;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    // 6. User speichern (jetzt ist das neue Passwort aktiv)
    await user.save();

    // 7. Erfolgsmeldung zurückgeben
    res.json({ message: 'Passwort erfolgreich zurückgesetzt' });
  } catch (error) {
    // Fehlerbehandlung: Logge den Fehler und sende eine Fehlermeldung an den Client
    console.error('❌ Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Zurücksetzen des Passworts'
    });
  }
});

export default router;

// import express from 'express';
// import User from '../models/UserModel.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// const router = express.Router();

// // Route für Password-Reset (mit Token)
// // router.post('/reset-password/:token', async (req, res) => {
// //   try {
// //     const { token } = req.params;
// //     const { newPassword, confirmPassword } = req.body;
    
// //     console.log('🔄 Password reset attempt:', { email, resetCode: resetCode?.substring(0, 6) + '...', newPasswordLength: newPassword?.length });
    
// //     // User finden und Code überprüfen
// //     const user = await User.findOne({ 
// //       email, 
// //       resetCode,
// //       resetCodeExpires: { $gt: Date.now() } // Code noch gültig
// //     });
    
// //     if (!user) {
// //       console.log('❌ User not found or code invalid:', { email, resetCode });
// //       return res.status(400).json({ message: 'Ungültiger oder abgelaufener Code' });
// //     }

// //     console.log('✅ User found, resetting password for:', user.nickname);
// //     console.log('🔍 Current password hash length:', user.password?.length);
// //     console.log('🔍 New password length:', newPassword?.length);

// //     // Neues Passwort hashen und speichern
// //     const hashedPassword = await bcrypt.hash(newPassword, 10);
// //     console.log('🔐 New hashed password length:', hashedPassword?.length);
    
// //     // Das Middleware erkennt jetzt, dass das Passwort bereits gehasht ist
// //     user.password = hashedPassword;
// //     user.resetCode = null;
// //     user.resetCodeExpires = null;
    
// //     const savedUser = await user.save();
// //     console.log('💾 User saved, final password hash length:', savedUser.password?.length);

// //     console.log('✅ Password successfully updated in database for:', user.nickname);

// //     res.json({ 
// //       message: 'Passwort erfolgreich zurückgesetzt'
// //     });

// //   } catch (error) {
// //     console.error('❌ Password reset error:', error);
// //     res.status(500).json({ 
// //       success: false, 
// //       message: 'Serverfehler beim Zurücksetzen des Passworts' 
// //     });
// //   }
// // });

// // Route für Password-Reset (ohne Token in der URL, sondern mit Daten im Body)
// router.post('/reset-password', async (req, res) => {
//   try {
//     // const { email, resetCode, newPassword } = req.body;
//      const { email, resetCode, resetPasswordToken, newPassword } = req.body;

    

//     // // User finden und Code überprüfen
//      let user = null;
//     // const user = await User.findOne({
//     //   email,
//     //   resetCode,
//     //   resetCodeExpires: { $gt: Date.now() }
//     // });

//   if (resetCode) {
//   user = await User.findOne({
//     email,
//     resetCode,
//     resetCodeExpires: { $gt: Date.now() }
//     });
//   }


//     // Prüfe alternativ auf Token
//     if (!user && resetPasswordToken) {
//       user = await User.findOne({
//         email,
//         resetPasswordToken,
//         resetPasswordExpires: { $gt: Date.now() }
//   });
// }

//     if (!user) {
//       return res.status(400).json({ message: 'Ungültiger oder abgelaufener Code' });
//     }

//     // Neues Passwort hashen und speichern
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     user.resetCode = null;
//     user.resetCodeExpires = null;
//     user.resetPasswordToken = null;
//     user.resetPasswordExpires = null;

//     // Trick: Middleware überspringen, weil Passwort schon gehasht ist
//     user.markModified('password');

//     await user.save();

//     res.json({ message: 'Passwort erfolgreich zurückgesetzt' });
//   } catch (error) {
//     console.error('❌ Password reset error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Serverfehler beim Zurücksetzen des Passworts'
//     });
//   }
// });

// export default router;