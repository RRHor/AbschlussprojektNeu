// routes/exchangeRoutes.js
import express from 'express';
import Exchange from '../models/ExchangeModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Alle Exchange-Posts abrufen
// @route   GET /api/exchange
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('📥 GET /api/exchange called');
    
    const { 
      category, 
      status = 'aktiv',
      page = 1,
      limit = 10,
      search 
    } = req.query;

    const filter = { status };
    
    if (category && ['verschenken', 'tauschen', 'suchen'].includes(category)) {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const skip = (page - 1) * limit;
    
    const posts = await Exchange.find(filter)
      .populate('author', 'nickname')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Exchange.countDocuments(filter);

    res.json({
      success: true,
      data: posts,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('❌ GET /api/exchange error:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Posts'
    });
  }
});

// @desc    Einzelnen Exchange-Post abrufen
// @route   GET /api/exchange/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Exchange.findById(req.params.id)
      .populate('author', 'nickname');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post nicht gefunden'
      });
    }

    // Views erhöhen
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('❌ GET /api/exchange/:id error:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler'
    });
  }
});

// @desc    Neuen Exchange-Post erstellen
// @route   POST /api/exchange
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    console.log('🚀 POST /api/exchange called');
    console.log('📥 Request body:', req.body);
    console.log('👤 User from middleware:', req.user);

    const {
      title,
      description,
      category,
      picture,
      tauschGegen
    } = req.body;

    // Validierung
    if (!title || !description || !category) {
      console.log('❌ Validation failed - missing fields');
      return res.status(400).json({
        success: false,
        message: 'Titel, Beschreibung und Kategorie sind erforderlich'
      });
    }

    if (category === 'tauschen' && !tauschGegen) {
      console.log('❌ Validation failed - missing tauschGegen');
      return res.status(400).json({
        success: false,
        message: 'Für Kategorie "tauschen" ist das Feld "tausche gegen" erforderlich'
      });
    }

    console.log('✅ Validation passed, creating exchange post...');

    const exchangePost = new Exchange({
      title,
      description,
      category: category.toLowerCase(),
      picture: picture || '',
      tauschGegen: category === 'tauschen' ? tauschGegen : undefined,
      author: req.user._id
    });

    console.log('📝 Exchange post object created:', exchangePost);

    const savedPost = await exchangePost.save();
    console.log('💾 Post saved to MongoDB:', savedPost._id);

    await savedPost.populate('author', 'nickname');
    console.log('👤 Author populated:', savedPost.author);

    res.status(201).json({
      success: true,
      data: savedPost,
      message: 'Post erfolgreich erstellt'
    });

    console.log('✅ Response sent successfully');

  } catch (error) {
    console.error('❌ Error in POST /api/exchange:', error);
    console.error('❌ Error stack:', error.stack);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Fehler beim Erstellen des Posts'
    });
  }
});

// @desc    Exchange-Post aktualisieren
// @route   PUT /api/exchange/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const post = await Exchange.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post nicht gefunden'
      });
    }

    // Nur Autor kann bearbeiten
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Nicht berechtigt, diesen Post zu bearbeiten'
      });
    }

    const { title, description, category, picture, tauschGegen, status } = req.body;

    // Felder aktualisieren
    if (title) post.title = title;
    if (description) post.description = description;
    if (category) {
      post.category = category.toLowerCase();
      if (category !== 'tauschen') {
        post.tauschGegen = undefined;
      }
    }
    if (picture !== undefined) post.picture = picture;
    if (category === 'tauschen' && tauschGegen) {
      post.tauschGegen = tauschGegen;
    }
    if (status) post.status = status;

    const updatedPost = await post.save();
    await updatedPost.populate('author', 'nickname');

    res.json({
      success: true,
      data: updatedPost,
      message: 'Post erfolgreich aktualisiert'
    });
  } catch (error) {
    console.error('❌ PUT /api/exchange/:id error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Fehler beim Aktualisieren des Posts'
    });
  }
});

// @desc    Exchange-Post löschen
// @route   DELETE /api/exchange/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Exchange.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post nicht gefunden'
      });
    }

    // Nur Autor kann löschen
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Nicht berechtigt, diesen Post zu löschen'
      });
    }

    await Exchange.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post erfolgreich gelöscht'
    });
  } catch (error) {
    console.error('❌ DELETE /api/exchange/:id error:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Löschen'
    });
  }
});

// @desc    Meine Exchange-Posts abrufen
// @route   GET /api/exchange/my/posts
// @access  Private
router.get('/my/posts', protect, async (req, res) => {
  try {
    const posts = await Exchange.find({ author: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('❌ GET /api/exchange/my/posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler'
    });
  }
});

export default router;