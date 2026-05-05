import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Dashboard = () => {

  const [user, setUser] = useState({});
  const [stats, setStats] = useState({
    donations: 0,
    requests: 0,
    accepted: 0
  });

  const [foods, setFoods] = useState([]);

  // 🔥 LOAD USER
  useEffect(() => {
    setUser({
      name: localStorage.getItem("name"),
      role: localStorage.getItem("role")
    });
  }, []);

  // 🔥 FETCH DATA (dummy for now)
  useEffect(() => {

    fetch("http://localhost:4000/api/food")
      .then(res => res.json())
      .then(data => setFoods(data))
      .catch(() => {});

  }, []);

  // 🔥 EXPIRY CALCULATION
  const getExpiry = (expiry) => {
    const diff = new Date(expiry) - new Date();

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours}h left`;
  };

  return (

    <div className="p-6 bg-gray-50 min-h-screen">

      {/* 👤 PROFILE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow p-6 mb-6"
      >
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-gray-500 capitalize">{user.role}</p>
      </motion.div>

      {/* 📊 STATS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        {["Donations", "Requests", "Accepted"].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-4 rounded-xl shadow"
          >
            <p className="text-gray-500">{item}</p>
            <h3 className="text-2xl font-bold">
              {Object.values(stats)[i]}
            </h3>
          </motion.div>
        ))}

      </div>

      {/* 🔒 SAFETY PANEL */}
      <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-xl mb-6">

        <h3 className="font-bold mb-2">Food Safety Guidelines</h3>

        <ul className="text-sm space-y-1">
          <li>✔ Only fresh food allowed</li>
          <li>✔ No expired food</li>
          <li>✔ Proper packaging required</li>
          <li>✔ Pickup within time</li>
        </ul>

      </div>

      {/* 🍛 FOOD LIST */}
      <div className="grid md:grid-cols-2 gap-4">

        {foods.map(food => (

          <motion.div
            key={food._id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow p-4"
          >

            <h3 className="font-bold">{food.title}</h3>

            <p className="text-sm text-gray-500">
              {food.description}
            </p>

            {/* 🔥 SAFETY BADGES */}
            <div className="flex gap-2 mt-2 flex-wrap">

              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                Fresh
              </span>

              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                {getExpiry(food.expiry)}
              </span>

            </div>

            {/* 📍 LOCATION */}
            <p className="text-xs mt-2 text-gray-600">
              📍 {food.address}
            </p>

            {/* 🚨 REPORT BUTTON */}
            <button className="mt-3 text-red-600 text-sm">
              Report Food
            </button>

          </motion.div>

        ))}

      </div>

    </div>

  );

};

export default Dashboard;