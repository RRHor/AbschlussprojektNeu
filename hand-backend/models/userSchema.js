import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  nickname: { type: String, unique: true },
  email:    { type: String, unique: true, unique: true },
  password: { type: String, required: true },
  isVerify: { type: Boolean, default: false },
  adress:   { type: mongoose.Schema.Types.ObjectId, ref: 'Adress' }, // Referenz!
  isAdmin:  { type: Boolean, default: false },
  verificationCode: { type: String, required: false, default: null },
});

// Passwort vor dem Speichern hashen
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Methode zum Passwortvergleich
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;