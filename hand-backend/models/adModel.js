import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["verschenke", "suche", "tausche"], 
      required: true 
    }, // Art der Anzeige
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, // Ersteller
    images: [{ type: String }], // Optional: Bilder
    tags: [{ type: String }],   // Optional: Tags
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.models.Ad || mongoose.model("Ad", adSchema);