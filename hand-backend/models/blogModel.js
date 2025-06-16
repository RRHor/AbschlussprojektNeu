import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Verknüpfung zum User
    createdAt: { type: Date, default: Date.now },
    // Optional: Kategorie, Bilder, Status, etc.
    // category: { type: String },
    // images: [String],
    // status: { type: String, default: "offen" }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;