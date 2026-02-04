import mongoose from "mongoose";


const ActivitySchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
action: String,
createdAt: { type: Date, default: Date.now }
});


export default mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);