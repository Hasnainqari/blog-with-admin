import dbConnect from "../../lib/db";
import Activity from "../../models/Activity";
import { requireAuth } from "../../lib/auth";

export default async function handler(req, res) {
  const session = await requireAuth(req, res);
  if (!session) return;

  await dbConnect();

  const activity = await Activity.find()
    .populate("user", "email")
    .sort({ createdAt: -1 })
    .limit(10);

  res.json(activity);
}
