import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String }, //Kurzbeschreibung
    content: { type: String, required: true }, // Volltext
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referenz auf User
    date: { type: String }, //z.B. "2025-06-10"
    category: { type: String }, // z.B. "umwelt"
    readTime: { type: String }, // z.B. "5 min"
    image: { type: String }, // Bild-URL
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;