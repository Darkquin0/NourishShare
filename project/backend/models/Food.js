import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    quantity: {
      type: Number,
      required: true
    },

    donorName: {
      type: String,
      required: true
    },

    donorPhone: {
      type: String,
      required: true
    },

    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    address: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      default: 0
    },

    foodType: {
      type: String,
      enum: ["donation", "paid"],
      default: "donation"
    },

    status: {
      type: String,
      enum: ["available", "requested", "completed", "expired"],
      default: "available"
    },

    expiry: {
      type: Date,
      required: true
    },

    image: {
      type: String
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },

      coordinates: {
        type: [Number],
        required: true
      }
    }

  },
  { timestamps: true }
);

foodSchema.index({ location: "2dsphere" });

export default mongoose.model("Food", foodSchema);