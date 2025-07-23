import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    event: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Event", 
      required: true 
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, // Verfasser des Kommentars
  },
  { timestamps: true }
);

export default mongoose.models.EventComment || mongoose.model("EventComment", commentSchema);