import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await dbConnect();

  // 🔐 Get session correctly
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.query;

  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const isAdmin = session.user.role === "admin";
  const isOwner = blog.author.toString() === session.user.id;

  // ❌ Permission check
  if (!isAdmin && !isOwner) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // ✏️ UPDATE BLOG
  if (req.method === "PUT") {
    await blog.updateOne(req.body);
    return res.status(200).json({ message: "Blog updated" });
  }

  // 🗑️ DELETE BLOG
  if (req.method === "DELETE") {
    await blog.deleteOne();
    return res.status(200).json({ message: "Blog deleted" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
