import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

export const protect = async (req, res, next) => {
  try {
    console.log('🔐 Auth middleware called');
    
    let token;

    // Token aus Authorization Header extrahieren
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      console.log('📋 Headers: Authorization header present');
      
      token = req.headers.authorization.split(' ')[1];
      console.log('🎫 Token extracted: Token present');
      
      // DEBUG: Zeige Token-Format (ohne den kompletten Token aus Sicherheitsgründen)
      console.log('🔍 Token length:', token?.length);
      console.log('🔍 Token starts with:', token?.substring(0, 20) + '...');
      
      // Prüfe Token-Format
      if (!token || token === 'null' || token === 'undefined') {
        console.log('❌ Token ist null/undefined/string-null');
        return res.status(401).json({ 
          success: false,
          message: 'Kein gültiger Token gefunden' 
        });
      }

      // Prüfe ob Token das richtige Format hat (3 Teile getrennt durch Punkte)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.log('❌ Token hat falsches Format. Teile:', tokenParts.length);
        return res.status(401).json({ 
          success: false,
          message: 'Token hat ungültiges Format' 
        });
      }

    } else if (req.cookies.token) {
      // Fallback: Token aus Cookie
      token = req.cookies.token;
      console.log('🍪 Token aus Cookie extrahiert');
    }

    if (!token) {
      console.log('❌ Kein Token gefunden');
      return res.status(401).json({ 
        success: false,
        message: 'Nicht autorisiert, kein Token' 
      });
    }

    try {
      // Token verifizieren
      console.log('🔍 Verifiziere Token...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token decoded, User ID:', decoded.id || decoded._id);

      // User aus Database laden
      const user = await User.findById(decoded.id || decoded._id).select('-password');
      
      if (!user) {
        console.log('❌ User nicht gefunden für ID:', decoded.id || decoded._id);
        return res.status(401).json({ 
          success: false,
          message: 'Token gültig, aber User nicht gefunden' 
        });
      }

      console.log('👤 User found:', user.nickname || user.username);
      
      // User zu Request hinzufügen
      req.user = user;
      next();

    } catch (jwtError) {
      console.log('❌ JWT Verification Error:', jwtError.message);
      console.log('🔍 JWT Error type:', jwtError.name);
      
      // Spezifische Fehlermeldungen
      let errorMessage = 'Token ungültig';
      
      if (jwtError.name === 'TokenExpiredError') {
        errorMessage = 'Token ist abgelaufen';
      } else if (jwtError.name === 'JsonWebTokenError') {
        errorMessage = 'Token ist fehlerhaft formatiert';
      } else if (jwtError.name === 'NotBeforeError') {
        errorMessage = 'Token ist noch nicht gültig';
      }

      return res.status(401).json({ 
        success: false,
        message: errorMessage 
      });
    }

  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server-Fehler bei Authentifizierung' 
    });
  }
};