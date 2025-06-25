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

        console.log("Register-Request erhalten", req.body);

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
            adress: [adress], // Als Array speichern (wie in deiner ursprünglichen Version)
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
 * - Authentifiziert mit E-Mail und Passwort (wie in deiner Version)
 * - Unterstützt rememberMe-Funktion
 * - Gibt bei Erfolg ein JWT-Token als httpOnly-Cookie zurück
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User nicht gefunden" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Ungültige E-Mail oder Passwort" });
    }

    // Token-Gültigkeit je nach rememberMe
    const expiresIn = rememberMe ? "30d" : "1d";
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn,
    });

    // Cookie-Lebensdauer anpassen
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge
    });

    res.json({
      message: "Login erfolgreich",
      token,
      user: {
        _id: user._id,
        nickname: user.nickname,
        email: user.email,
        adress: user.adress,
        isAdmin: user.isAdmin,
        isVerify: user.isVerify,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login fehlgeschlagen", error: error.message });
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
 * Eigene Userdaten aktualisieren (geschützt)
 * - Aktualisiert die Daten des eingeloggten Users
 */
router.put("/users/me", protect, async (req, res) => {
  console.log("PUT /users/me aufgerufen", req.body);
  console.log("User aus Token:", req.user);
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }
    res.json(user);
  } catch (error) {
    console.error("FEHLER in PUT /users/me:", error);
    res.status(500).json({ message: "Aktualisierung fehlgeschlagen", error: error.message });
  }
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

