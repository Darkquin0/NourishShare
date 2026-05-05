import express from "express";
import Food from "../models/Food.js";
import Request from "../models/Request.js";
import Order from "../models/Order.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/donor", verifyToken, async (req, res) => {

  try {

    const donorId = req.user.id;

    // foods added
    const totalFoods = await Food.countDocuments({
      donorId
    });

    // requests accepted
    const totalOrders = await Request.countDocuments({
      donorId,
      status: "accepted"
    });

    // earnings
    const paidOrders = await Order.find({
      donorId,
      paymentStatus: "paid"
    });

    const totalEarnings = paidOrders.reduce((sum, order) => {
      return sum + order.donorAmount;
    }, 0);

    res.json({
      totalFoods,
      totalOrders,
      totalEarnings
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Dashboard error"
    });

  }

});

export default router;