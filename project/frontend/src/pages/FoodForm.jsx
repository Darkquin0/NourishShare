import React, { useState } from "react";
import axios from "axios";

export default function FoodForm({ onAddFood }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    donorName: "",
    address: "",
    expiry: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/food", formData);
      setMessage("🎉 Food donation added!");
      setFormData({
        title: "",
        description: "",
        donorName: "",
        address: "",
        expiry: "",
      });

      // Update map immediately
      onAddFood(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error adding food. Please check the address or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">🍱 Donate Food</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {["title", "donorName", "address", "expiry"].map((field) => (
          <input
            key={field}
            type={field === "expiry" ? "date" : "text"}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
          />
        ))}

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          required
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}