import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, // Verfasser des Kommentars
    post: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Blog" // oder "Ad" oder "Event" je nach Verwendung
    },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;