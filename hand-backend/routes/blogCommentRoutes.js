import express from "express";
import BlogComment from "../models/blogCommentModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Blog-Kommentar erstellen (geschützt)
router.post("/blog-comments", protect, async (req, res) => {
    try {
        const { blog, text } = req.body;
        
        const newComment = new BlogComment({
            blog,
            text,
            user: req.user._id
        });
        
        await newComment.save();
        
        // Kommentar mit User-Daten zurückgeben
        const populatedComment = await BlogComment.findById(newComment._id)
            .populate('user', 'nickname email')
            .populate('blog', 'title');
        
        res.status(201).json({
            message: "Blog-Kommentar erfolgreich erstellt",
            comment: populatedComment
        });
    } catch (error) {
        console.error('Blog comment creation error:', error);
        res.status(500).json({ message: "Fehler beim Erstellen des Kommentars" });
    }
});

// Kommentare zu einem Blog abrufen
router.get("/blog-comments/:blogId", async (req, res) => {
    try {
        const comments = await BlogComment.find({ blog: req.params.blogId })
            .populate('user', 'nickname email')
            .sort({ createdAt: -1 });
        
        res.json(comments);
    } catch (error) {
        console.error('Get blog comments error:', error);
        res.status(500).json({ message: "Fehler beim Abrufen der Kommentare" });
    }
});

// Blog-Kommentar löschen (geschützt)
router.delete("/blog-comments/:id", protect, async (req, res) => {
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
        
        res.json({ message: "Blog-Kommentar erfolgreich gelöscht" });
    } catch (error) {
        console.error('Delete blog comment error:', error);
        res.status(500).json({ message: "Fehler beim Löschen des Kommentars" });
    }
});

export default router;
