import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, adress } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User bereits vorhanden' });
        }

        const newUser = new User({
            name,
            email,
            password,
            adress
        });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            message: 'User erfolgreich erstellt',
            token,
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            adress: newUser.adress,
            isAdmin: newUser.isAdmin,
            isActive: newUser.isActive,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Serverfehler' });
    }
}
);

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user ){ 
            return res.status(404).json({ message: 'User nicht gefunden' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({
            message: 'Login erfolgreich',
            token,
            _id: user._id,
            name: user.name,
            email: user.email,
            adress: user.adress,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Serverfehler' });
    }});

export default router; 