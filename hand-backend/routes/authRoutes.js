import express from "express";
import jwt from "jsonwebtoken";

import User from "../models/UserModel.js";
import Event from "../models/eventModel.js"; // ← DIESE ZEILE HINZUFÜGEN

import mongoose from "mongoose";
import { userSchema } from "../models/userSchema.js";

import { sendVerificationEmail } from "../utils/emailService.js";
import { protect } from "../middleware/authMiddleware.js";

// import User from "../models/UserModel.js"; // Auskommentiert, wir nutzen stattdessen userSchema.js
// importiertes UserModel.js bleibt erhalten, aber wird nicht verwendet
// const User = mongoose.models.User || mongoose.model("User", userSchema);

const router = express.Router();

/**
 * Optionale Adress-Validierung mit Google Maps API
 * Funktioniert nur, wenn GOOGLE_MAPS_API_KEY in .env gesetzt ist
 */
const validateAddress = async (address) => {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
        console.log('Google Maps API Key nicht gefunden - Adress-Validierung übersprungen');
        return true;
    }
    try {
        const fetch = await import('node-fetch').then(module => module.default);
        const { street, city, district, zipCode } = address;
        const addressString = `${street}, ${city}, ${district} ${zipCode}`;
        const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressString)}&key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.status !== 'OK' || data.results.length === 0) {
            return false;
        }
        return true;
    } catch (error) {
        console.log('Adress-Validierung übersprungen:', error.message);
        return true;
    }
};

/**
 * Registrierung eines neuen Users
 */
router.post('/register', async (req, res) => {
  try {

    const {
      nickname,
      email,
      password,
      firstName,
      lastName,
      addresses // Array!
    } = req.body;


    // Prüfen, ob Nickname oder E-Mail schon vergeben sind
    const existingUser = await User.findOne({ $or: [{ email }, { nickname }] });
    if (existingUser) {
      return res.status(400).json({ message: 'E-Mail oder Nickname bereits vergeben' });
    }

    // Optional: Adress-Validierung für alle Adressen im Array (deaktiviert)
    /*
    if (addresses && addresses.length > 0) {
      for (const addr of addresses) {
        const isValid = await validateAddress(addr);
        if (!isValid) {
          return res.status(400).json({
            message: 'Eine eingegebene Adresse konnte nicht gefunden werden. Bitte überprüfen Sie Ihre Eingabe.',
            hint: 'Falls Sie sicher sind, dass die Adresse korrekt ist, kontaktieren Sie den Support.'
          });
        }
      }
    }
    */


    // User erstellen
    const user = new User({
      username: nickname, // Username immer setzen, z.B. auf Nickname
      nickname: nickname,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      addresses: addresses,
      isVerified: false,
      verificationToken: verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
      registeredAt: new Date()
    });

    // Prüfen, ob schon ein Admin existiert (erster User wird Admin)
    const adminExists = await User.findOne({ isAdmin: true });


    // Verifizierungscode generieren (6-stellig, als String)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Neuen User anlegen
    const newUser = new User({
      nickname,
      email,
      password,
      addresses,
      isVerify: false,
      verificationCode,
      isAdmin: !adminExists,
      // registeredAt: new Date() // entfernt für Kompatibilität mit Abschluss_Rea_02
    });
    await newUser.save();
    console.log('👤 User gespeichert, versuche E-Mail zu senden...');

    // Verifizierungs-E-Mail senden
    try {
      console.log('📧 Rufe sendVerificationEmail auf...');
      await sendVerificationEmail(newUser.email, newUser.verificationCode, newUser._id);
      console.log('✅ E-Mail erfolgreich gesendet');
    } catch (emailError) {
      console.error('❌ E-Mail-Versand fehlgeschlagen:', emailError.message);
    }

    res.status(201).json({
      message: 'User erfolgreich erstellt',
      _id: newUser._id,
      nickname: newUser.nickname,
      email: newUser.email,
      addresses: newUser.addresses,
      isAdmin: newUser.isAdmin,
      isVerify: newUser.isVerify,
      verificationCode: newUser.verificationCode // Nur für Testing - in Produktion entfernen!
    });
  } catch (error) {
    console.error('Fehler bei Registrierung:', error);
    res.status(500).json({ message: 'Fehler bei der Registrierung', error: error.message });
  }
});

/**
 * Login eines Users
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

    // Prüfe E-Mail-Verifizierung (mindestens eins der Felder muss true sein)
    if (!(user.isVerified || user.isVerify)) {
      return res.status(401).json({ 
        message: "Bitte verifizieren Sie zuerst Ihre E-Mail-Adresse",
        requiresVerification: true,
        email: user.email
      });
    }

    // Token generieren
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

    res.json({
      message: "Login erfolgreich",
      token,
      user: {
        _id: user._id,
        nickname: user.nickname,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        addresses: user.addresses,
        isVerified: user.isVerified,
        registeredAt: user.registeredAt //HINZUFÜGEN
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Serverfehler" });
  }
});

/**
 * E-Mail-Verifizierung über Token-Link
 */
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    console.log('🔍 Verifizierung gestartet für Token:', token);

    // Token suchen und prüfen
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log('❌ Ungültiger oder abgelaufener Token');
      return res.status(400).json({
        success: false,
        message: 'Ungültiger oder abgelaufener Verifizierungstoken'
      });
    }

    console.log('👤 User gefunden:', user.email);

    // Prüfe ob es ein neuer User ist
    const isNewUser = !user.firstVerifiedAt;
    console.log('🆕 Ist neuer User:', isNewUser);
    console.log('✅ War bereits verifiziert:', user.isVerified);

    // User verifizieren
    if (!user.firstVerifiedAt) {
      user.firstVerifiedAt = new Date();
      console.log('📅 FirstVerifiedAt gesetzt:', user.firstVerifiedAt);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();
    console.log('💾 User gespeichert');

    // JWT Token für Login generieren
    const jwtToken = jwt.sign(
      { 
        id: user._id,
        _id: user._id,
        nickname: user.nickname
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('🎫 JWT Token generiert');

    console.log('✅ Verifizierung erfolgreich abgeschlossen');

    res.status(200).json({
      success: true,
      message: isNewUser 
        ? 'E-Mail erfolgreich verifiziert! Bitte loggen Sie sich ein.'
        : 'E-Mail erfolgreich bestätigt!',
      isNewUser,
      user: {
        id: user._id,
        nickname: user.nickname,
        email: user.email,
        isVerified: user.isVerified
      },
      token: jwtToken
    });

  } catch (error) {
    console.error('❌ Verifizierungsfehler:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler bei der Verifizierung'
    });
  }
});

/**
 * Eigene Userdaten abrufen (geschützt)
 */
router.get("/users/me", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        console.log('👤 COMPLETE USER from DB:', JSON.stringify(user, null, 2));
        console.log('🏠 ADDRESS from DB:', user?.address);
        console.log('🔍 ZIP from DB:', user?.address?.zip);
        
        if (!user) {
            return res.status(404).json({ message: "User nicht gefunden" });
        }
        res.json(user);
    } catch (error) {
        console.error('❌ Get user error:', error);
        res.status(500).json({ message: "Serverfehler", error: error.message });
    }
});

/**
 * Eigene Userdaten aktualisieren (geschützt)
 */
router.put("/users/me", protect, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, {
            new: true,
        }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User nicht gefunden" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Aktualisierung fehlgeschlagen", error: error.message });
    }
});

/**
 * Userdaten aktualisieren (geschützt)
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
        res.status(500).json({ message: "Aktualisierung fehlgeschlagen", error: error.message });
    }
});

/**
 * Alle User anzeigen (nur für Debug)
 */
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}).select('-password -verificationToken');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Laden der User", error: error.message });
    }
});

/**
 * Events des eingeloggten Users abrufen (geschützt)
 */
router.get("/users/me/events", protect, async (req, res) => {
  try {
    console.log('📥 GET /api/auth/users/me/events');
    console.log('👤 User ID:', req.user._id);

    // Finde alle Events, an denen der User teilnimmt
    const events = await Event.find({
      participants: req.user._id
    }).populate('organizer', 'nickname firstName lastName');

    console.log('📊 Found events:', events.length);
    
    res.json({
      success: true,
      events: events
    });
  } catch (error) {
    console.error('❌ Error fetching user events:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Laden der Events'
    });
  }
});

export default router;
