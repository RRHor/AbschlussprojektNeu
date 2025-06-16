// verifyRoutes.js
// Enthält alle Routen zur E-Mail-Verifizierung von Usern zum Backend

import express from "express";
import User from "../models/userSchema.js";

const router = express.Router();

router.post("/auth/verify", async (req, res) => {
  const { code } = req.body;
  try {
    // Suche nach Code als String (empfohlen)
    const user = await User.findOne({ verificationCode: Number(code) });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Ungültiger oder abgelaufener Code" });
    }
    if (user.isVerify) {
      return res.status(400).json({ message: "E-Mail bereits verifiziert" });
    }
    // Optional: Ablaufdatum prüfen
    // if (
    //   user.verificationCodeExpires &&
    //   user.verificationCodeExpires < Date.now()
    // ) {
    //   return res.status(400).json({ message: "Verifizierungscode abgelaufen" });
    // }
    user.isVerify = true;
    // user.verificationCode = undefined;
    await user.save();
    res.json({ message: "E-Mail erfolgreich verifiziert!" });
  } catch (error) {
    res.status(500).json({ message: "Serverfehler", error: error.message });
  }
});

export default router;
