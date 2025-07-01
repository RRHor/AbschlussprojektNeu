import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
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
    console.log('🔥 VOLLSTÄNDIGER REGISTER-REQUEST:', req.body);

    const {
      nickname,
      email,
      password,
      firstName,
      lastName,
      adress
    } = req.body;

    // Validierung...
    if (!nickname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nickname, E-Mail und Passwort sind erforderlich'
      });
    }

    // Prüfe ob User bereits existiert...
    const existingUser = await User.findOne({
      $or: [{ email }, { nickname }, { username: nickname }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'E-Mail oder Nickname bereits registriert'
      });
    }

    // Verifizierungstoken generieren
    const verificationToken = jwt.sign(
      { email, nickname },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('🎫 Verifizierungstoken generiert:', verificationToken);

    // User erstellen
    const user = new User({
      username: nickname,
      nickname: nickname,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      address: adress ? {
        street: adress.street,
        city: adress.city,
        postalCode: adress.zip?.toString(),
        district: adress.district,
        state: adress.state
      } : undefined,
      isVerified: false,
      verificationToken: verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
      registeredAt: new Date()
    });

    await user.save();
    console.log('💾 User gespeichert mit ID:', user._id);

    // E-MAIL VERSENDEN - AKTIV!
    console.log('📧 Starte E-Mail-Versand...');
    try {
      const emailResult = await sendVerificationEmail(email, verificationToken);
      console.log('📧 E-Mail-Service Ergebnis:', emailResult);
      
      if (emailResult.success) {
        console.log('✅ Verifizierungs-E-Mail erfolgreich "gesendet"');
      } else {
        console.log('⚠️ E-Mail-Versand fehlgeschlagen:', emailResult.message);
      }
    } catch (emailError) {
      console.error('❌ E-Mail-Service Fehler:', emailError);
    }
    console.log('📧 E-Mail-Versand-Prozess abgeschlossen');

    res.status(201).json({
      success: true,
      message: 'Registrierung erfolgreich! Prüfen Sie die Backend-Console für den Verifizierungslink.',
      verificationToken: verificationToken, // Nur für Development!
      user: {
        id: user._id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Fehler bei der Registrierung'
    });
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
      return res.status(401).json({ message: "Ungültige E-Mail oder Passwort" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Ungültige E-Mail oder Passwort" });
    }

    // NEU: Prüfe E-Mail-Verifizierung
    if (!user.isVerified) {
      return res.status(401).json({ 
        message: "Bitte verifizieren Sie zuerst Ihre E-Mail-Adresse",
        requiresVerification: true,
        email: user.email
      });
    }

    // Token generieren...
    const expiresIn = rememberMe ? "30d" : "1d";
    const token = jwt.sign(
      { 
        id: user._id,
        _id: user._id,
        nickname: user.nickname
      }, 
      process.env.JWT_SECRET, 
      { expiresIn }
    );

    // Rest bleibt gleich...
    res.json({
      message: "Login erfolgreich",
      token,
      user: {
        _id: user._id,
        nickname: user.nickname,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        isVerified: user.isVerified
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Serverfehler" });
  }
});

/**
 * Eigene Userdaten abrufen (geschützt)
 * - Gibt die im Token gespeicherten Userdaten zurück
 */
router.get("/users/me", protect, async (req, res) => {
  // Vollständige User-Daten zurückgeben
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

/**
 * Eigene Userdaten aktualisieren (geschützt)
 * - Aktualisiert die Daten des eingeloggten Users
 */
router.put("/users/me", protect, async (req, res) => {
  console.log("🔥 PUT /users/me ROUTE ERREICHT");
  console.log("🔍 req.user:", req.user ? req.user.nickname : 'NICHT VORHANDEN');
  console.log("🔍 Request Body:", req.body);
  
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-password");
    
    if (!user) {
      console.log("❌ User nicht gefunden bei Update");
      return res.status(404).json({ message: "User nicht gefunden" });
    }
    
    console.log("✅ User erfolgreich aktualisiert:", user.nickname);
    res.json(user);
  } catch (error) {
    console.error("❌ FEHLER in PUT /users/me:", error);
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

