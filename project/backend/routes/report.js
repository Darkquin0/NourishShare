import express from "express";
import Report from "../models/Report.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE REPORT
router.post("/", verifyToken, async (req, res) => {

  try {

    const { foodId, reason, message } = req.body;

    const report = new Report({
      foodId,
      userId: req.user._id,
      reason,
      message
    });

    await report.save();

    res.json({ message: "Report submitted" });

  } catch (err) {
    res.status(500).json({ message: "Error submitting report" });
  }

});

export default router;