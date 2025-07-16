
import express from 'express';
import User from '../models/UserModel.js';

const router = express.Router();

/**
 * POST /verify
 * Verifiziert einen User anhand von E-Mail und Code
 */
router.post('/verify', async (req, res) => {
  const { email, code } = req.body;

  try {
    // User anhand E-Mail und Code suchen
    const user = await User.findOne({
      email,
      verificationCode: Number(code)
    });

    if (!user) {
      return res.status(400).json({ message: 'Ungültiger Code oder E-Mail' });
    }

    // Prüfe, ob der Code abgelaufen ist
    if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ message: 'Code ist abgelaufen' });
    }

    // Prüfe, ob schon verifiziert
    if (user.isVerified) {
      return res.status(400).json({ message: 'E-Mail bereits verifiziert' });
    }

    // Verifizierung durchführen
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    res.json({ message: 'E-Mail erfolgreich verifiziert!' });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
});

export default router;



// // verifyRoutes.js
// // Enthält alle Routen zur E-Mail-Verifizierung von Usern zum Backend

// import express from 'express';
// import jwt from 'jsonwebtoken';
// import User from '../models/UserModel.js';

// const router = express.Router();

// /**
//  * POST /verify
//  * Verifiziert einen User anhand des Codes
//  */
// router.post('/verify', async (req, res) => {
//   const { email, code } = req.body;
  
//   try {
//     const user = await User.findOne({ 
//       email, 
//       verificationCode: code.toString() 
//     });

//     if (!user) {
//       return res.status(400).json({ message: 'Ungültiger Code oder E-Mail' });
//     }

//     // Prüfe Code-Ablauf (falls implementiert)
//     if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
//       return res.status(400).json({ message: 'Code ist abgelaufen' });
//     }

//     if (user.isVerified) {
//       return res.status(400).json({ message: 'E-Mail bereits verifiziert' });
//     }

//     // Verifizierung durchführen
//     user.isVerified = true;
//     user.verificationCode = null;
//     user.verificationCodeExpires = null;
//     await user.save();

//     res.json({ message: 'E-Mail erfolgreich verifiziert!' });
//   } catch (error) {
//     console.error('Verify error:', error);
//     res.status(500).json({ message: 'Serverfehler', error: error.message });
//   }
// });

// /**
//  * GET /verify-link
//  * Wird vom Link in der E-Mail aufgerufen
//  */
// router.get('/verify-link', async (req, res) => {
//   const { code, userId } = req.query;
//   const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
//   try {
//     const user = await User.findOne({ 
//       _id: userId, 
//       verificationCode: code 
//     });

//     if (!user) {
//       return res.redirect(`${frontendUrl}/verify?status=error&message=invalid_code`);
//     }

//     // Prüfe Code-Ablauf
//     if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
//       return res.redirect(`${frontendUrl}/verify?status=error&message=expired`);
//     }

//     if (!user.isVerified) {
//       user.isVerified = true;
//       user.verificationCode = null;
//       user.verificationCodeExpires = null;
//       await user.save();
//     }

//     return res.redirect(`${frontendUrl}/login?verified=true`);
//   } catch (error) {
//     console.error('Verify link error:', error);
//     return res.redirect(`${frontendUrl}/verify?status=error&message=server_error`);
//   }
// });

// /**
//  * GET /verify/:token
//  * Verifiziert einen User anhand des Tokens
//  */
// // router.get('/verify/:token', async (req, res) => {
// //   try {
// //     console.log('🔍 Verifizierung gestartet für Token:', req.params.token);
    
// //     const { token } = req.params;

// //     // User finden mit gültigem Token
// //     const user = await User.findOne({
// //       verificationToken: token,
// //       verificationTokenExpires: { $gt: Date.now() }
// //     });

// //     if (!user) {
// //       console.log('❌ Ungültiger oder abgelaufener Token');
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Ungültiger oder abgelaufener Verifizierungstoken',
// //         code: 'INVALID_TOKEN'
// //       });
// //     }

// //     console.log('👤 User gefunden:', user.email);

// //     // Prüfe ob es die erste Verifizierung ist
// //     const isNewUser = !user.isVerified;
// //     const wasAlreadyVerified = user.isVerified;

// //     console.log('🆕 Ist neuer User:', isNewUser);
// //     console.log('✅ War bereits verifiziert:', wasAlreadyVerified);

// //     // User verifizieren
// //     user.isVerified = true;
// //     user.verificationToken = undefined;
// //     user.verificationTokenExpires = undefined;
    
// //     // Setze firstVerifiedAt nur beim ersten Mal
// //     if (isNewUser) {
// //       user.firstVerifiedAt = new Date();
// //       console.log('📅 FirstVerifiedAt gesetzt:', user.firstVerifiedAt);
// //     }

// //     await user.save();
// //     console.log('💾 User gespeichert');

// //     // JWT Token für automatischen Login generieren
// //     const jwtToken = jwt.sign(
// //       { id: user._id },
// //       process.env.JWT_SECRET,
// //       { expiresIn: '30d' }
// //     );

// //     console.log('🎫 JWT Token generiert');

// //     // Response mit allen nötigen Infos
// //     res.json({
// //       success: true,
// //       message: isNewUser 
// //         ? 'E-Mail erfolgreich verifiziert! Bitte loggen Sie sich ein.' 
// //         : 'E-Mail erfolgreich verifiziert! Willkommen zurück!',
// //       isNewUser, // ← Wichtigste Info für Frontend-Routing
// //       wasAlreadyVerified,
// //       user: {
// //         id: user._id,
// //         username: user.username,
// //         nickname: user.nickname,
// //         email: user.email,
// //         isVerified: user.isVerified,
// //         firstVerifiedAt: user.firstVerifiedAt,
// //         registeredAt: user.registeredAt,
// //         // Profil-Vollständigkeit prüfen
// //         hasCompleteProfile: !!(user.firstName && user.lastName && user.address?.city)
// //       }
// //     });

// //     console.log('✅ Verifizierung erfolgreich abgeschlossen');

// //   } catch (error) {
// //     console.error('❌ Verifizierungsfehler:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Serverfehler bei der Verifizierung',
// //       code: 'SERVER_ERROR'
// //     });
// //   }
// // });

// /**
//  * POST /resend-verification
//  * Neuen Verifizierungstoken anfordern
//  */
// // router.post('/resend-verification', async (req, res) => {
// //   try {
// //     const { email } = req.body;

// //     if (!email) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'E-Mail-Adresse ist erforderlich'
// //       });
// //     }

// //     const user = await User.findOne({ email: email.toLowerCase() });

// //     if (!user) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Benutzer mit dieser E-Mail-Adresse nicht gefunden'
// //       });
// //     }

// //     if (user.isVerified) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Diese E-Mail-Adresse ist bereits verifiziert'
// //       });
// //     }

// //     // Neuen Verifizierungstoken generieren
// //     const verificationToken = jwt.sign(
// //       { userId: user._id },
// //       process.env.JWT_SECRET,
// //       { expiresIn: '24h' }
// //     );

// //     user.verificationToken = verificationToken;
// //     user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 Stunden

// //     await user.save();

// //     // TODO: E-Mail senden (falls du E-Mail-Service hast)
// //     // await sendVerificationEmail(user.email, verificationToken);

// //     res.json({
// //       success: true,
// //       message: 'Neuer Verifizierungslink wurde an Ihre E-Mail-Adresse gesendet'
// //     });

// //   } catch (error) {
// //     console.error('❌ Fehler beim Neusenden:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Serverfehler beim Neusenden der Verifizierung'
// //     });
// //   }
// // });


// export default router;
