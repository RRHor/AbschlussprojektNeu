import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';

export async function protect(req, res, next) {
    try {
        console.log('🔐 Auth middleware called');
        console.log('📋 Headers:', req.headers.authorization ? 'Authorization header present' : 'NO AUTH HEADER');
        
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('🎫 Token extracted:', token ? 'Token present' : 'Token missing');
        }

        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({
                success: false,
                message: 'Nicht autorisiert - Kein Token'
            });
        }

        // Token verifizieren und User laden
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token decoded, User ID:', decoded.id);

        req.user = await User.findById(decoded.id).select('-password');
        console.log('👤 User found:', req.user ? req.user.username : 'User not found');

        if (!req.user) {
            console.log('❌ User not found in database');
            return res.status(401).json({
                success: false,
                message: 'Nicht autorisiert - User nicht gefunden'
            });
        }

        next();
    } catch (error) {
        console.error('❌ Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Nicht autorisiert - Token ungültig'
        });
    }
}