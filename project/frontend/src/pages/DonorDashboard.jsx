import React, { useEffect, useState } from "react";

const DonorDashboard = () => {

  const [dashboard, setDashboard] = useState({
    totalFoods: 0,
    totalOrders: 0,
    totalEarnings: 0
  });

  const [requests, setRequests] = useState([]);
  const [foods, setFoods] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ FETCH DASHBOARD
  useEffect(() => {
    fetch("http://localhost:4000/api/dashboard/donor", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setDashboard);
  }, []);

  // ✅ FETCH REQUESTS
  useEffect(() => {
    fetch("http://localhost:4000/api/request", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setRequests);
  }, []);

  // ✅ FETCH FOODS (donor)
  useEffect(() => {
    fetch("http://localhost:4000/api/food", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setFoods);
  }, []);

  // ✅ UPDATE STATUS
  const updateRequest = async (id, status) => {
    await fetch(`http://localhost:4000/api/request/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    window.location.reload();
  };

  // ✅ DELETE REQUEST
  const deleteRequest = async (id) => {
    await fetch(`http://localhost:4000/api/request/${id}`, {
      method: "DELETE"
    });
    setRequests(prev => prev.filter(r => r._id !== id));
  };

  // ✅ CLEAR ALL REJECTED
  const clearRejected = async () => {
    const rejected = requests.filter(r => r.status === "rejected");

    for (let r of rejected) {
      await fetch(`http://localhost:4000/api/request/${r._id}`, {
        method: "DELETE"
      });
    }

    setRequests(prev => prev.filter(r => r.status !== "rejected"));
  };

  // FILTERS
  const accepted = requests.filter(r => r.status === "accepted");
  const rejected = requests.filter(r => r.status === "rejected");

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-8 text-center">
        📊 Donor Dashboard
      </h1>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div
          onClick={() =>
            setActiveTab(activeTab === "foods" ? null : "foods")
          }
          className="bg-black/40 p-6 rounded-xl text-center cursor-pointer"
        >
          <h2>Foods Added</h2>
          <p className="text-3xl text-emerald-400">
            {dashboard.totalFoods}
          </p>
        </div>

        <div
          onClick={() =>
            setActiveTab(activeTab === "orders" ? null : "orders")
          }
          className="bg-black/40 p-6 rounded-xl text-center cursor-pointer"
        >
          <h2>Orders</h2>
          <p className="text-3xl text-yellow-400">
            {dashboard.totalOrders}
          </p>
        </div>

        <div className="bg-black/40 p-6 rounded-xl text-center">
          <h2>Earnings</h2>
          <p className="text-3xl text-green-400">
            ₹{dashboard.totalEarnings}
          </p>
        </div>

      </div>

      {/* ================= FOODS ================= */}
      {activeTab === "foods" && (
        <>
          <h2 className="text-2xl mb-4">Your Foods</h2>

          {foods.map(food => (
            <div key={food._id} className="bg-black/40 p-4 mb-4 rounded">
              <p><b>{food.title}</b></p>
              <p>{food.description}</p>
              <p>{food.address}</p>
            </div>
          ))}
        </>
      )}

      {/* ================= ORDERS ================= */}
      {activeTab === "orders" && (
        <>
          <h2 className="text-2xl mb-4">Accepted Orders</h2>

          {accepted.map(req => (
            <div key={req._id} className="bg-black/40 p-4 mb-4 rounded">
              <p><b>{req.foodId?.title}</b></p>
              <p>{req.recipientName}</p>
              <p>{req.recipientPhone}</p>
            </div>
          ))}
        </>
      )}

      {/* ================= INCOMING (REJECTED) ================= */}
      <h2 className="text-2xl mb-4 mt-10">
        Incoming Requests (Rejected)
      </h2>

      <button
        onClick={clearRejected}
        className="bg-red-600 px-4 py-2 rounded mb-4"
      >
        Clear All
      </button>

      {rejected.map((req, index) => (

        <div key={req._id} className="bg-black/40 p-4 mb-4 rounded">

          {/* CLICK NAME */}
          <p
            className="cursor-pointer font-bold"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            {req.recipientName}
          </p>

          {/* SLIDE DETAILS */}
          {openIndex === index && (
            <div className="mt-2 text-sm">

              <p><b>Food:</b> {req.foodId?.title}</p>
              <p><b>Phone:</b> {req.recipientPhone}</p>
              <p><b>Location:</b> {req.foodId?.address}</p>
              <p><b>Requested At:</b> {new Date(req.createdAt).toLocaleString()}</p>

              <button
                onClick={() => deleteRequest(req._id)}
                className="bg-red-500 px-3 py-1 rounded mt-2"
              >
                Delete
              </button>

            </div>
          )}

        </div>

      ))}

    </div>
  );

};

export default DonorDashboard;