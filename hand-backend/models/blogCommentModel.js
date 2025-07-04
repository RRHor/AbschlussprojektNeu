import mongoose from "mongoose";

const blogCommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    blog: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Blog", 
      required: true 
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, // Verfasser des Blog-Kommentars
  },
  { timestamps: true }
);

export default mongoose.models.BlogComment || mongoose.model("BlogComment", blogCommentSchema);
