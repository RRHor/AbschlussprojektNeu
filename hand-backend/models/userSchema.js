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
        //district: { type: String }, // optional
        firstName: { type: String }, // optional
        lastName: { type: String },  // optional
        }
    ],

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