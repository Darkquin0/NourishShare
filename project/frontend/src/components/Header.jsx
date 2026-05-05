import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Leaf, Menu, Bell } from "lucide-react";
import { io } from "socket.io-client";

const Header = () => {

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: ""
  });

  const [notifications, setNotifications] = useState([]);

  // 🔥 LOAD USER
  const loadUser = () => {
    const token = localStorage.getItem("token");

    if (token) {
      setUser({
        name: localStorage.getItem("name") || "",
        email: localStorage.getItem("email") || "",
        role: localStorage.getItem("role") || ""
      });
    } else {
      setUser({ name: "", email: "", role: "" });
    }
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  // 🔥 SOCKET
  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) return;

    let userId = null;

    try {
      userId = JSON.parse(atob(token.split(".")[1])).id;
    } catch {
      return;
    }

    const socket = io("http://localhost:4000", {
      query: { userId }
    });

    socket.on("notification", (data) => {

      setNotifications(prev => {
        if (prev.find(n => n._id === data._id)) return prev;
        return [data, ...prev];
      });

      toast({
        title: "New Notification",
        description: data.message
      });

    });

    return () => socket.disconnect();

  }, []);

  // 🔥 FETCH NOTIFICATIONS
  useEffect(() => {

    const fetchNotifications = async () => {

      try {

        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:4000/api/notification", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        setNotifications(prev => {
          const merged = [...data];

          prev.forEach(n => {
            if (!merged.find(m => m._id === n._id)) {
              merged.unshift(n);
            }
          });

          return merged;
        });

      } catch (err) {
        console.error(err);
      }

    };

    fetchNotifications();

  }, []);

  // 🔥 ACCEPT / REJECT
  const handleAction = async (requestId, status, notifId) => {

    try {

      await fetch(`http://localhost:4000/api/request/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      await fetch(`http://localhost:4000/api/request/notification-read/${notifId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setNotifications(prev =>
        prev.map(n =>
          n._id === notifId
            ? { ...n, status, read: true }
            : n
        )
      );

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 MARK ALL READ
  const markAllRead = async () => {

    try {
      await fetch("http://localhost:4000/api/notification/read-all", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
    } catch { }

    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  // 🔥 CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "?";

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    toast({ title: "Logged out" });
    navigate("/sign-in");
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "text-white" : "text-white/70 hover:text-white";

  return (
    <motion.header className="relative z-50 px-6 py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between text-white">

        {/* LOGO */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500 rounded-xl">
            <Leaf className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold">NourishShare</span>
        </Link>

        {/* NAV */}
        <div className="hidden md:flex items-center space-x-8">

          <NavLink to="/" className={navLinkClass}>Home</NavLink>

          {/* ❌ REMOVE THIS FROM HERE */}
          {/* {!isLoggedIn && Dashboard} */}

          {!isLoggedIn && (
            <>
              <NavLink to="/sign-in" className={navLinkClass}>Sign In</NavLink>
              <NavLink to="/signup" className={navLinkClass}>Sign Up</NavLink>
            </>
          )}

          {/* 🟢 DONOR */}
          {isLoggedIn && user.role === "donor" && (
            <>
              <NavLink to="/for-donors" className={navLinkClass}>
                Donors Form
              </NavLink>

              <NavLink to="/donor-dashboard" className={navLinkClass}>
                Donor Dashboard
              </NavLink>
            </>
          )}

          {/* 🟢 RECIPIENT */}
          {isLoggedIn && user.role === "recipient" && (
            <>
              <NavLink to="/for-recipients" className={navLinkClass}>
                Recipients Form
              </NavLink>

              <NavLink to="/recipient-dashboard" className={navLinkClass}>
                Recipient Dashboard
              </NavLink>

              <NavLink to="/my-requests" className={navLinkClass}>My Requests</NavLink>
            </>
          )}

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>

          {isLoggedIn && (
            <>
              {/* 🔔 NOTIFICATION */}
              <button onClick={() => setShowNotif(!showNotif)} className="relative">
                <Bell />

                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* 🔽 NOTIFICATION DROPDOWN */}
              {showNotif && (
                <div className="absolute right-16 top-12 w-80 bg-white text-black rounded-xl shadow-2xl max-h-[420px] overflow-hidden">
                  <div className="flex justify-between p-3 border-b">
                    <span className="font-semibold">Notifications</span>

                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-blue-600">
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[360px] overflow-y-auto">

                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-gray-500">No notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n._id} className={`p-3 border-b ${!n.read ? "bg-emerald-50" : ""}`}>

                          <p className="text-sm">{n.message}</p>

                          {n.type === "request" && (
                            (!n.status || n.status === "pending") ? (
                              <div className="flex gap-2 mt-2">
                                <button onClick={() => handleAction(n.requestId, "accepted", n._id)} className="bg-green-600 text-white px-2 py-1 rounded">
                                  Accept
                                </button>

                                <button onClick={() => handleAction(n.requestId, "rejected", n._id)} className="bg-red-600 text-white px-2 py-1 rounded">
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <p className="mt-2 text-sm">
                                {n.status === "accepted" ? "Accepted ✅" : "Rejected ❌"}
                              </p>
                            )
                          )}

                        </div>
                      ))
                    )}

                  </div>
                </div>
              )}

              {/* 👤 PROFILE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="w-10 h-10 rounded-full bg-emerald-500 font-bold"
              >
                {firstLetter}
              </button>

              {/* 🔽 PROFILE DROPDOWN */}
              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white text-black rounded-lg shadow-lg z-50">

                  <div className="px-4 py-3 border-b">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm">{user.email}</p>
                  </div>

                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>

                </div>
              )}
            </>
          )}

          <Button variant="ghost" size="icon" className="md:hidden text-white">
            <Menu />
          </Button>

        </div>
      </nav>
    </motion.header>
  );
};

export default Header;