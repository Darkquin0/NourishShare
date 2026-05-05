import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline   // ✅ ADD
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// 🔥 FIX MARKER ICON ISSUE
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView = () => {

  const [foods, setFoods] = useState([]);
  const [userLocation, setUserLocation] = useState([20.5937, 78.9629]);

  // ✅ ADD: selected food for route
  const [selectedFood, setSelectedFood] = useState(null);

  // 📍 Distance function
  const calculateDistance = (lat1, lon1, lat2, lon2) => {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c).toFixed(2);
  };

  // 📍 Get user location + fetch nearby food
  useEffect(() => {

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setUserLocation([lat, lng]);

      try {

        const res = await fetch(
          `http://localhost:4000/api/food/nearby?lat=${lat}&lng=${lng}`
        );

        const data = await res.json();
        setFoods(data);

      } catch (err) {
        console.error(err);
      }

    });

  }, []);

  return (

    <div className="p-4">

      <MapContainer
        key={userLocation.join(",")}
        center={userLocation}
        zoom={13}
        style={{ height: "500px", borderRadius: "16px" }}
      >

        {/* 🌍 FREE MAP TILE */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 📍 USER LOCATION */}
        <Marker position={userLocation}>
          <Popup>You are here 📍</Popup>
        </Marker>

        {/* 🍛 FOOD MARKERS */}
        {foods.map((food) => {

          if (!food.location || !food.location.coordinates) return null;

          const lat = food.location.coordinates[1];
          const lng = food.location.coordinates[0];

          return (

            <Marker
              key={food._id}
              position={[lat, lng]}
              eventHandlers={{
                click: () => setSelectedFood(food) // ✅ ADD
              }}
            >

              <Popup>

                <div className="text-sm">

                  <h3 className="font-bold">{food.title}</h3>

                  <p>{food.description}</p>

                  <p className="text-xs">
                    {calculateDistance(
                      userLocation[0],
                      userLocation[1],
                      lat,
                      lng
                    )} km away
                  </p>

                  {/* ✅ OPTIONAL: OPEN IN GOOGLE MAP */}
                  <a
                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline text-xs"
                  >
                    Navigate 📍
                  </a>

                </div>

              </Popup>

            </Marker>

          );

        })}

        {/* ✅ ROUTE LINE (USER → SELECTED FOOD) */}
        {selectedFood && selectedFood.location?.coordinates && (
          <Polyline
            positions={[
              userLocation,
              [
                selectedFood.location.coordinates[1],
                selectedFood.location.coordinates[0]
              ]
            ]}
          />
        )}

      </MapContainer>

    </div>

  );

};

export default MapView;