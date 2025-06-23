import express from 'express';
import jwt from 'jsonwebtoken';
// import User from '../models/UserModel.js';
import User from '../models/userSchema.js'; // Assuming you have a user schema defined
import { sendVerificationEmail } from '../utils/emailService.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        // Request body sollte die Felder nickname, email, password, adress, isVerify und verificationCode enthalten
        // Beispiel: { nickname: 'JohnDoe', email: '
        const { nickname, email, password, adress } = req.body;
        

        // const existingUser = await User.findOne({ email });
        // if (existingUser) {
        //     return res.status(400).json({ message: 'User bereits vorhanden' });
        // }

        // Prüfen, ob Nickname oder E-Mail schon vergeben sind
  const existingUser = await User.findOne({ $or: [{ email }, { nickname }] });
  if (existingUser) {
    return res.status(400).json({ message: 'E-Mail oder Nickname bereits vergeben' });
  }

         // Prüfen, ob schon ein Admin existiert
        const adminExists = await User.findOne({ isAdmin: true });

        // Verifizierungscode automatisch generieren
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        const newUser = new User({
            nickname,
            email,
            password,
            adress,
            // isVerify,
            verificationCode,
            isAdmin: !adminExists, // Setze isAdmin nur für den ersten User
        });
        await newUser.save();

        // Automatisch eine Verifizierungs-E-Mail senden
        await sendVerificationEmail(newUser.email, newUser.verificationCode, newUser._id);

        // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            message: 'User erfolgreich erstellt',
            // token,
            _id: newUser._id,
            nickname: newUser.nickname,
            email: newUser.email,
            adress: newUser.adress,
            isAdmin: newUser.isAdmin,
            isVerify: newUser.isVerify
            // isActive: newUser.isActive,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Serverfehler' });
    }
}
);

router.post('/login', async (req, res) => {
    try {
        const { nickname, password } = req.body;

        const user = await User.findOne({ nickname });
        if (!user ){ 
            return res.status(404).json({ message: 'User nicht gefunden' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

         // Token als httpOnly-Cookie setzen im Browser
         // Cookie für die Atuhentifizierung
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // in Produktion nur über HTTPS
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 Tage
        });

        // Erfolgreiche Anmeldung
        // Sendet die User-Daten und den Token als JSON-Antwort
        // Das JSON für die Rückmeldung an das Frontend
        res.json({
            message: 'Login erfolgreich',
            token,
            _id: user._id,
            nickname: user.nickname,
            email: user.email,
            adress: user.adress,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Serverfehler' });
    }});

//     router.post('/logout', (req, res) => {
//         res.json({ message: 'Logout erfolgreich' });
//     });

export default router; 