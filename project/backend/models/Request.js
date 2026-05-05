import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
{
  foodId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Food",
    required:true
  },

  donorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  recipientId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  recipientName:{
    type:String,
    required:true
  },

  recipientPhone:{
    type:String,
    required:true
  },

  requestType:{
    type:String,
    enum:["donation","order"],
    default:"donation"
  },

  status:{
    type:String,
    enum:["pending","accepted","rejected","completed"],
    default:"pending"
  }

},
{timestamps:true}
);

export default mongoose.model("Request",requestSchema);