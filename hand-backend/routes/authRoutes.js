import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Optionale Adress-Validierung mit Google Maps API
 * Funktioniert nur, wenn GOOGLE_MAPS_API_KEY in .env gesetzt ist
 * Prüft alle Adressen im Array!
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
        const { nickname, email, password, addresses } = req.body;
        console.log("Register-Request erhalten", req.body);

        // Prüfen, ob Nickname oder E-Mail schon vergeben sind
        const existingUser = await User.findOne({ $or: [{ email }, { nickname }] });
        if (existingUser) {
            return res.status(400).json({ message: 'E-Mail oder Nickname bereits vergeben' });
        }

        // Adress-Validierung für alle Adressen im Array - temporär deaktiviert
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
        });
        await newUser.save();
        console.log('👤 User gespeichert, versuche E-Mail zu senden...');

        // Verifizierungs-E-Mail senden - temporär deaktiviert für Testing
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
        console.error('🔥 REGISTER ERROR:', error);
        console.error('🔥 ERROR STACK:', error.stack);
        res.status(500).json({ message: 'Serverfehler' });
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

        const expiresIn = rememberMe ? "30d" : "1d";
        const token = jwt.sign(
            {
                id: user._id,
                nickname: user.nickname
            },
            process.env.JWT_SECRET,
            { expiresIn }
        );

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
                addresses: user.addresses,
                isAdmin: user.isAdmin,
                isVerify: user.isVerify,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Serverfehler" });
    }
});

/**
 * Eigene Userdaten abrufen (geschützt)
 */
router.get("/users/me", protect, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
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
 * Verifizierungscode prüfen
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
        res.status(500).json({ message: "Verifizierung fehlgeschlagen", error: error.message });
    }
});

/**
 * Passwort zurücksetzen (alternative Route für Team-Konsistenz)
 */
router.post("/reset-password", async (req, res) => {
    try {
        const { email, resetCode, newPassword } = req.body;
        
        // User finden und Code überprüfen
        const user = await User.findOne({ 
            email, 
            resetCode,
            resetCodeExpires: { $gt: Date.now() } // Code noch gültig
        });
        
        if (!user) {
            return res.status(400).json({ message: 'Ungültiger oder abgelaufener Code' });
        }

        // Neues Passwort setzen (wird automatisch gehashed durch das User-Schema)
        user.password = newPassword;
        user.resetCode = null;
        user.resetCodeExpires = null;
        await user.save();

        res.json({ 
            message: 'Passwort erfolgreich zurückgesetzt'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Serverfehler beim Passwort zurücksetzen' });
    }
});

export default router;