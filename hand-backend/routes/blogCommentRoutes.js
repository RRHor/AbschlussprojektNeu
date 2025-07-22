import express from "express";
import blogCommentModel from "../models/blogCommentModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// blogs-Kommentar erstellen (geschützt)
router.post("/blogs-comments", protect, async (req, res) => {
    try {
        const { blogs, text } = req.body;
        
        const newComment = new blogsComment({
            blogs,
            text,
            user: req.user._id
        });
        
        await newComment.save();
        
        // Kommentar mit User-Daten zurückgeben
        const populatedComment = await blogsComment.findById(newComment._id)
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
        const comments = await blogsComment.find({ blogs: req.params.blogsId })
            .populate('user', 'nickname email')
            .sort({ createdAt: -1 });
        
        res.json(comments);
    } catch (error) {
        console.error('Get blogs comments error:', error);
        res.status(500).json({ message: "Fehler beim Abrufen der Kommentare" });
    }
});

// blogs-Kommentar löschen (geschützt)
router.delete("/blogs-comments/:id", protect, async (req, res) => {
    try {
        const comment = await blogsComment.findById(req.params.id);
        
        if (!comment) {
            return res.status(404).json({ message: "Kommentar nicht gefunden" });
        }
        
        // Prüfen ob User der Autor ist
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Nicht berechtigt" });
        }
        
        await blogsComment.findByIdAndDelete(req.params.id);
        
        res.json({ message: "blogs-Kommentar erfolgreich gelöscht" });
    } catch (error) {
        console.error('Delete blogs comment error:', error);
        res.status(500).json({ message: "Fehler beim Löschen des Kommentars" });
    }
});

export default router;
