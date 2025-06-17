import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

const authMiddleware = async (req, res, next) => {
    let token = null;

    // Token aus Cookie lesen (optional)
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // Oder aus dem Authorization-Header lesen
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Nicht autorisiert, Token fehlt' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token ungültig' });
    }
};

export default authMiddleware;