import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true }, // Datum und Uhrzeit des Events
    location: { type: String, required: true }, // Ort des Events
    organizer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, // Ersteller/Organisator
    participants: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }], // Teilnehmer
    images: [{ type: String }], // Optional: Bilder
    tags: [{ type: String }],   // Optional: Tags
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;