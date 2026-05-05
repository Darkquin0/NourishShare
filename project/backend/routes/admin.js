import express from "express";
import User from "../models/User.js";
import Food from "../models/Food.js";
import Order from "../models/Order.js";
import Rating from "../models/Rating.js";

const router = express.Router();


// ============================
// GET ALL USERS
// ============================
router.get("/users",async(req,res)=>{

  const users = await User.find().sort({createdAt:-1});
  res.json(users);

});


// ============================
// GET ALL FOODS
// ============================
router.get("/foods",async(req,res)=>{

  const foods = await Food.find().sort({createdAt:-1});
  res.json(foods);

});


// ============================
// GET ALL ORDERS
// ============================
router.get("/orders",async(req,res)=>{

  const orders = await Order.find().sort({createdAt:-1});
  res.json(orders);

});


// ============================
// GET ALL RATINGS
// ============================
router.get("/ratings",async(req,res)=>{

  const ratings = await Rating.find().sort({createdAt:-1});
  res.json(ratings);

});

export default router;