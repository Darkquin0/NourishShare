import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Footer = () => {
  const handleLinkClick = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <footer className="px-6 py-16 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">NourishShare</span>
            </div>
            <p className="text-white/70 leading-relaxed">
              Connecting surplus food with those in need through AI-powered technology. Together, we're building a world without food waste.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <span className="text-lg font-semibold text-white">Platform</span>
            <div className="space-y-3">
              <button onClick={handleLinkClick} className="block text-white/70 hover:text-white transition-colors">How It Works</button>
              <button onClick={handleLinkClick} className="block text-white/70 hover:text-white transition-colors">For Donors</button>
              <button onClick={handleLinkClick} className="block text-white/70 hover:text-white transition-colors">For Recipients</button>
              <button onClick={handleLinkClick} className="block text-white/70 hover:text-white transition-colors">Mobile App</button>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <span className="text-lg font-semibold text-white">Company</span>
            <div className="space-y-3">
              <button onClick={handleLinkClick} className="block text-white/70 hover:text-white transition-colors">About Us</button>
              <button onClick={handleLinkClick} className="block text-white/70 hover:text-white transition-colors">Our Mission</button>
              <button onClick={handleLinkClick} className="block text-white/70 hover:text-white transition-colors">Careers</button>
              <button onClick={handleLinkClick} className="block text-white/70 hover:text-white transition-colors">Press</button>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <span className="text-lg font-semibold text-white">Contact</span>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-white/70">
                <Mail className="h-4 w-4" />
                <span>hello@nourishshare.com</span>
              </div>
              <div className="flex items-center space-x-3 text-white/70">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-white/70">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <p className="text-white/60 text-sm">
            © 2024 NourishShare. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <button onClick={handleLinkClick} className="text-white/60 hover:text-white text-sm transition-colors">Privacy Policy</button>
            <button onClick={handleLinkClick} className="text-white/60 hover:text-white text-sm transition-colors">Terms of Service</button>
            <button onClick={handleLinkClick} className="text-white/60 hover:text-white text-sm transition-colors">Cookie Policy</button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;