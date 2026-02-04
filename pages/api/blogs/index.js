import Blog from "@/models/Blog";
import dbConnect from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export default async function handler(req, res) {
  // 🔐 Require login
  const session = await requireAuth(req, res);
  if (!session) return;

  // 🚫 Only allow GET here
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const blogs = await Blog.find()
      .populate("author", "name email role") // fetch these fields
      .sort({ createdAt: -1 });

    res.json(blogs);

    // return res.status(200).json(blogs);
  } catch (error) {
    console.error("Fetch blogs error:", error);
    return res.status(500).json({ message: "Failed to fetch blogs" });
  }
}
