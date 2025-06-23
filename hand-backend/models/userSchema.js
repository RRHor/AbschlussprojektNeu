import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    // required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  adress: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Adresse', // Verweis auf das Adressmodell
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    zipCode: Number,
    district: String,
  }, 
  isAdmin: {
    type: Boolean,
    default: false,
  },
  verificationCode: { // Code zur Verifizierung der E-Mail muss sein oder nicht?
    type: Number,
    required: true,
  },
});

// Passwort vor dem Speichern hashen
userSchema.pre('save', async function (next) {
  if (!this.isModified('password'))
    return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
})

// Methode zum Passwortvergleich
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);

};

// Verhindert OverwriteModelError bei mehrfachen Imports:
export default mongoose.models.User || mongoose.model('User', userSchema);