import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req,res)=>{

 try{

  const donors = await User.countDocuments({
   role:"donor"
  });

  const recipients = await User.countDocuments({
   role:"recipient"
  });

  res.json({
   donors,
   recipients
  });

 }catch(err){

  console.error(err);

  res.status(500).json({
   message:"Stats error"
  });

 }

});

export default router;