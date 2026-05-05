import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.js";
import requestRoutes from "./routes/request.js";
import foodRoutes from "./routes/food.js";
import orderRoutes from "./routes/order.js";
// import paymentRoutes from "./routes/payment.js";
import ratingRoutes from "./routes/rating.js";
import adminRoutes from "./routes/admin.js";
import dashboardRoutes from "./routes/dashboard.js";
import statsRoutes from "./routes/stats.js";
import notificationRoutes from "./routes/notification.js";
import reportRoutes from "./routes/report.js";

dotenv.config();

const app = express();

app.use("/api/notification", notificationRoutes);
app.use(cors());
app.use(express.json());
app.use("/uploads",express.static("uploads"));

const server = http.createServer(app);

const io = new Server(server,{
  cors:{
    origin:"*"
  }
});

global.io = io;

io.on("connection", (socket) => {

  const userId = socket.handshake.query.userId;

  if (userId) {
    socket.join(userId);
    console.log("JOINED:", userId);
  }

});

mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser:true,
  useUnifiedTopology:true
})
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log("Mongo error:",err));

app.use("/api/auth", authRoutes);
app.use("/api/food",foodRoutes);
app.use("/api/request",requestRoutes);
app.use("/api/order",orderRoutes);
// app.use("/api/payment",paymentRoutes);
app.use("/api/rating",ratingRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/report", reportRoutes);

app.get("/",(req,res)=>{
  res.json({message:"Backend running"});
});

const PORT = process.env.PORT || 4000;

server.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});