import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: String,
  desc: String,
  content: String,
  cardImage: String,
  infographImage: String,
  seoTitle: String,
  seoDescription: String,
  slug: { type: String, unique: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: Date,
});

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
