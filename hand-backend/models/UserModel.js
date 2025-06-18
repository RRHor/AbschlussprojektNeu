import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User-Schema Definition
const userSchema = new mongoose.Schema(
  {
    // Name des Users (Pflichtfeld)
    name: { type: String, required: true },

    // Array von Adress-Objekten für mehrere Wohnsitze
    adress: [
      {
        street: { type: String, required: true },   // Straße
        city: { type: String, required: true },     // Stadt
        district: { type: String, required: true }, // Stadtteil/Bezirk
        state: { type: String, required: true },    // Bundesland
        zip: { type: Number, required: true },      // Postleitzahl
      }
    ],

    // E-Mail-Adresse (muss eindeutig sein)
    email: { type: String, required: true, unique: true },

    // Passwort (wird gehasht gespeichert)
    password: { type: String, required: true },

    // Admin-Status (Standard: false)
    isAdmin: { type: Boolean, default: false },

    // Aktivitätsstatus (Standard: true)
    isActive: { type: Boolean, default: true },

    // Verifizierungscode für E-Mail-Bestätigung (optional)
    verificationCode: { type: String, required: false, default: null },

    // Ablaufdatum des Verifizierungscodes (optional)
    verificationCodeExpires: { type: Date, default: null },
  },
  { timestamps: true } // Erstellt automatisch createdAt und updatedAt Felder
);

// Middleware: Passwort vor dem Speichern hashen
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Methode zum Vergleichen eines eingegebenen Passworts mit dem gespeicherten Hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// User-Modell exportieren (verhindert Mehrfach-Registrierung bei Hot-Reload)
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
