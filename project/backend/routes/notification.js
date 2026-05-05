import express from "express";
import Notification from "../models/Notification.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================
// GET USER NOTIFICATIONS
// ============================
router.get("/", verifyToken, async (req, res) => {
  try {

    const data = await Notification.find({
      userId: req.user._id
    }).sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});


// ============================
// MARK SINGLE AS READ
// ============================
router.put("/read/:id", verifyToken, async (req, res) => {
  try {

    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    res.json(notif);

  } catch (err) {
    res.status(500).json({ message: "Error updating notification" });
  }
});


// ============================
// MARK ALL AS READ (FIXED)
// ============================
router.put("/read-all", verifyToken, async (req, res) => {
  try {

    await Notification.updateMany(
      { userId: req.user._id },   // 🔥 IMPORTANT FIX
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });

  } catch (err) {
    res.status(500).json({ message: "Error updating notifications" });
  }
});

export default router;