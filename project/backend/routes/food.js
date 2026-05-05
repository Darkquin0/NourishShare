import express from "express";
import axios from "axios";
import Food from "../models/Food.js";
import upload from "../middleware/upload.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { expandKeywords, calculateScore } from "../utils/smartMatch.js";

const router = express.Router();


// ============================
// POST - Add Food (Donation / Paid)
// ============================
router.post("/", verifyToken, upload.single("image"), async (req, res) => {

  try {

    const {
      title,
      description,
      donorName,
      donorPhone,
      address,
      expiry,
      quantity,
      price,
      foodType
    } = req.body;

    // Basic validation
    if (!title || !address || !donorName || !donorPhone || !quantity) {
      return res.status(400).json({
        message: "Title, address, donor name and phone are required."
      });
    }

    // Phone validation
    if (donorPhone.length < 10) {
      return res.status(400).json({
        message: "Invalid phone number"
      });
    }

    // Image path
    let imagePath = null;

    if (req.file) {
      imagePath = req.file.filename;
    }

    let coordinates;

    if (req.body.lat && req.body.lng) {
      coordinates = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
    } else {
      coordinates = [77.2090, 28.6139]; // fallback
    }

    // ============================
    // Geocoding using Google Maps (optional)
    // ============================
    if (process.env.GOOGLE_MAPS_API_KEY) {

      try {

        const geoRes = await axios.get(
          "https://maps.googleapis.com/maps/api/geocode/json",
          {
            params: {
              address,
              key: process.env.GOOGLE_MAPS_API_KEY
            }
          }
        );

        const location = geoRes.data.results[0]?.geometry?.location;

        if (location) {
          coordinates = [location.lng, location.lat];
        }

      } catch (geoError) {

        console.log("⚠️ Geocoding failed, using default location");

      }

    }

    // ============================
    // Create Food
    // ============================

    const food = new Food({

      title,
      description,
      donorName,
      donorPhone,
      address,
      expiry,
      quantity: quantity || 1,
      price: price || 0,
      foodType: foodType || "donation",
      image: imagePath,
      donorId: req.user.id,

      location: {
        type: "Point",
        coordinates: coordinates
      }

    });

    await food.save();

    // Real-time event
    if (global.io) {
      global.io.emit("newFood", food);
    }

    res.status(201).json(food);

  } catch (err) {

    console.error("Error adding food:", err.message);

    res.status(500).json({
      message: "Server error"
    });

  }

});


// ============================
// GET - All Food (Non-expired)
// ============================
router.get("/", async (req, res) => {

  try {

    const foods = await Food.find({
      expiry: { $gt: new Date() }
    }).sort({ createdAt: -1 }).limit(50);

    // expiry countdown calculate
    const foodsWithTime = foods.map(food => {

      const remainingTime = new Date(food.expiry) - new Date();

      return {
        ...food._doc,
        remainingTime
      };

    });

    res.status(200).json(foodsWithTime);

  } catch (err) {

    console.error("Error fetching foods:", err.message);

    res.status(500).json({
      message: "Server error while fetching foods"
    });
  }
});


// ============================
// GET - Nearby Food (within 5km)
// ============================
// ============================
// GET - Nearby Food (Dynamic Radius)
// ============================
router.get("/nearby", async (req, res) => {

  try {

    const { lat, lng, radius = 20000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and longitude are required"
      });
    }

    const foods = await Food.find({

      expiry: { $gt: new Date() },

      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)   // ✅ dynamic
        }
      }

    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(foods);

  } catch (err) {

    console.error("Error fetching nearby foods:", err.message);

    res.status(500).json({
      message: "Server error while fetching nearby foods"
    });

  }

});

// ============================
// GET - Smart Food Matching
// ============================
router.get("/match", async (req, res) => {

  try {

    const { foodType, quantity } = req.query;

    if (!foodType) return res.json([]);

    // 🔥 Step 1: expand keywords (AI style)
    const keywords = expandKeywords(foodType);

    const foods = await Food.find({
      expiry: { $gt: new Date() }
    });

    // 🔥 Step 2: scoring
    let matched = foods.map(food => {

      const score = calculateScore(food.title, keywords);

      return {
        ...food.toObject(),
        matchScore: score
      };

    });

    // 🔥 Step 3: filter low matches + quantity filter ✅
    matched = matched.filter(f => {

      const quantityOk = quantity
        ? f.quantity >= Number(quantity)
        : true;

      return f.matchScore >= 1 && quantityOk && keywords.some(word =>
        f.title.toLowerCase().includes(word)
      );
    });

    // 🔥 Step 4: sort best first
    matched.sort((a, b) => b.matchScore - a.matchScore);

    // 🔥 Step 5: fallback strict match (IMPORTANT) + quantity filter ✅
    if (matched.length === 0) {

      const strictKeywords = foodType.toLowerCase().split(" ");

      matched = foods.filter(food => {

        const title = food.title.toLowerCase();

        const quantityOk = quantity
          ? food.quantity >= Number(quantity)
          : true;

        return (
          strictKeywords.every(word => title.includes(word)) && quantityOk
        );
      });

    }

    res.json(matched);

  } catch (err) {
    res.status(500).json({ message: "Error matching food" });
  }

});

export default router;