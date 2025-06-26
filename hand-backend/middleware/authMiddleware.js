import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';

export async function protect(req, res, next) {
    console.log('🔥 AUTH MIDDLEWARE GESTARTET');
    console.log('🔍 Request URL:', req.method, req.originalUrl);
    console.log('🔍 Cookies:', req.cookies);
    console.log('🔍 Authorization Header:', req.headers.authorization);

    let token = null;

    // Token aus Cookie lesen
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
        console.log('✅ Token aus Cookie gefunden');
    }

    // Token aus Authorization-Header lesen
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('✅ Token aus Authorization Header gefunden');
    }

    console.log('🔍 Finaler Token:', token ? 'VORHANDEN' : 'NICHT VORHANDEN');

    if (!token) {
        console.log('❌ FEHLER: Kein Token gefunden');
        return res.status(401).json({ message: 'Nicht autorisiert, Token fehlt' });
    }

    try {
        console.log('🔍 Versuche Token zu verifizieren...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token erfolgreich dekodiert:', decoded);

        const userId = decoded.id || decoded._id;
        console.log('🔍 Suche User mit ID:', userId);
        
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            console.log('❌ FEHLER: User nicht gefunden für ID:', userId);
            return res.status(401).json({ message: 'User nicht gefunden' });
        }
        
        console.log('✅ User erfolgreich gefunden:', user.nickname);
        req.user = user;
        
        console.log('🚀 AUTH MIDDLEWARE ERFOLGREICH - Weiter zur Route');
        next();
    } catch (err) {
        console.log('❌ TOKEN-FEHLER:', err.message);
        console.log('❌ TOKEN-STACK:', err.stack);
        return res.status(401).json({ message: 'Token ungültig', error: err.message });
    }
}