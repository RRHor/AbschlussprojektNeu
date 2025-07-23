import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

export async function protect(req, res, next) {
  let token;
  // Debug: Alle Cookies loggen
  console.log('🍪 [Auth-Middleware] Cookies:', req.cookies);
  // 1. Token aus Header oder Cookie extrahieren
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Nicht autorisiert - Kein Token'
    });
  }

  try {
    // 2. Token verifizieren
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Nicht autorisiert - User nicht gefunden'
      });
    }

    next();
  } catch (error) {
    // console.error('❌ Auth middleware error:', error);
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Auth middleware error:', error.message);
    }
    res.status(401).json({
      success: false,
      message: 'Nicht autorisiert - Token ungültig'
    });
  }
}

export default protect;