import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import Event from "../models/eventModel.js"; // ← DIESE ZEILE HINZUFÜGEN
import { sendVerificationEmail } from "../utils/emailService.js";
import { protect } from "../middleware/authMiddleware.js";

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
    console.log('🔥 VOLLSTÄNDIGER REGISTER-REQUEST:', JSON.stringify(req.body, null, 2));
    console.log('📋 Adress-Daten vom Frontend:', req.body.adress);
    console.log('🔍 ZIP specifically:', req.body.adress?.zip);

    const {
      nickname,
      email,
      password,
      firstName,
      lastName,
      adress
    } = req.body;

    // Validierung
    if (!nickname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nickname, E-Mail und Passwort sind erforderlich'
      });
    }

    // Prüfe ob User bereits existiert
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
        zip: adress.zip?.toString(),        // ← KORRIGIERT: zip statt postalCode
        district: adress.district,
        state: adress.state
      } : undefined,
      isVerified: false,
      verificationToken: verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
      registeredAt: new Date()
    });

    console.log('🏠 Address data being saved:', user.address);
    console.log('🔍 ZIP specifically:', user.address?.zip);

    await user.save();
    console.log('💾 User gespeichert mit ID:', user._id);

    // Sofort User aus DB laden:
    const savedUser = await User.findById(user._id);
    console.log('🔍 User aus DB nach Speichern:', savedUser.address);

    // E-MAIL VERSENDEN
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

    // Prüfe E-Mail-Verifizierung
    if (!user.isVerified) {
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

