
import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js'; // Assuming you have a user schema defined

export const protect = async (req, res, next) => {

    // Logging für Debugging
    console.log(('Cookies:', req.cookies));
    console.log(('Authorization Header:', req.headers.authorization));

    let token = null;

    // 1. Token aus Cookie lesen (wenn vorhanden)
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }


    // 2. Order aus dem Authorization-Header lesen (wenn vorhanden)
    // Authorization-Header: Bearer <token
    else if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return res.status(401).json({ message: 'Nicht autorisiert, Token fehlt' });
    }
    try {
        // Debugging: Ausgabe des Tokens und des JWT_SECRET
        // console.log(('JWT_SECRET:', process.env.JWT_SECRET));
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();

    }
    catch (err) {
        return res.status(401).json({ message: 'Token ungültig' });
    }
}