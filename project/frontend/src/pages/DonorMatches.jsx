import React, { useEffect, useState } from "react";

const DonorMatches = () => {

  const [requests, setRequests] = useState([]);

  const updateStatus = async (id, status) => {

    try {

      await fetch(`http://localhost:4000/api/request/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });

      alert("Request updated");

      window.location.reload();

    } catch {

      alert("Failed to update request");

    }

  };

  useEffect(() => {

    fetch("http://localhost:4000/api/request")
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.log(err));

  }, []);

  return (

    <div className="max-w-4xl mx-auto p-6">

      <h2 className="text-3xl font-bold mb-6">
        Food Requests
      </h2>

      {requests.map((req) => (

        <div
          key={req._id}
          className="bg-black/30 p-4 rounded-lg mb-4"
        >

          <h3 className="text-xl font-bold">
            {req.foodId?.title}
          </h3>

          <p className="text-gray-300">
            {req.foodId?.description}
          </p>

          <p className="text-sm text-gray-400">
            Requested by: {req.requesterEmail}
          </p>

          <div className="mt-3 flex gap-3">

            <button
              onClick={() => updateStatus(req._id, "accepted")}
              className="bg-green-600 px-3 py-1 rounded"
            >
              Accept
            </button>

            <button
              onClick={() => updateStatus(req._id, "rejected")}
              className="bg-red-600 px-3 py-1 rounded"
            >
              Reject
            </button>

          </div>

        </div>

      ))}

    </div>

  );

};

export default DonorMatches;