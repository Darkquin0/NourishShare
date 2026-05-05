import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";

dotenv.config();

const router = express.Router();


// Generate JWT Token
const generateToken = (id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn:"7d"
  });
};



// =====================
// SIGNUP
// =====================
router.post("/signup",async(req,res)=>{

  try{

    const {name,email,password,role} = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    if(!name || !email || !password || !role){
      return res.status(400).json({
        message:"All fields are required"
      });
    }

    if(password.length < 6){
      return res.status(400).json({
        message:"Password must be at least 6 characters"
      });
    }

    const existingUser = await User.findOne({
      email:normalizedEmail
    });

    if(existingUser){
      return res.status(400).json({
        message:"User already exists"
      });
    }

    const user = await User.create({

      name,
      email:normalizedEmail,
      password,
      role

    });

    res.status(201).json({

      token:generateToken(user._id),

      user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
      }

    });

  }catch(error){

    console.error("Signup error:",error);

    res.status(500).json({
      message:"Server error"
    });

  }

});

// =====================
// SIGNIN
// =====================

router.post("/signin", async (req, res) => {

  try {

    const { email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error("Signin error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});



// =====================
// PROFILE
// =====================
router.get("/profile",verifyToken,(req,res)=>{

  res.json({
    user:req.user
  });

});


export default router;