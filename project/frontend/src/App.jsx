import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Dashboard from "./pages/Dashboard";
import HomePage from "@/pages/HomePage";
import DonorPage from "@/pages/DonorPage";
import RecipientPage from "@/pages/RecipientPage";
import SignInPage from "@/pages/SignInPage";
import Signup from "@/pages/Signup";
import DonorMatches from "@/pages/DonorMatches";
import RecipientMatches from "@/pages/RecipientMatches";
import Profile from "@/pages/Profile";
import MapPage from "@/pages/MapPage";
import RequestStatus from "@/pages/RequestStatus";
import RecipientDashboard from "./pages/RecipientDashboard";
import ChatBot from "./components/ChatBot";
import DonorDashboard from "./pages/DonorDashboard";
import MyRequests from "./pages/MyRequests";
const PageLayout = ({ showFooter = true }) => {

  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900 text-white overflow-x-hidden relative">

      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">

        <Header />

        <main className="flex-grow flex items-center">

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>

        </main>

        {showFooter && <Footer />}

      </div>

      <Toaster position="bottom-right" richColors />

    </div>
  );
};

function App() {

  const [donors, setDonors] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:4000/api";

  // Fetch donors
  useEffect(() => {

    const fetchData = async () => {

      try {

        const res = await axios.get(`${API_BASE}/food`);
        setDonors(res.data || []);

        setDonors(Array.isArray(res.data) ? res.data : []);

      } catch (err) {

        console.error("Failed to fetch initial data:", err);

      } finally {

        setLoading(false);

      }

    };

    fetchData();

  }, []);



  const addDonor = async (donor) => {

    try {

      const res = await axios.post(`${API_BASE}/donors`, donor);

      const added = res.data?.donor || donor;

      setDonors((prev) => [...prev, added]);

      return added;

    } catch (err) {

      console.error("Error adding donor:", err);

      return null;

    }

  };



  const addRecipient = async (recipient) => {

    try {

      const res = await axios.post(`${API_BASE}/recipients`, recipient);

      const added = res.data?.recipient || recipient;

      setRecipients((prev) => [...prev, added]);

      return added;

    } catch (err) {

      console.error("Error adding recipient:", err);

      return null;

    }

  };



  return (

    <>

      <Helmet>
        <title>NourishShare - AI-Powered Food Redistribution Platform</title>
      </Helmet>

      <Routes>

        <Route element={<PageLayout />}>

          <Route
            path="/"
            element={
              <HomePage
                donorsCount={donors.length}
                recipientsCount={recipients.length}
                loading={loading}
              />
            }
          />

          <Route path="/map" element={<MapPage />} />

          <Route path="for-donors" element={<DonorPage addDonor={addDonor} />} />

          <Route path="for-donors/matches/:donorId" element={<DonorMatches />} />

          <Route path="/donor-requests" element={<DonorMatches />} />

          <Route path="/donor-dashboard" element={<DonorDashboard />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/recipient-dashboard" element={<RecipientDashboard />} />

          <Route
            path="for-recipients"
            element={<RecipientPage addRecipient={addRecipient} />}
          />

          <Route path="/for-recipients/matches" element={<RecipientMatches />} />

          <Route path="/request-status" element={<RequestStatus />} />

          <Route path="/profile" element={<Profile />} />

        </Route>

        <Route element={<PageLayout showFooter={false} />}>

          <Route path="/sign-in" element={<SignInPage />} />

          <Route path="/signup" element={<Signup />} />

        </Route>

      </Routes>

      <ChatBot />

    </>

  );

}

export default App;