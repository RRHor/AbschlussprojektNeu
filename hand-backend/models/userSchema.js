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
    // Neue Felder für Vorname und Nachname direkt im User
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    adress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: Number, required: true },
        district: { type: String }, // optional
        // firstName & lastName in Address -> entfernen, weil auf Root Ebene
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isVerify: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: Number,
    },
}, {
    timestamps: true,
});

// Password hashing Middleware
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
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

export default mongoose.models.User || mongoose.model("User", userSchema);