import express from "express";
import BlogComment from "../models/blogCommentModel.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();


// Alle Kommentare eines Users anhand von Email, Nickname oder Username abrufen
router.post('/blogs-comments/user', async (req, res) => {
    try {
        const { email, nickname, username } = req.body;
        if (!email && !nickname && !username) {
            return res.status(400).json({ message: 'Bitte email, nickname oder username angeben' });
        }
        // User suchen
        const user = await (await import('../models/UserModel.js')).default.findOne({
            $or: [
                email ? { email } : {},
                nickname ? { nickname } : {},
                username ? { username } : {}
            ]
        });
        if (!user) return res.status(404).json({ message: 'User nicht gefunden' });
        const comments = await BlogComment.find({ user: user._id })
            .populate('blogs', 'title')
            .populate('user', 'nickname email')
            .select('text createdAt blogs user')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        console.error('Get user blogs comments by info error:', error);
        res.status(500).json({ message: 'Fehler beim Abrufen der User-Kommentare' });
    }
});
// Alle Kommentare eines Users abrufen
router.get('/blogs-comments/user/:userId', async (req, res) => {
    try {
        const comments = await BlogComment.find({ user: req.params.userId })
            .populate('blogs', 'title')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        console.error('Get user blogs comments error:', error);
        res.status(500).json({ message: 'Fehler beim Abrufen der User-Kommentare' });
    }
});


// blogs-Kommentar erstellen (geschützt)
router.post("/blogs-comments", protect, async (req, res) => {
    try {
        const { blogs, text } = req.body;
        const newComment = new BlogComment({
            blogs,
            text,
            user: req.user._id
        });
        console.log('Debug: Neuer Kommentar vor save:', newComment);
        await newComment.save();
        console.log('Debug: Kommentar gespeichert!');
        // Kommentar mit User-Daten zurückgeben
        const populatedComment = await BlogComment.findById(newComment._id)
            .populate('user', 'nickname email')
            .populate('blogs', 'title');
        res.status(201).json({
            message: "blogs-Kommentar erfolgreich erstellt",
            comment: populatedComment
        });
    } catch (error) {
        console.error('blogs comment creation error:', error);
        res.status(500).json({ message: "Fehler beim Erstellen des Kommentars" });
    }
});

// Kommentare zu einem blogs abrufen
router.get("/blogs-comments/:blogsId", async (req, res) => {
    try {
        const comments = await BlogComment.find({ blogs: req.params.blogsId })
            .populate('user', 'nickname email')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        console.error('Get blogs comments error:', error);
        res.status(500).json({ message: "Fehler beim Abrufen der Kommentare" });
    }
});

// blogs-Kommentar bearbeiten (geschützt)
router.put("/blogs-comments/:id", protect, async (req, res) => {
    try {
        const comment = await BlogComment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Kommentar nicht gefunden" });
        }
        // Prüfen ob User der Autor ist
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Nicht berechtigt" });
        }
        // Nur Text darf bearbeitet werden
        comment.text = req.body.text || comment.text;
        await comment.save();
        res.json({ message: "blogs-Kommentar erfolgreich bearbeitet", comment });
    } catch (error) {
        console.error('Edit blogs comment error:', error);
        res.status(500).json({ message: "Fehler beim Bearbeiten des Kommentars" });
    }
});

// blogs-Kommentar löschen (geschützt)
router.delete("/blogs-comments/:id", protect, async (req, res) => {
    try {
        const comment = await BlogComment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Kommentar nicht gefunden" });
        }
        // Prüfen ob User der Autor ist
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Nicht berechtigt" });
        }
        await BlogComment.findByIdAndDelete(req.params.id);
        res.json({ message: "blogs-Kommentar erfolgreich gelöscht" });
    } catch (error) {
        console.error('Delete blogs comment error:', error);
        res.status(500).json({ message: "Fehler beim Löschen des Kommentars" });
    }
});

export default router;
