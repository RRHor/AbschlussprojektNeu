import mongoose from "mongoose";
import { userSchema } from "./userSchema.js";

const User = mongoose.model("User", userSchema);

export default User;
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
