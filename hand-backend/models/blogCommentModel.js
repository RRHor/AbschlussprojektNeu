import mongoose from "mongoose";

const blogCommentSchema = new mongoose.Schema({
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
  }
}, { timestamps: true });

export default mongoose.models.BlogComment || mongoose.model("BlogComment", blogCommentSchema);
