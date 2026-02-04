import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await dbConnect();

  const { name, oldPassword, newPassword } = req.body;

  const user = await User.findById(session.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 🔐 Change password (optional)
  if (newPassword) {
    if (!oldPassword) {
      return res.status(400).json({ message: "Old password is required" });
    }

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
  }

  // ✏️ Update name
  if (name) {
    user.name = name;
  }

  await user.save();

  res.status(200).json({ message: "Profile updated successfully" });
}
