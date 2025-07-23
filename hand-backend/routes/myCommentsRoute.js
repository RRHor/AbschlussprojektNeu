import express from "express";
import BlogComment from "../models/blogCommentModel.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Eigene Kommentare abrufen (geschützt, über JWT)
router.get('/my-comments', protect, async (req, res) => {
    try {
        const comments = await BlogComment.find({ user: req.user._id })
            .populate('blogs', 'title')
            .populate('user', 'nickname email')
            .select('text createdAt blogs user')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        console.error('Get my blogs comments error:', error);
        res.status(500).json({ message: 'Fehler beim Abrufen deiner Kommentare' });
    }
});

export default router;
