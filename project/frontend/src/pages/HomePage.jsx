import React, { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Impact from "@/components/Impact";
import MapView from "../pages/MapView";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const HomePage = () => {

  const [stats, setStats] = useState({ donors: 0, recipients: 0 });
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  // Request Food
  const handleRequest = async (foodId) => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/sign-in");
      return;
    }

    const name = prompt("Enter your name");
    const phone = prompt("Enter your phone number");

    if (!name || !phone) return;

    try {

      const res = await fetch("http://localhost:4000/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`   // ✅ IMPORTANT
        },
        body: JSON.stringify({
          foodId,
          recipientName: name,
          recipientPhone: phone
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Food request sent successfully!");
      } else {
        alert(data.message || "Request failed");
      }

    } catch (err) {

      console.error(err);
      alert("Request failed");

    }

  };

  // Fetch stats
  useEffect(() => {

    const fetchStats = async () => {

      try {

        const res = await fetch("http://localhost:4000/api/stats");

        const data = await res.json();

        setStats({
          donors: data.donors || 0,
          recipients: data.recipients || 0
        });

      } catch (err) {

        console.error("Error fetching stats:", err);

      }

    };

    fetchStats();

  }, []);

  // Socket
  useEffect(() => {

    const socket = io("http://localhost:4000");

    socket.on("newRequest", (data) => {
      alert(data.message);
    });

    return () => socket.disconnect();

  }, []);

  // Fetch foods
  useEffect(() => {

    const fetchFoods = async () => {

      try {

        const res = await fetch("http://localhost:4000/api/food");

        const data = await res.json();

        setFoodItems(data || []);

      } catch (err) {

        console.error("Error fetching foods:", err);

      }

    };

    fetchFoods();

  }, []);

  // Expiry Countdown
  const getRemainingTime = (expiry) => {

    const now = new Date().getTime();
    const expiryTime = new Date(expiry).getTime();

    const diff = expiryTime - now;

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;

  };

  // Search + Filter
  const filteredFoods = foodItems.filter((food) => {

    const matchSearch =
      food.title.toLowerCase().includes(search.toLowerCase()) ||
      food.description.toLowerCase().includes(search.toLowerCase());

    if (filter === "free") return matchSearch && food.price === 0;
    if (filter === "paid") return matchSearch && food.price > 0;

    return matchSearch;

  });

  return (
    <>

      <Hero />

      <Features />

      <Impact donors={stats.donors} recipients={stats.recipients} />


      {/* Food Section */}
      <section className="max-w-6xl mx-auto mb-16 px-6">

        <h2 className="text-3xl font-bold text-center mb-8">
          🍽️ Available Food Donations
        </h2>


        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">

          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg w-full md:w-1/2 text-black"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg text-black"
          >

            <option value="all">All</option>
            <option value="free">Free Food</option>
            <option value="paid">Paid Food</option>

          </select>

        </div>


        {/* Food Cards */}
        <div className="grid md:grid-cols-3 gap-6">

          {filteredFoods.map((food) => (

            <div
              key={food._id}
              className="bg-black/30 rounded-xl shadow-lg overflow-hidden"
            >

              {/* Image */}
              {food.image && (
                <img
                  src={`http://localhost:4000/uploads/${food.image}`}
                  alt={food.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-5">

                <h3 className="text-xl font-bold">
                  {food.title}
                </h3>

                <p className="text-gray-300 mt-2">
                  {food.description}
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  📍 {food.address}
                </p>

                {/* Badge */}
                <div className="mt-2">

                  {food.price > 0 ? (
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                      PAID ₹{food.price}
                    </span>
                  ) : (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                      FREE
                    </span>
                  )}

                </div>

                {/* Expiry */}
                <p className="text-sm text-red-400 mt-2">
                  ⏳ Expires in: {getRemainingTime(food.expiry)}
                </p>

                <button
                  onClick={() => handleRequest(food._id)}
                  className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded mt-3 text-white"
                >
                  Request Food
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* Live Map */}
      <section className="mt-12 px-8 mb-16">

        <h2 className="text-3xl font-bold text-center mb-6">
          🗺️ Live Food Donation Map
        </h2>

        <p className="text-center text-gray-300 mb-6">
          See all active food donations across locations in real-time.
        </p>

        <div className="rounded-2xl overflow-hidden shadow-lg">
          <MapView foodItems={foodItems} />
        </div>

        <div className="flex justify-center mt-6">

          <button
            onClick={() => navigate("/map")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 rounded-full"
          >
            View Full Map
          </button>

        </div>

      </section>

    </>
  );

};

export default HomePage;