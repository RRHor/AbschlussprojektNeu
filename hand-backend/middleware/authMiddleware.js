import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js'; // Passe ggf. den Pfad/Dateinamen an

/**
 * Middleware zum Schutz von Routen (JWT-Authentifizierung)
 * - Prüft Token aus Cookie oder Authorization-Header
 * - Lädt den User aus der Datenbank und hängt ihn an req.user an
 */
export async function protect(req, res, next) {
    // Debug-Logging für Cookies und Authorization-Header
    console.log('Cookies:', req.cookies);
    console.log('Authorization Header:', req.headers.authorization);

    let token = null;

    // Token aus Cookie lesen (falls vorhanden)
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // Oder Token aus Authorization-Header lesen (falls vorhanden)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Wenn kein Token gefunden wurde, Zugriff verweigern
    if (!token) {
        return res.status(401).json({ message: 'Nicht autorisiert, Token fehlt' });
    }

    try {
        // Token verifizieren
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // User anhand der ID aus dem Token laden (ohne Passwort)
        req.user = await User.findById(decoded.id).select('-password');

        // Weiter zur nächsten Middleware/Route
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token ungültig' });
    }
}