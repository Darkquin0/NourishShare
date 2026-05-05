import express from "express";
import Request from "../models/Request.js";
import Food from "../models/Food.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import Notification from "../models/Notification.js";

const router = express.Router();


// ============================
// CREATE REQUEST
// ============================
router.post("/", verifyToken, async (req, res) => {

  try {
    const { foodId, recipientName, recipientPhone } = req.body;

    const food = await Food.findById(foodId);

    const request = new Request({
      foodId,
      donorId: food.donorId,
      recipientId: req.user._id,
      recipientName,
      recipientPhone,
      status: "pending"
    });

    await request.save();

    // 🔔 SAVE NOTIFICATION FOR DONOR
    const savedNotification = await Notification.create({
      userId: food.donorId,
      type: "request",
      message: `${recipientName} requested your food`,
      requestId: request._id,
      read: false,
      status: "pending"
    });

    // 🔔 SEND TO DONOR (FULL OBJECT 🔥 FIX)
    if (global.io) {
      global.io.to(food.donorId.toString()).emit("notification", savedNotification);
    }

    res.json({ request });

  } catch (err) {
    res.status(500).json({ message: "Request error" });
  }
});


// ============================
// GET NOTIFICATIONS (USER)
// ============================
router.get("/notifications", verifyToken, async (req, res) => {
  const data = await Notification.find({
    userId: req.user._id
  }).sort({ createdAt: -1 });

  res.json(data);
});

// GET recipient requests
router.get("/my", verifyToken, async (req, res) => {

  const data = await Request.find({
    recipientId: req.user._id
  }).populate("foodId");

  res.json(data);
});


// ============================
// GET REQUESTS (ONLY DONOR)
// ============================
router.get("/", verifyToken, async (req, res) => {

  try {

    const requests = await Request.find({
      donorId: req.user._id
    })
      .populate("foodId")
      .sort({ createdAt: -1 });

    res.json(requests);

  } catch (err) {
    res.status(500).json({
      message: "Server error"
    });
  }

});


// ============================
// GET SINGLE REQUEST
// ============================
router.get("/:id", async (req, res) => {

  try {

    const request = await Request.findById(req.params.id)
      .populate("foodId");

    res.json(request);

  } catch (err) {

    res.status(500).json({
      message: "Server error"
    });

  }

});


// ============================
// UPDATE STATUS
// ============================
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("foodId");

    // 🔔 SEND TO RECIPIENT
    if (global.io && updated.recipientId) {

      // 🔥 FIX: update ALL related notifications
      await Notification.updateMany(
        { requestId: updated._id },
        {
          status: status,
          read: true
        }
      );

      // 🔔 SAVE NEW NOTIFICATION FOR RECIPIENT
      const saved = await Notification.create({
        userId: updated.recipientId,
        type: "status",
        message: `Your request was ${status} by ${updated.foodId.donorName}`,
        requestId: updated._id,
        status: status,
        read: false
      });

      // 🔔 REAL-TIME EMIT (FULL OBJECT 🔥 FIX)
      global.io.to(updated.recipientId.toString()).emit("notification", saved);
    }

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ============================
// MARK SINGLE NOTIFICATION AS READ
// ============================
router.put("/notification-read/:id", verifyToken, async (req, res) => {

  await Notification.findByIdAndUpdate(req.params.id, {
    read: true
  });

  res.json({ message: "Marked as read" });

});

// ============================
// GET - Recipient History
// ============================
router.get("/my-requests", verifyToken, async (req, res) => {

  try {

    const data = await Request.find({
      recipientId: req.user._id
    })
      .populate("foodId")
      .sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }

});


export default router;