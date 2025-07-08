import mongoose from "mongoose";
import { userSchema } from "./userSchema.js";

// User-Modell exportieren (verhindert Mehrfach-Registrierung bei Hot-Reload)
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
