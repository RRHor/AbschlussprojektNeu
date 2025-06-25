import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Optionale Adress-Validierung mit Google Maps API
 * Funktioniert nur, wenn GOOGLE_MAPS_API_KEY in .env gesetzt ist
 */
const validateAddress = async (adress) => {
    // Wenn kein API Key vorhanden, Validierung überspringen
    if (!process.env.GOOGLE_MAPS_API_KEY) {
        console.log('Google Maps API Key nicht gefunden - Adress-Validierung übersprungen');
        return true; // Als gültig betrachten
    }

    try {
        // Dynamischer Import von node-fetch (falls installiert)
        const fetch = await import('node-fetch').then(module => module.default);
        
        const { street, city, state, zip } = adress;
        const addressString = `${street}, ${city}, ${state} ${zip}`;
        const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressString)}&key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK' || data.results.length === 0) {
            return false; // Adresse ist ungültig
        }
        return true;
    } catch (error) {
        // Bei Fehlern (z.B. node-fetch nicht installiert), Validierung überspringen
        console.log('Adress-Validierung übersprungen:', error.message);
        return true; // Als gültig betrachten
    }
};

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

        // **OPTIONALE** Adress-Validierung
        const isValidAddress = await validateAddress(adress);
        if (!isValidAddress) {
            return res.status(400).json({ 
                message: 'Die eingegebene Adresse konnte nicht gefunden werden. Bitte überprüfen Sie Ihre Eingabe.',
                hint: 'Falls Sie sicher sind, dass die Adresse korrekt ist, kontaktieren Sie den Support.'
            });
        }

        // Prüfen, ob schon ein Admin existiert (erster User wird Admin)
        const adminExists = await User.findOne({ isAdmin: true });

        // Verifizierungscode generieren (6-stellig, als String)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Neuen User anlegen
        const { firstName, lastName, street, city, state, zip } = adress;
        const newUser = new User({
            nickname,
            email,
            password,
            firstName,
            lastName,
            adress: { street, city, state, zip },
            isVerify: false,
            verificationCode,
            isAdmin: !adminExists,
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
      // Konsistente Fehlermeldung (Security Best Practice)
      return res.status(401).json({ message: "Ungültige E-Mail oder Passwort" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // Gleiche Fehlermeldung wie oben
      return res.status(401).json({ message: "Ungültige E-Mail oder Passwort" });
    }

    // Token-Gültigkeit je nach rememberMe (dein Feature beibehalten)
    const expiresIn = rememberMe ? "30d" : "1d";
    
    // Mehr Infos im Token (Brians Ansatz)
    const token = jwt.sign(
      { 
        id: user._id,           // Für Kompatibilität mit deinem Middleware
        _id: user._id,          // Zusätzlich für Brians Stil
        nickname: user.nickname // Nützlich für Frontend
      }, 
      process.env.JWT_SECRET, 
      { expiresIn }
    );

    // Cookie-Lebensdauer anpassen (dein Feature)
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    // Cookie setzen (verbesserte Konfiguration)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Dein dynamischer Ansatz
      sameSite: 'strict',
      maxAge
    });

    res.json({
      message: "Login erfolgreich", // Brians konsistente Response
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
    console.error('Login error:', error); // Besseres Error Logging
    res.status(500).json({ message: "Serverfehler" });
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

