import express from "express";
import Order from "../models/Order.js";
import Food from "../models/Food.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();


// ============================
// CREATE ORDER
// ============================
router.post("/create", verifyToken, async (req,res)=>{

  try{

    const { foodId } = req.body;

    const food = await Food.findById(foodId);

    if(!food){
      return res.status(404).json({
        message:"Food not found"
      })
    }

    const price = food.price || 0;

    if(price === 0){
      return res.status(400).json({
        message:"This food is free donation"
      })
    }

    // Commission calculation
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

    res.status(201).json(order);

  }catch(err){

    console.error(err);

    res.status(500).json({
      message:"Server error creating order"
    })

  }

});


// ============================
// USER ORDER HISTORY
// ============================
router.get("/my-orders", verifyToken, async (req,res)=>{

  try{

    const orders = await Order.find({
      buyerId:req.user.id
    })
    .populate("foodId")
    .sort({createdAt:-1});

    res.json(orders);

  }catch(err){

    res.status(500).json({
      message:"Server error"
    })

  }

});


// ============================
// DONOR ORDERS
// ============================
router.get("/donor-orders", verifyToken, async (req,res)=>{

  try{

    const orders = await Order.find({
      donorId:req.user.id
    })
    .populate("foodId")
    .sort({createdAt:-1});

    res.json(orders);

  }catch(err){

    res.status(500).json({
      message:"Server error"
    })

  }

});

export default router;