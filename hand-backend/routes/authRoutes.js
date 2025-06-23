import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import { protect } from "../middleware/authMiddleware.js"; // Middleware für geschützte Routen

const router = express.Router();

/**
 * Registrierung eines neuen Users
 * - Prüft, ob Nickname oder E-Mail bereits vergeben sind
 * - Generiert einen Verifizierungscode
 * - Setzt den ersten User als Admin
 * - Sendet eine Verifizierungs-E-Mail
 */
router.post('/register', async (req, res) => {
    try {
        const { nickname, email, password, adress } = req.body;

        // Prüfen, ob Nickname oder E-Mail schon vergeben sind
        const existingUser = await User.findOne({ $or: [{ email }, { nickname }] });
        if (existingUser) {
            return res.status(400).json({ message: 'E-Mail oder Nickname bereits vergeben' });
        }

        // Prüfen, ob schon ein Admin existiert (erster User wird Admin)
        const adminExists = await User.findOne({ isAdmin: true });

        // Verifizierungscode generieren (6-stellig, als String)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Neuen User anlegen
        const newUser = new User({
            nickname,
            email,
            password,
            adress,
            isVerify: false, // User ist anfangs nicht verifiziert
            verificationCode,
            isAdmin: !adminExists, // Erster User wird Admin
        });
        await newUser.save();

        // Verifizierungs-E-Mail senden
        await sendVerificationEmail(newUser.email, newUser.verificationCode, newUser._id);

        // Erfolgreiche Registrierung
        res.status(201).json({
            message: 'User erfolgreich erstellt',
            _id: newUser._id,
            nickname: newUser.nickname,
            email: newUser.email,
            adress: newUser.adress,
            isAdmin: newUser.isAdmin,
            isVerify: newUser.isVerify
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Serverfehler' });
    }
});

/**
 * Login eines Users
 * - Authentifiziert mit Nickname und Passwort
 * - Gibt bei Erfolg ein JWT-Token als httpOnly-Cookie zurück
 */
router.post('/login', async (req, res) => {
    try {
        const { nickname, password } = req.body;

        // User anhand des Nicknames suchen
        const user = await User.findOne({ nickname });
        if (!user ){ 
            return res.status(404).json({ message: 'User nicht gefunden' });
        }

        // Passwort prüfen
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
        }

        // JWT-Token erstellen
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        // Token als httpOnly-Cookie setzen
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // in Produktion nur über HTTPS
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 Tage
        });

        // Erfolgreiche Anmeldung, Userdaten und Token zurückgeben
        res.json({
            message: 'Login erfolgreich',
            token,
            _id: user._id,
            nickname: user.nickname,
            email: user.email,
            adress: user.adress,
            isAdmin: user.isAdmin,
            isActive: user.isActive, // Stelle sicher, dass dieses Feld im Model existiert
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Serverfehler' });
    }
});

/**
 * Eigene Userdaten abrufen (geschützt)
 * - Gibt die im Token gespeicherten Userdaten zurück
 */
router.get("/users/me", protect, async (req, res) => {
  res.json(req.user);
});

/**
 * Userdaten aktualisieren (geschützt)
 * - Aktualisiert die Daten des Users mit der angegebenen ID
 */
router.put("/users/:id", protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Aktualisierung fehlgeschlagen", error: error.message });
  }
});

/**
 * Verifizierungscode prüfen
 * - Setzt isVerify auf true, wenn der Code korrekt ist
 */
router.post("/verify", async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email, verificationCode: code });

    if (!user) {
      return res.status(400).json({ message: "Ungültiger Code oder E-Mail" });
    }

    user.isVerify = true;
    user.verificationCode = null;
    await user.save();

    res.json({ message: "E-Mail erfolgreich verifiziert" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Verifizierung fehlgeschlagen", error: error.message });
  }
});

export default router;

