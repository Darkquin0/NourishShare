import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, UtensilsCrossed, CheckCircle, Package } from 'lucide-react';
import DonorForm from './DonorForm'; // ✅ import form

const DonorPage = () => {
  const steps = [
    {
      icon: Package,
      title: "1. List Your Surplus",
      description: "Quickly post details about your surplus food items, including type, quantity, and pickup availability.",
    },
    {
      icon: UtensilsCrossed,
      title: "2. Get Matched Instantly",
      description: "Our AI finds the best-fit local charity or individual in real-time, based on need and proximity.",
    },
    {
      icon: CheckCircle,
      title: "3. Coordinate Pickup",
      description: "Arrange a convenient pickup time through our secure messaging system. It’s safe and simple.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>For Donors - NourishShare</title>
      </Helmet>

      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
            <h1 className="text-5xl lg:text-7xl font-bold">
              Turn Your <span className="gradient-text">Surplus</span> into <span className="gradient-text">Support</span>
            </h1>
            <p className="text-xl text-white/80 mt-6 max-w-2xl mx-auto">
              Join our network of restaurants, grocery stores, and households fighting food waste. 
            </p>
            <Link to="#donor-form">
              <Button size="lg" className="mt-10 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 text-lg">
                Start Donating Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 py-20 bg-black/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It <span className="gradient-text">Works</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div key={index} initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: index * 0.15 }} className="feature-card text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 p-4 mb-6 mx-auto">
                  <step.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-white/70">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donor Form */}
      <section id="donor-form" className="px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-8">Register as a Donor</h2>
        <DonorForm />
      </section>
    </>
  );
};

export default DonorPage;