import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:4000/api/auth";

const Profile = () => {

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {

    const token = localStorage.getItem("token");

    axios.get(`${API_BASE}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setUser(res.data.user);
      setName(res.data.user.name);
      setEmail(res.data.user.email);
      setRole(res.data.user.role);
    })
    .catch((err)=>{
      console.log(err);
    });

  }, []);

  const handleUpdate = () => {

    const token = localStorage.getItem("token");

    axios.put(
      `${API_BASE}/update-profile`,
      { name, email, role },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((res) => {
      setUser(res.data.user);
      setEditMode(false);
      alert("Profile updated successfully");
    })
    .catch((err)=>{
      console.log(err);
    });

  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setEditMode(false);
  };

  if (!user) return <p>Loading...</p>;

  return (

    <div className="max-w-md mx-auto mt-10 p-6">

      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      {editMode ? (

        <>

          {/* NAME */}
          <div className="mb-3">
            <label className="font-semibold">Name:</label>
            <input
              className="border p-2 w-full bg-white text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label className="font-semibold">Email:</label>
            <input
              className="border p-2 w-full bg-white text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* ROLE */}
          <div className="mb-4">
            <label className="font-semibold">Role:</label>
            <select
              className="border p-2 w-full bg-white text-black"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="donor">Donor</option>
              <option value="recipient">Recipient</option>
            </select>
          </div>

          <button
            className="bg-green-500 text-white px-4 py-2 mr-2"
            onClick={handleUpdate}
          >
            Save
          </button>

          <button
            className="bg-gray-500 text-white px-4 py-2"
            onClick={handleCancel}
          >
            Cancel
          </button>

        </>

      ) : (

        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>

          <button
            className="bg-blue-500 text-white px-4 py-2 mt-4"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        </>

      )}

    </div>
  );
};

export default Profile;