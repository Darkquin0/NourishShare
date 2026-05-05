import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { reverseGeocode } from "@/lib/location";

const CenterWatcher = ({ onChange }) => {
  const map = useMap();

  useEffect(() => {
    const handleMove = async () => {
      const center = map.getCenter();
      onChange(center.lat, center.lng);
    };

    map.on("moveend", handleMove);
    return () => map.off("moveend", handleMove);
  }, [map, onChange]);

  return null;
};

const LocationPicker = ({ onConfirm, onClose }) => {
  const [center, setCenter] = useState([26.8467, 80.9462]); // default LKO
  const [address, setAddress] = useState("Detecting location...");

  // 🔥 reverse geocode on center change
  const handleCenterChange = async (lat, lng) => {
    setCenter([lat, lng]);
    const addr = await reverseGeocode(lat, lng);
    setAddress(addr || "Unknown location");
  };

  // 📍 Use My Location
  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setCenter([lat, lng]);

      const addr = await reverseGeocode(lat, lng);
      setAddress(addr);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">

      <div className="bg-white rounded-xl w-full max-w-lg p-4">

        <h2 className="text-lg font-bold mb-2">Select Location</h2>

        <div className="relative">

          <MapContainer
            center={center}
            zoom={15}
            style={{ height: "300px", borderRadius: "12px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <CenterWatcher onChange={handleCenterChange} />
          </MapContainer>

          {/* 📍 Fixed center pin */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-3xl">📍</div>
          </div>

        </div>

        {/* 📍 Address */}
        <p className="text-sm mt-3 text-gray-700">{address}</p>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">

          <button
            onClick={useMyLocation}
            className="bg-blue-500 text-white px-3 py-2 rounded"
          >
            Use My Location
          </button>

          <button
            onClick={() => onConfirm({ lat: center[0], lng: center[1], address })}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            Confirm Location
          </button>

          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-3 py-2 rounded"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
};

export default LocationPicker;