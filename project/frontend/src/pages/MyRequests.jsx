import React, { useEffect, useState } from "react";

const MyRequests = () => {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("token");

    async function fetchData() {

      try {

        const res = await fetch("http://localhost:4000/api/request/my-requests", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        setRequests(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

    }

    fetchData();

  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!requests.length) return <p className="text-center mt-10">No requests yet</p>;

  return (

    <div className="max-w-4xl mx-auto p-6">

      <h2 className="text-2xl font-bold mb-6">
        My Requests
      </h2>

      {requests.map((req) => {

        const food = req.foodId;

        return (

          <div key={req._id} className="bg-white p-5 rounded-xl shadow mb-4 border">

            <h3 className="text-lg font-bold">
              {food?.title || "Food"}
            </h3>

            <p className="text-sm text-gray-600 mt-1">
              {food?.description}
            </p>

            <div className="mt-3 text-sm space-y-1">

              <p>📍 {food?.address}</p>

              <p>👤 Donor: {food?.donorName}</p>

              <p>📞 {food?.donorPhone}</p>

              <p>
                📅 Requested On: {new Date(req.createdAt).toLocaleString()}
              </p>

            </div>

            <div className="mt-3">
              <span className={`px-3 py-1 rounded-full text-white text-xs
                ${req.status === "pending" ? "bg-yellow-500" :
                  req.status === "accepted" ? "bg-green-600" :
                  "bg-red-500"}`}>
                {req.status.toUpperCase()}
              </span>
            </div>

          </div>

        );

      })}

    </div>

  );

};

export default MyRequests;