import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { getCurrentLocation, reverseGeocode } from "@/lib/location";
import LocationPicker from "@/components/LocationPicker";

export default function RecipientForm() {

  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    foodType: "",
    quantity: "",
    location: "",
    lat: "",
    lng: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {

    e.preventDefault();

    localStorage.setItem("recipientFoodType", form.foodType);
    localStorage.setItem("recipientQuantity", form.quantity);

    toast({
      title: "Finding matching food donations..."
    });

    navigate("/for-recipients/matches");

  }

  return (

    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-8 bg-white/10 backdrop-blur-lg rounded-xl space-y-5"
      >

        <h2 className="text-2xl font-bold text-white text-center">
          Recipient Registration
        </h2>

        <div>
          <Label className="text-white">Name</Label>
          <Input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="bg-white text-black"
          />
        </div>

        <div>
          <Label className="text-white">Phone</Label>
          <Input
            name="phone"
            required
            value={form.phone}
            onChange={handleChange}
            className="bg-white text-black"
          />
        </div>

        <div>
          <Label className="text-white">Food Requirement</Label>
          <Input
            name="foodType"
            required
            value={form.foodType}
            onChange={handleChange}
            className="bg-white text-black"
          />
        </div>

        <div>
          <Label className="text-white">Quantity</Label>
          <Input
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="bg-white text-black"
          />
        </div>

        <div>
          <Label className="text-white">Location</Label>
          <Input
            name="location"
            required
            value={form.location}
            onChange={handleChange}
            className="bg-white text-black"
          />

          {/* 📍 MAP PICKER BUTTON */}
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="bg-purple-600 text-white px-3 py-2 rounded mt-2"
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

                setForm((prev) => ({
                  ...prev,
                  location: address,
                  lat: loc.lat,
                  lng: loc.lng
                }));

              } catch (err) {
                alert("Location permission denied");
              }
            }}
            className="bg-blue-600 text-white px-3 py-2 rounded mt-2"
          >
            📍 Use My Location
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Find Food Matches
        </Button>

      </form>

      {/* ✅ LOCATION PICKER MODAL */}
      {showPicker && (
        <LocationPicker
          onClose={() => setShowPicker(false)}
          onConfirm={(data) => {

            setForm((prev) => ({
              ...prev,
              location: data.address,
              lat: data.lat,
              lng: data.lng
            }));

            setShowPicker(false);
          }}
        />
      )}
    </>

  );

}