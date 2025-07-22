import express from "express";
import jwt from "jsonwebtoken";
import User from '../models/UserModel.js';
import Event from "../models/eventModel.js"; // ← DIESE ZEILE HINZUFÜGEN
import { sendVerificationEmail } from "../utils/emailService.js";
// import sendVerificationEmail from "../utils/sendVerificationEmail.js";
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

    const {
      nickname,
      username,
      email,
      password,
      // Wegen Datenschutz nicht hier
      // firstName,
      // lastName,
      addresses // Array!
    } = req.body;


    // Prüfen, ob Nickname oder E-Mail schon vergeben sind
    const existingUser = await User.findOne({ 
      $or: [{ email }, 
      ...(nickname ? [{nickname}] : []),
      ...(username ? [{username}] : [])
    ]
  });
    if (existingUser) {
      return res.status(400).json({ message: 'E-Mail oder Nickname bereits vergeben' });
    }

    
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const adminExists = await User.findOne({ isAdmin: true });


    // ODER-Logik für username/nickname:
    // Es wird nur das Feld gespeichert, das im Request-Body vorhanden ist.
    // So wird entweder "nickname" ODER "username" in der Datenbank angelegt – nie beide gleichzeitig.
    // Das sorgt für ein sauberes, flexibles Datenmodell und verhindert doppelte oder unerwünschte Felder.
    // Diese Lösung ist besonders nützlich, wenn im Team unterschiedliche User-Modelle verwendet werden.
    const userData = {
      // username: nickname, // für UserModel
      // nickname,
      email,
      password,
      // firstName,
      // lastName,
      addresses,
      isVerified: false, // für UserModel
      isVerify: false,   // für userSchema
      verificationCode,  // für userSchema
      verificationToken: verificationCode, // für UserModel
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // für UserModel
      isAdmin: !adminExists,
      registeredAt: new Date()
    };

    // Nur das Feld speichern, das im Body steht:
    if (nickname) userData.nickname = nickname;
    if (username) userData.username = username;

    // Rückbau: Nur das Verifizierungsfeld setzen, das im Modell existiert
    if (User.schema.path('isVerify')) {
      userData.isVerify = false;
      // Rückbau: Kein isVerified mehr setzen
    } else if (User.schema.path('isVerified')) {
      userData.isVerified = false;
      // Rückbau: Kein isVerify mehr setzen
    }

    const newUser = new User(userData);

    await newUser.save();
    console.log('👤 User gespeichert, versuche E-Mail zu senden...');

    // Verifizierungs-E-Mail senden
    try {
      console.log('📧 Rufe sendVerificationEmail auf...');
      // ODER-Lösung für Verifizierungscode: user.verificationCode (userSchema) ODER user.verificationToken (UserModel)
      await sendVerificationEmail(
        newUser.email,
        newUser.verificationCode || newUser.verificationToken, // nimmt den Wert, der existiert
        newUser._id
      );
      console.log('✅ E-Mail erfolgreich gesendet');
    } catch (emailError) {
      console.error('❌ E-Mail-Versand fehlgeschlagen:', emailError.message);
    }

    // Rückgabe: Nur die wichtigsten Felder
    res.status(201).json({
      message: 'User erfolgreich erstellt',
      _id: newUser._id,
      nickname: newUser.nickname,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      isVerified: newUser.isVerified !== undefined ? newUser.isVerified : undefined,
      isVerify: newUser.isVerify !== undefined ? newUser.isVerify : undefined,
      verificationCode: newUser.verificationCode || newUser.verificationToken
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
    // Login mit email, nickname oder username und Passwort
    const { email, nickname, username, password, rememberMe } = req.body;

    const user = await User.findOne({
      $or: [
        email ? { email } : null,
        nickname ? { nickname } : null,
        username ? { username } : null
      ].filter(Boolean)
    });

    if (!user) {
      return res.status(401).json({ message: "Ungültige E-Mail/Nickname/Username oder Passwort" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Ungültige E-Mail/Nickname/Username oder Passwort" });
    }

    if (!(user.isVerified || user.isVerify)) {
      return res.status(401).json({ 
        message: "Bitte verifizieren Sie zuerst Ihre E-Mail-Adresse",
        requiresVerification: true,
        email: user.email
      });
    }

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

    // Token als Cookie setzen
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 30 Tage oder 1 Tag
    });

    res.json({
      message: "Login erfolgreich",
      token,
      user: {
        _id: user._id,
        nickname: user.nickname,
        username: user.username,
        email: user.email,
        addresses: user.addresses,
        isVerified: user.isVerified || user.isVerify,
        registeredAt: user.registeredAt
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

    // Kompatibilität: Setze beide Felder, damit Frontend und verschiedene Modelle funktionieren
    user.isVerified = true;
    user.isVerify = true;
    // ODER-Logik: Setze nur das Verifizierungsfeld, das im jeweiligen Schema existiert
    // So steht in MongoDB immer nur isVerify ODER isVerified – nie beide!
    if (user.schema.path('isVerify')) {
      user.isVerify = true;
    }
    if (user.schema.path('isVerified')) {
      user.isVerified = true;
    }
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
 * POST /api/auth/verify
 * Vergleicht den Code aus dem Body mit dem in der Datenbank und setzt isVerified auf true, wenn alles passt.
 * WICHTIG: Die Verifizierung darf NUR im Backend passieren, damit der Code sicher bleibt und nicht im E-Mail-Service manipuliert werden kann.
 * Der E-Mail-Service verschickt nur den Code/Link, die eigentliche Prüfung und das Setzen von isVerified gehören IMMER in diese Route!
 */
router.post('/verify', async (req, res) => {
  const { email, code } = req.body;
  try {
    // Suche nach User mit passender E-Mail und passendem Code
    const user = await User.findOne({
      email,
      verificationCode: code.toString()
    });
    if (!user) {
      return res.status(400).json({ message: 'Ungültiger Code oder E-Mail' });
    }
    // Optional: Prüfe, ob der Code abgelaufen ist
    if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ message: 'Code ist abgelaufen' });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: 'E-Mail bereits verifiziert' });
    }
    // Setze isVerified auf true und lösche den Code
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

/**
 * Eigene Userdaten abrufen (geschützt)
 */
router.get("/users/me", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        console.log('👤 COMPLETE USER from DB:', JSON.stringify(user, null, 2));
        console.log('🏠 ADDRESS from DB:', user?.addresses?.[0]);
        console.log('🔍 ZIP from DB:', user?.addresses?.[0]?.zip);
        
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
        // Passwort beim Update hashen, falls vorhanden
        if (req.body.password) {
            const bcrypt = await import('bcryptjs').then(m => m.default);
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
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
        // Passwort beim Update hashen, falls vorhanden
        if (req.body.password) {
            const bcrypt = await import('bcryptjs').then(m => m.default);
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
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
