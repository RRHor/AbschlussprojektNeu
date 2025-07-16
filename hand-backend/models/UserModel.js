import mongoose from "mongoose";
import bcrypt from "bcrypt";


// User-Schema Definition
const userSchema = new mongoose.Schema(
  {
    // Nickname (Pflichtfeld, maximal 30 Zeichen)
    nickname: {
      type: String,
      required: [false, "Nickname ist erforderlich"],
      trim: true,
      maxlength: [30, "Nickname darf maximal 30 Zeichen haben"],
    },

    // Username (Pflichtfeld, eindeutig)
    username: {
      type: String,
      required: [false, "Benutzername ist erforderlich"],
      unique: true,
       sparse: true, // <--- Diese Zeile hinzufügen!
      trim: true,
      maxlength: [30, "Benutzername darf maximal 30 Zeichen haben"],
    },

    // E-Mail-Adresse (Pflichtfeld, eindeutig, validieren)
    email: {
      type: String,
      required: [true, "E-Mail ist erforderlich"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Bitte gültige E-Mail eingeben",
      ],
    },

    // Passwort (Pflichtfeld, mindestens 6 Zeichen)
    password: {
      type: String,
      required: [true, "Passwort ist erforderlich"],
      minlength: [6, "Passwort muss mindestens 6 Zeichen haben"],
    },

    // Reset-Code für Passwort-Reset
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    // Profil-Felder
    // firstName: { type: String }, Datenschutz beachten
    // lastName: { type: String }, Datenschutz beachten
    addresses: [
      {
        street: String,
        city: String,
        zip: String,
        district: String,
        state: String,
        firstName: { type: String },
        lastName: { type: String },
      },
    ],
    // --- Wichtige User-Status-Felder direkt unter addresses ---
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: Number },
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

// ODER-Logik: Entweder username ODER nickname muss gesetzt sein, nie beide Pflicht
// (Validierung siehe unten)

// ODER-Validierung: Mindestens username ODER nickname muss gesetzt sein
userSchema.pre("validate", function (next) {
  if (!this.username && !this.nickname) {
    this.invalidate("username", "Entweder Benutzername ODER Nickname ist erforderlich.");
    this.invalidate("nickname", "Entweder Benutzername ODER Nickname ist erforderlich.");
  }
  next();
});



// User-Modell exportieren (verhindert Mehrfach-Registrierung bei Hot-Reload)
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
