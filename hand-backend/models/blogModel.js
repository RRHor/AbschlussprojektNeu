import mongoose from "mongoose";

const blogsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Verknüpfung zum User
    tags: [{ type: String }],           // Tags als Array von Strings
    images: [{ type: String }],         // Bild-URLs oder Dateinamen
  },
  { timestamps: true }
);

const blogs = mongoose.model("blogs", blogsSchema);
export default blogs;