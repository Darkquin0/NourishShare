import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

  foodId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Food",
    required:true
  },

  buyerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  donorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  amount:{
    type:Number,
    required:true
  },

  platformFee:{
    type:Number,
    required:true
  },

  donorAmount:{
    type:Number,
    required:true
  },

  paymentStatus:{
    type:String,
    enum:["pending","paid","failed"],
    default:"pending"
  },

  orderStatus:{
    type:String,
    enum:["created","confirmed","completed","cancelled"],
    default:"created"
  }

},{timestamps:true});

export default mongoose.model("Order",orderSchema);