import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({

  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  reason: {
    type: String,
    enum: ["expired", "bad", "fake", "other"],
    required: true
  },

  message: {
    type: String
  }

}, { timestamps: true });

export default mongoose.model("Report", reportSchema);