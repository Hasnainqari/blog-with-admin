import mongoose from "mongoose";
import User from "./models/User.js"; // ✅ add .js

async function fixUsers() {
  // Connect to your MongoDB cluster
  await mongoose.connect(
    "mongodb+srv://blogsite:blogsite%403210@cluster0.hta267l.mongodb.net/blogdb?retryWrites=true&w=majority"
  );

  // Find users without a 'name' field
  const users = await User.find({ name: { $exists: false } });

  for (let user of users) {
    const nameFromEmail = user.email.split("@")[0];
    user.name = nameFromEmail;
    await user.save();
    console.log(`Updated user ${user.email} -> name: ${nameFromEmail}`);
  }

  console.log("✅ All users fixed!");
  mongoose.disconnect();
}

fixUsers().catch((err) => {
  console.error("❌ Error:", err);
});
