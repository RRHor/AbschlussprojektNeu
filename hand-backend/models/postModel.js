import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tags: [String],
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model("Post", postSchema);