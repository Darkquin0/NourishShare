import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({

  foodId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Food",
    required:true
  },

  donorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  rating:{
    type:Number,
    min:1,
    max:5,
    required:true
  },

  review:{
    type:String
  }

},{timestamps:true});

export default mongoose.model("Rating",ratingSchema);