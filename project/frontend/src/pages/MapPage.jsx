import React from "react";
import MapView from "./MapView";

const mapContainerStyle = {
  width: "100%",
  height: "70vh",
  minHeight: "300px",
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

export default function MapPage() {

  return (

    <div className="p-6 bg-gray-50 min-h-screen text-black">

      <h1 className="text-3xl font-bold text-center mb-8">
        🍛 Food Donation Map
      </h1>

      <div
        className="max-w-6xl mx-auto rounded-xl overflow-hidden shadow-lg"
        style={mapContainerStyle}
      >

        {/* ✅ Leaflet Map (FREE) */}
        <MapView />

      </div>

    </div>

  );

}