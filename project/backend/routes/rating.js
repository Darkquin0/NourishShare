import express from "express";
import Rating from "../models/Rating.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();


// ============================
// ADD RATING
// ============================
router.post("/",verifyToken,async(req,res)=>{

  try{

    const { foodId,donorId,rating,review } = req.body;

    const newRating = new Rating({

      foodId,
      donorId,
      userId:req.user.id,
      rating,
      review

    });

    await newRating.save();

    res.status(201).json(newRating);

  }catch(err){

    res.status(500).json({
      message:"Error adding rating"
    });

  }

});


// ============================
// GET DONOR RATINGS
// ============================
router.get("/donor/:donorId",async(req,res)=>{

  try{

    const ratings = await Rating.find({
      donorId:req.params.donorId
    }).sort({createdAt:-1});

    res.json(ratings);

  }catch(err){

    res.status(500).json({
      message:"Error fetching ratings"
    });

  }

});

export default router;