import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, HeartHandshake, Bell, MapPin } from 'lucide-react';
import RecipientForm from './RecipientForm';
import RecipientMatches from "./RecipientMatches";

const RecipientPage = () => {

  const [showMatches, setShowMatches] = useState(false);

  // ⭐ Check if matches saved
  useEffect(() => {

    const savedMatches = localStorage.getItem("foodMatches");

    if (savedMatches) {
      setShowMatches(true);
    }

  }, []);

  const benefits = [
    { icon: HeartHandshake, title: "Access Nutritious Food", description: "Find a variety of fresh produce, baked goods, and prepared meals from local donors." },
    { icon: Bell, title: "Get Real-Time Alerts", description: "Receive instant notifications when new food donations become available in your area." },
    { icon: MapPin, title: "Find Food Near You", description: "Our map-based search makes it simple to locate and request food from nearby donors." },
  ];

  return (
    <>
      <Helmet>
        <title>For Recipients - NourishShare</title>
      </Helmet>

      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
            <h1 className="text-5xl lg:text-7xl font-bold">
              Access <span className="gradient-text">Good Food</span> in Your <span className="gradient-text">Community</span>
            </h1>
            <p className="text-xl text-white/80 mt-6 max-w-2xl mx-auto">
              NourishShare connects you with local businesses and neighbors who have surplus food to share.
            </p>
            <Link to="#recipient-form">
              <Button size="lg" className="mt-10 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 text-lg">
                Find Food Near You <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-20 bg-black/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Benefits for <span className="gradient-text">You</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div key={index} initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: index * 0.15 }} className="feature-card text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 p-4 mb-6 mx-auto">
                  <benefit.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-2xl font-bold">{benefit.title}</h3>
                <p className="text-white/70">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recipient Form */}
      <section id="recipient-form" className="px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-8">Register as a Recipient</h2>

        <RecipientForm />

        {/* ⭐ Show matches if saved */}
        {showMatches && (
          <div className="mt-16">
            <RecipientMatches />
          </div>
        )}

      </section>
    </>
  );
};

export default RecipientPage;