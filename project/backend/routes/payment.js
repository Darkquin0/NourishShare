import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Food from "../models/Food.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


// ============================
// CREATE PAYMENT ORDER
// ============================
router.post("/create-order", verifyToken, async (req,res)=>{

  try{

    const { foodId } = req.body;

    const food = await Food.findById(foodId);

    if(!food){
      return res.status(404).json({
        message:"Food not found"
      })
    }

    if(food.price === 0){
      return res.status(400).json({
        message:"This food is free donation"
      })
    }

    const price = food.price;

    const platformFee = price * 0.10;
    const donorAmount = price - platformFee;

    const order = new Order({

      foodId: food._id,
      buyerId: req.user.id,
      donorId: food.donorId,
      amount: price,
      platformFee,
      donorAmount

    });

    await order.save();

    const razorpayOrder = await razorpay.orders.create({

      amount: price * 100, // paise
      currency: "INR",
      receipt: order._id.toString()

    });

    res.json({

      razorpayOrderId: razorpayOrder.id,
      amount: price,
      orderId: order._id,
      key: process.env.RAZORPAY_KEY_ID

    });

  }catch(err){

    console.error(err);

    res.status(500).json({
      message:"Payment order creation failed"
    })

  }

});


// ============================
// VERIFY PAYMENT
// ============================
router.post("/verify", async (req,res)=>{

  try{

    const {

      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId

    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if(expectedSignature === razorpay_signature){

      await Order.findByIdAndUpdate(orderId,{
        paymentStatus:"paid",
        orderStatus:"confirmed"
      });

      return res.json({
        message:"Payment successful"
      });

    }else{

      return res.status(400).json({
        message:"Payment verification failed"
      });

    }

  }catch(err){

    console.error(err);

    res.status(500).json({
      message:"Server error"
    })

  }

});

export default router;