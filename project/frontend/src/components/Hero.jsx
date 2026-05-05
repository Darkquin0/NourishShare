import React, { useState } from 'react'; // ✅ UPDATED
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {

  const [showVideo, setShowVideo] = useState(false); // ✅ ADD

  const handleDemoClick = () => {
    toast({
      title: "Demo not available",
      description: "This feature will be added soon."
    });
  };

  return (
    <section className="relative px-6 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="inline-flex items-center space-x-2 bg-emerald-500/20 px-4 py-2 rounded-full border border-emerald-400/30"
              >
                <Sparkles className="h-4 w-4 text-emerald-300" />
                <span className="text-emerald-300 text-sm font-medium">AI-Powered Food Redistribution</span>
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="gradient-text">NourishShare</span>
                <br />
                <span className="text-white">Connecting Food</span>
                <br />
                <span className="text-white">with</span> <span className="gradient-text">Purpose</span>
              </h1>

              <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
                A smart, user-friendly application that helps reduce food wastage by connecting restaurants, grocery stores, and households with surplus food to local charities, food banks, and individuals in need.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/sign-in">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 px-8 py-4 text-lg pulse-glow"
                >
                  Start Sharing Food
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              {/* ✅ UPDATED BUTTON */}
              <Button
                onClick={() => setShowVideo(true)}
                variant="outline"
                size="lg"
                className="bg-transparent border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                Our Aim
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">50K+</div>
                <div className="text-white/60 text-sm">Meals Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">1,200+</div>
                <div className="text-white/60 text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">95%</div>
                <div className="text-white/60 text-sm">Match Success</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="floating-animation">
              <img
                alt="NourishShare app interface showing food donation matching"
                className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl"
                src="https://images.unsplash.com/photo-1601972602237-8c79241e468b"
              />
            </div>

            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-r from-teal-400 to-green-400 rounded-full opacity-20 blur-xl"></div>
          </motion.div>
        </div>
      </div>

      {/* ✅ VIDEO MODAL ADD */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]">

          {/* ✅ CLOSE BUTTON (SCREEN LEVEL FIXED) */}
          <button
            onClick={() => setShowVideo(false)}
            className="fixed top-5 right-5 z-[10000] bg-black/70 hover:bg-black text-white rounded-full w-12 h-12 flex items-center justify-center text-xl shadow-lg"
          >
            ✖
          </button>

          {/* ✅ VIDEO CONTAINER */}
          <div className="w-[95%] md:w-[900px] max-h-[90vh] bg-black rounded-xl overflow-hidden">

            <video
              src="/video/aim.mp4"
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />

          </div>

        </div>
      )}
    </section>
  );
};

export default Hero;