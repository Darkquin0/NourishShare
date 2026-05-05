import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Bell, BarChart3, Users, Smartphone, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Automatically matches surplus food providers with nearby recipients based on location, type of food, and urgency.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Bell,
      title: "Real-Time Notifications",
      description: "Sends alerts to both donors and receivers for quick pickups or deliveries, ensuring food reaches those in need fast.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: BarChart3,
      title: "Donation Tracking & Analytics",
      description: "Keeps track of all donations, enabling users to see their impact on the community and food waste reduction.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "User Profiles & Ratings",
      description: "Allows donors and recipients to maintain profiles and review interactions for trust and transparency.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Smartphone,
      title: "Multi-Platform Accessibility",
      description: "Available on web and mobile devices, ensuring easy access for all users across different platforms.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Secure Communication & Scheduling",
      description: "Facilitates safe coordination between donors and recipients while optimizing delivery schedules.",
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <section className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="gradient-text">Key Features</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Discover how NourishShare leverages cutting-edge technology to create meaningful connections between food surplus and food insecurity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="feature-card group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-full h-full text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;