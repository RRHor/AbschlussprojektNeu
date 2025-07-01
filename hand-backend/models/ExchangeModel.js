// models/ExchangeModel.js
import mongoose from 'mongoose';

const exchangeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Titel ist erforderlich'],
    trim: true,
    maxlength: [100, 'Titel darf maximal 100 Zeichen haben']
  },
  description: {
    type: String,
    required: [true, 'Beschreibung ist erforderlich'],
    trim: true,
    maxlength: [1000, 'Beschreibung darf maximal 1000 Zeichen haben']
  },
  category: {
    type: String,
    required: [true, 'Kategorie ist erforderlich'],
    enum: ['verschenken', 'tauschen', 'suchen'],
    lowercase: true
  },
  picture: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        if (!v || v.trim() === '') return true;
        return /^https?:\/\/.+/.test(v) || /^data:image\//.test(v);
      },
      message: 'Bild muss eine gültige URL oder Base64-String sein'
    }
  },
  tauschGegen: {
    type: String,
    trim: true,
    required: function() {
      return this.category === 'tauschen';
    },
    maxlength: [200, 'Tausch-Beschreibung darf maximal 200 Zeichen haben']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['aktiv', 'reserviert', 'abgeschlossen'],
    default: 'aktiv'
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Debug Pre-Save Hook
exchangeSchema.pre('save', function(next) {
  console.log('🔄 Pre-save hook triggered for Exchange');
  console.log('📝 Document to save:', this.toObject());
  
  if (this.category === 'tauschen' && !this.tauschGegen) {
    console.log('❌ Pre-save validation failed: missing tauschGegen');
    return next(new Error('Für Kategorie "tauschen" ist das Feld "tausche gegen" erforderlich'));
  }
  
  if (this.category !== 'tauschen' && this.tauschGegen) {
    this.tauschGegen = undefined;
  }
  
  console.log('✅ Pre-save validation passed');
  next();
});

// Debug Post-Save Hook
exchangeSchema.post('save', function(doc) {
  console.log('✅ Post-save hook: Document saved successfully');
  console.log('📄 Saved document ID:', doc._id);
});

// Debug Save Error Hook
exchangeSchema.post('save', function(error, doc, next) {
  if (error) {
    console.error('❌ Save error occurred:', error);
  }
  next();
});

const Exchange = mongoose.model('Exchange', exchangeSchema);

export default Exchange;