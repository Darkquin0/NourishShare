import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const RecipientDashboard = () => {
    const [foods, setFoods] = useState([]);
    const [requests, setRequests] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [loadingFoods, setLoadingFoods] = useState(true);
    const [loadingReq, setLoadingReq] = useState(true);

    // 🔎 Filters
    const [radius, setRadius] = useState(10); // km
    const [expiringOnly, setExpiringOnly] = useState(false);
    const [search, setSearch] = useState("");

    // 📍 GET USER LOCATION
    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
            },
            () => setUserLocation(null),
            { enableHighAccuracy: true, timeout: 8000 }
        );
    }, []);

    // 🍛 FETCH NEARBY FOOD
    useEffect(() => {
        if (!userLocation) return;
        setLoadingFoods(true);

        fetch(
            `http://localhost:4000/api/food/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${radius * 1000}`
        )
            .then((res) => res.json())
            .then((data) => setFoods(Array.isArray(data) ? data : []))
            .catch(() => setFoods([]))
            .finally(() => setLoadingFoods(false));
    }, [userLocation]);

    // 📦 FETCH USER REQUESTS
    useEffect(() => {

        const token = localStorage.getItem("token");
        if (!token) return;

        fetch("http://localhost:4000/api/request/my", {   // ✅ FIXED
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setRequests(Array.isArray(data) ? data : []))
            .catch(() => setRequests([]))
            .finally(() => setLoadingReq(false));

    }, []);

    // 📏 DISTANCE (km)
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Number((R * c).toFixed(2));
    };

    // ⏳ EXPIRY + BADGE
    const getExpiryInfo = (expiry) => {
        if (!expiry) {
            return {
                label: "Unknown",
                tone: "bg-gray-400",
                disabled: true
            };
        }
        const diff = new Date(expiry) - new Date();
        if (diff <= 0) return { label: "Expired", tone: "bg-gray-400", disabled: true };

        const hrs = Math.floor(diff / (1000 * 60 * 60));
        if (hrs <= 2) return { label: `${hrs}h left`, tone: "bg-red-500", disabled: false, expiring: true };
        return { label: `${hrs}h left`, tone: "bg-emerald-500", disabled: false };
    };

    // 🔎 FILTERED FOODS
    const filteredFoods = useMemo(() => {
        if (!userLocation) return [];
        return foods
            .map((f) => {
                const lat = f.location?.coordinates?.[1];
                const lng = f.location?.coordinates?.[0];
                const d = lat && lng ? getDistance(userLocation.lat, userLocation.lng, lat, lng) : null;
                return { ...f, _dist: d };
            })
            .filter((f) => (f._dist != null ? f._dist <= radius : true))
            .filter((f) =>
                search
                    ? (f.title + " " + f.description)
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    : true
            )
            .filter((f) => {
                if (!expiringOnly) return true;
                const info = getExpiryInfo(f.expiry);
                return info.expiring;
            })
            .sort((a, b) => (a._dist ?? 999) - (b._dist ?? 999));
    }, [foods, userLocation, radius, expiringOnly, search]);

    // 🔥 REQUEST FOOD
    const requestFood = async (foodId) => {
        const name = prompt("Enter your name");
        const phone = prompt("Enter your phone");
        if (!name || !phone) return;

        const token = localStorage.getItem("token");

        await fetch("http://localhost:4000/api/request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                foodId,
                recipientName: name,
                recipientPhone: phone
            })
        });

        alert("Request sent!");
    };

    // 🚨 REPORT (placeholder UI)
    const reportFood = (foodId) => {
        alert("Reported. Our team will review this item.");
        // later: POST /api/report
    };

    // 📊 QUICK STATS
    const stats = {
        totalReq: requests.length,
        accepted: requests.filter((r) => r.status === "accepted").length,
        pending: requests.filter((r) => r.status === "pending").length
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

            {/* 🔝 HEADER / HERO */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow p-4 md:p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div>
                    <h1 className="text-xl md:text-2xl font-bold">🍽 Recipient Dashboard</h1>
                    <p className="text-sm text-gray-700">
                        Nearby, safe and quick pickups
                    </p>
                </div>

                {/* QUICK ACTIONS */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                    >
                        Refresh
                    </button>
                    <button
                        onClick={() => window.open("/map", "_blank")}
                        className="px-3 py-2 rounded bg-emerald-600 text-white text-sm"
                    >
                        Open Map
                    </button>
                </div>
            </motion.div>

            {/* 📊 STATS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
                {[
                    { label: "Requests", value: stats.totalReq },
                    { label: "Accepted", value: stats.accepted },
                    { label: "Pending", value: stats.pending }
                ].map((s, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        className="bg-white rounded-xl shadow p-4"
                    >
                        <p className="text-gray-500 text-sm">{s.label}</p>
                        <h3 className="text-xl md:text-2xl font-bold">{s.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* 🔎 FILTER BAR */}
            <div className="bg-white rounded-xl shadow p-3 md:p-4 mb-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <div className="flex gap-2 items-center flex-wrap">
                    <select
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className="border rounded px-2 py-1 text-sm text-gray-900 bg-white"
                    >
                        <option value={5}>Within 5 km</option>
                        <option value={10}>Within 10 km</option>
                        <option value={20}>Within 20 km</option>
                    </select>

                    <label className="text-sm flex items-center gap-1">
                        <input
                            type="checkbox"
                            checked={expiringOnly}
                            onChange={(e) => setExpiringOnly(e.target.checked)}
                        />
                        Expiring soon
                    </label>
                </div>

                <input
                    placeholder="Search food…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border rounded px-3 py-1 text-sm w-full md:w-64"
                />
            </div>

            {/* 📦 MY REQUESTS */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">My Requests</h2>

                {/* ✅ NEW: VIEW ALL */}
                <a href="/my-requests" className="text-sm text-blue-600">
                    View All →
                </a>
                </div>

                {loadingReq ? (
                    <div className="grid md:grid-cols-2 gap-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white p-4 rounded-xl shadow animate-pulse h-24" />
                        ))}
                    </div>
                ) : requests.length === 0 ? (
                    <p className="text-gray-700 text-sm">No requests yet.</p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-3">
                        {requests.slice(0, 3).map((req) => {
                            const statusTone =
                                req.status === "accepted"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : req.status === "rejected"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700";

                            return (
                                <div key={req._id} className="bg-white p-4 rounded-xl shadow">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold">
                                            {req.foodId?.title || "Food"}
                                        </h3>
                                        <span className={`text-xs px-2 py-1 rounded ${statusTone}`}>
                                            {req.status}
                                        </span>
                                    </div>

                                    <p className="text-xs text-gray-600 mt-1">
                                        📍 {req.foodId?.address || "—"}
                                    </p>

                                    {req.status === "accepted" && (
                                        <p className="text-xs mt-2">
                                            Pickup within scheduled time. Contact donor if needed.
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 🍛 NEARBY FOOD */}
            <div>
                <h2 className="text-lg md:text-xl font-semibold mb-3">Nearby Food</h2>

                {!userLocation ? (
                    <p className="text-sm text-gray-500">
                        Turn on location to see nearby food.
                    </p>
                ) : loadingFoods ? (
                    <div className="grid md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white p-4 rounded-xl shadow animate-pulse h-36" />
                        ))}
                    </div>
                ) : filteredFoods.length === 0 ? (
                    <p className="text-sm text-gray-800">No food found for selected filters.</p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {filteredFoods.map((food) => {
                            const lat = food.location?.coordinates?.[1];
                            const lng = food.location?.coordinates?.[0];
                            const dist =
                                userLocation && lat && lng
                                    ? getDistance(userLocation.lat, userLocation.lng, lat, lng)
                                    : null;

                            const exp = getExpiryInfo(food.expiry);

                            return (
                                <motion.div
                                    key={food._id}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white p-4 rounded-xl shadow"
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="font-semibold">{food.title}</h3>
                                        {/* Verified placeholder */}
                                        {food.isVerifiedDonor && (
                                            <span className="text-[10px] px-2 py-1 rounded bg-blue-100 text-blue-700">
                                                Verified
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {food.description}
                                    </p>

                                    {/* BADGES */}
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        <span className="bg-emerald-500 text-white text-[11px] px-2 py-1 rounded">
                                            Fresh
                                        </span>
                                        <span className={`${exp.tone} text-white text-[11px] px-2 py-1 rounded`}>
                                            {exp.label}
                                        </span>
                                    </div>

                                    {/* DISTANCE + ADDRESS */}
                                    <div className="text-xs text-gray-600 mt-2">
                                        {dist != null && <div>📍 {dist} km away</div>}
                                        <div>{food.address}</div>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            disabled={exp.disabled}
                                            onClick={() => requestFood(food._id)}
                                            className={`flex-1 px-3 py-2 rounded text-white text-sm ${exp.disabled
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-emerald-600 hover:bg-emerald-700"
                                                }`}
                                        >
                                            {exp.disabled ? "Expired" : "Request Food"}
                                        </button>

                                        <button
                                            onClick={() => reportFood(food._id)}
                                            className="px-3 py-2 rounded text-sm border border-red-400 text-red-600 hover:bg-red-50"
                                        >
                                            Report
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipientDashboard;