import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Heart, Globe, TrendingUp } from 'lucide-react';

const Impact = ({ donors, recipients }) => {
  const stats = [
    {
      icon: Leaf,
      number: donors ? donors.toLocaleString() : "2.5M",
      label: "Active Donors",
      description: "Sharing surplus food daily",
    },
    {
      icon: Heart,
      number: recipients ? recipients.toLocaleString() : "150K",
      label: "Recipients Served",
      description: "Families and individuals supported",
    },
    {
      icon: Globe,
      number: "85%",
      label: "Carbon Footprint Reduced",
      description: "Through smart redistribution",
    },
    {
      icon: TrendingUp,
      number: "300+",
      label: "Partner Organizations",
      description: "Restaurants, stores, and charities",
    },
  ];

  return (
    <section className="px-6 py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/50 to-teal-900/50"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="gradient-text">Our Impact</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Together, we're making a real difference in reducing food waste and fighting hunger in communities worldwide.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center glass-effect rounded-2xl p-8 hover:bg-white/15 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl p-4">
                <stat.icon className="w-full h-full text-white" />
              </div>
              
              <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
              <div className="text-xl font-semibold text-white mb-2">{stat.label}</div>
              <div className="text-white/60 text-sm">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Impact;
