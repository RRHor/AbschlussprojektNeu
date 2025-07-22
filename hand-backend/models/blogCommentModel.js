import mongoose from "mongoose";

const blogsCommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    blogs: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "blogs", 
      required: true 
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, // Verfasser des blogs-Kommentars
  },
  { timestamps: true }
);

export default mongoose.models.blogsComment || mongoose.model("blogsComment", blogsCommentSchema);
