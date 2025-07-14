import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    nickname: {
        type: String,
        unique: true,
        sparse: true, // falls nicht jeder User einen Nickname hat
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },

    addresses: [
         {
        street: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        zipCode: { type: Number, required: true },
        state: { type: String, required: true }, // Bundesland
        firstName: { type: String }, // optional
        lastName: { type: String },  // optional
        }
    ],

    // ODER-Logik: isAdmin wird gesetzt, wenn es noch keinen Admin gibt
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // Rückbau: Nur noch isVerify, kein isVerified mehr in diesem Schema
    isVerifid: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
        type: Number,
    },
    // Reset-Code für Passwort-Reset
    resetCode: { type: String, required: false, default: null },
    resetCodeExpires: { type: Date, default: null },
}, {
    timestamps: true,
});

// Password hashing Middleware
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    
    // Prüfen, ob das Passwort bereits ein bcrypt-Hash ist
    // bcrypt-Hashes beginnen immer mit $2a$, $2b$, $2x$ oder $2y$ und sind 60 Zeichen lang
    const isBcryptHash = /^\$2[abxy]\$\d{2}\$.{53}$/.test(this.password);
    
    if (isBcryptHash) {
        // 🔄 Passwort ist bereits ein Hash, Middleware übersprungen
        // console.log('🔄 Password is already hashed, skipping hash middleware');
        return next();
    }
    
    try {
        // 🔐 Passwort wird in Middleware gehasht
        // console.log('🔐 Hashing password in middleware');
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

// Methode zum Passwortvergleich
userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// ODER-Validierung: Mindestens username ODER nickname muss gesetzt sein
userSchema.pre("validate", function (next) {
  if (!this.username && !this.nickname) {
    this.invalidate("username", "Entweder Benutzername ODER Nickname ist erforderlich.");
    this.invalidate("nickname", "Entweder Benutzername ODER Nickname ist erforderlich.");
  }
  next();
});

export { userSchema };