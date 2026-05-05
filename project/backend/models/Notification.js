import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  type: {
    type: String,
    enum: ["request", "status"]
  },
  message: String,
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request"
  },
  read: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);