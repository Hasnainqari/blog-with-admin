
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    await dbConnect();

    const { title, desc, content, cardImage, infographImage, seoTitle, seoDescription, slug, author } = req.body;

    // Save to MongoDB
    const newBlog = await Blog.create({
      title,
      desc,
      content,
      cardImage,
      infographImage,
      seoTitle,
      seoDescription,
      slug,
      author,
      createdAt: new Date(),
    });

    res.status(201).json(newBlog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
