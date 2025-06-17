import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Registrierung
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, adress } = req.body;

    // Prüfe, ob User existiert
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "E-Mail bereits vergeben" });
    }

    // Verifizierungscode generieren (z.B. 6-stellige Zahl)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // User anlegen
    const newUser = new User({
      name,
      email,
      password,
      adress,
      verificationCode, // <-- hier wird der Code gesetzt!
    });

    await newUser.save();

    // Verifizierungs-E-Mail senden
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: "User erfolgreich registriert", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Registrierung fehlgeschlagen", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "User nicht gefunden" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Ungültige E-Mail oder Passwort" });
    }

    // if (!user.isVerify) {
    //   return res
    //     .status(401)
    //     .json({ message: "Bitte verifiziere zuerst deine E-Mail." });
    // }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

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
    res
      .status(500)
      .json({ message: "Login fehlgeschlagen", error: error.message });
  }
});

// Eigene Userdaten abrufen
router.get("/users/me", authMiddleware, async (req, res) => {
  res.json(req.user);
});

// Userdaten aktualisieren
router.put("/users/:id", authMiddleware, async (req, res) => {
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

// Verifizierungscode prüfen
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
