import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import User from "@/models/User";


export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      // Get all users
      const users = await User.find().lean();

      // Get last blog for each user
      const usersWithLastBlog = await Promise.all(
        users.map(async (user) => {
          const lastBlog = await Blog.findOne({ author: user._id })
            .sort({ createdAt: -1 })
            .lean();
          return { ...user, lastBlog };
        })
      );

      res.status(200).json(usersWithLastBlog);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
