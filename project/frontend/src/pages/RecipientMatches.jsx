import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getCurrentLocation, calculateDistance } from "@/lib/location";

const RecipientMatches = () => {

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {

    // ✅ get user location
    getCurrentLocation()
      .then(setUserLocation)
      .catch(() => { });

    const foodType = localStorage.getItem("recipientFoodType");
    const quantity = localStorage.getItem("recipientQuantity"); // ✅ ADD

    if (!foodType) {
      setLoading(false);
      return;
    }

    async function fetchMatches() {

      try {

        // ❌ REMOVE OLD CACHE (IMPORTANT FIX)
        localStorage.removeItem("foodMatches");

        const res = await fetch(
          `http://localhost:4000/api/food/match?foodType=${foodType}&quantity=${quantity || ""}`
        );

        const data = await res.json();

        const foodsData = Array.isArray(data) ? data : [];

        setFoods(foodsData);

        // optional (safe cache)
        localStorage.setItem("foodMatches", JSON.stringify(foodsData));

      } catch (err) {

        console.error("Error fetching matches:", err);

      } finally {

        setLoading(false);

      }

    }

    fetchMatches();

  }, []);


  const requestFood = async (foodId) => {

    const name = prompt("Enter your name");
    const phone = prompt("Enter your phone number");

    if (!name || !phone) {
      alert("Name and phone are required");
      return;
    }

    try {

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          foodId,
          recipientName: name,
          recipientPhone: phone
        })
      });

      const data = await res.json();

      if (res.ok) {

        localStorage.setItem("activeRequest", data.request._id);

        alert("Food request sent!");

      } else {

        alert(data.message || "Failed");

      }

    } catch (err) {

      console.error(err);
      alert("Server error");

    }

  };


  if (loading) return <p className="text-center mt-10">Finding best food matches...</p>;

  if (!foods.length) return <p className="text-center mt-10">No matching food donations found.</p>;


  return (

    <div className="max-w-3xl mx-auto p-6">

      <h2 className="text-2xl font-bold mb-6">
        Matching Food Donations
      </h2>

      {[...foods]
        .sort((a, b) => {
          if (!userLocation) return 0;

          const distA = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            a.location?.coordinates?.[1] || 0,
            a.location?.coordinates?.[0] || 0
          );

          const distB = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            b.location?.coordinates?.[1] || 0,
            b.location?.coordinates?.[0] || 0
          );

          return distA - distB;
        })
        .map((food) => (

          <Card key={food._id} className="mb-4">

            <CardHeader>
              <CardTitle>{food.title}</CardTitle>
            </CardHeader>

            <CardContent>

              <p>{food.description}</p>

              <p className="text-sm mt-2">
                Donor: {food.donorName}
              </p>

              <p className="text-sm">
                Location: {food.address}
              </p>

              {userLocation && food.location?.coordinates && (
                <p className="text-xs text-green-500 mt-1">
                  📍 {calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    food.location.coordinates[1],
                    food.location.coordinates[0]
                  )} km away
                </p>
              )}

              <button
                onClick={() => requestFood(food._id)}
                className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
              >
                Request Food
              </button>

              <button
                onClick={async () => {

                  const reason = prompt("Enter reason: expired / bad / fake / other");

                  if (!reason) return;

                  try {

                    const token = localStorage.getItem("token");

                    await fetch("http://localhost:4000/api/report", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        foodId: food._id,
                        reason
                      })
                    });

                    alert("Report submitted");

                  } catch (err) {
                    alert("Error reporting");
                  }

                }}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                🚨 Report
              </button>

            </CardContent>

          </Card>

        ))}

    </div>

  );

};

export default RecipientMatches;