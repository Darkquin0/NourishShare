import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { getCurrentLocation, reverseGeocode } from "@/lib/location";
import LocationPicker from "@/components/LocationPicker";

export default function DonorForm() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    surplus: "",
    quantity: "",
    pickupTime: "",
    location: "",
    price: "" // ✅ ADD
  });

  const [coords, setCoords] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  // ✅ STEP 1: Paid / Free state
  const [isPaid, setIsPaid] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {

    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast({
        title: "Please login first",
        variant: "destructive"
      });
      navigate("/sign-in");
      return;
    }

    try {

      const userId = JSON.parse(atob(token.split(".")[1])).id;

      const res = await fetch("http://localhost:4000/api/food", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({

          title: form.surplus,

          description: `Quantity: ${form.quantity}, Pickup Time: ${form.pickupTime}`,

          donorName: form.name,

          donorPhone: form.phone,

          donorId: userId,

          quantity: Number(form.quantity),

          address: form.location,

          // ✅ STEP 4: FINAL LOGIC
          price: isPaid ? Number(form.price) : 0,
          foodType: isPaid ? "paid" : "donation",

          lat: coords?.lat,   // ✅ FIX
          lng: coords?.lng,   // ✅ FIX

          expiry: new Date(Date.now() + 6 * 60 * 60 * 1000)

        })

      });

      const data = await res.json();

      if (res.ok) {

        toast({
          title: "Food posted successfully!"
        });

        setForm({
          name: "",
          phone: "",
          surplus: "",
          quantity: "",
          pickupTime: "",
          location: "",
          price: ""
        });

        navigate("/donor-dashboard");

      } else {

        toast({
          title: "Failed to submit",
          description: data.message,
          variant: "destructive"
        });

      }

    } catch (err) {

      console.error(err);

      toast({
        title: "Server error",
        variant: "destructive"
      });

    }

  }

  return (

    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 bg-white/10 backdrop-blur-lg rounded-lg space-y-3"
      >

        <h2 className="text-xl font-bold mb-4 text-white">
          Donor Registration
        </h2>

        <input
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="input-field"
        />

        <input
          name="phone"
          required
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="input-field"
        />

        <textarea
          name="surplus"
          required
          value={form.surplus}
          onChange={handleChange}
          placeholder="Surplus Food (Example: Rice, Bread)"
          className="input-field"
        />

        <input
          name="quantity"
          required
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity (Example: 10 plates)"
          className="input-field"
        />

        <input
          name="pickupTime"
          required
          value={form.pickupTime}
          onChange={handleChange}
          placeholder="Pickup Time"
          className="input-field"
        />

        {/* ✅ STEP 2: FREE / PAID OPTION */}
        <div className="text-white">
          <label className="mr-4">
            <input
              type="radio"
              checked={!isPaid}
              onChange={() => setIsPaid(false)}
            /> Free
          </label>

          <label>
            <input
              type="radio"
              checked={isPaid}
              onChange={() => setIsPaid(true)}
            /> Paid
          </label>
        </div>

        {/* ✅ STEP 3: PRICE INPUT */}
        {isPaid && (
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter Price ₹"
            className="input-field"
          />
        )}

        <input
          name="location"
          required
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="input-field"
        />

        {/* 📍 MAP PICKER */}
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="bg-purple-600 text-white px-3 py-2 rounded"
        >
          📍 Pick on Map
        </button>

        {/* 📍 AUTO LOCATION */}
        <button
          type="button"
          onClick={async () => {
            try {
              const loc = await getCurrentLocation();
              const address = await reverseGeocode(loc.lat, loc.lng);

              setCoords(loc);

              setForm((prev) => ({
                ...prev,
                location: address,
              }));

            } catch (err) {
              alert("Location permission denied");
            }
          }}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          📍 Use My Location
        </button>

        <button
          type="submit"
          className="btn-primary w-full mt-3"
        >
          Submit
        </button>

      </form>

      {/* 📍 LOCATION PICKER */}
      {showPicker && (
        <LocationPicker
          onClose={() => setShowPicker(false)}
          onConfirm={(data) => {

            setForm((prev) => ({
              ...prev,
              location: data.address
            }));

            setCoords({
              lat: data.lat,
              lng: data.lng
            });

            setShowPicker(false);
          }}
        />
      )}
    </>

  );

}