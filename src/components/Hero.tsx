import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Package, Truck, Gift, Star, Play, Shield, Heart } from 'lucide-react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50";
  
  const variants = {
    primary: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl focus:ring-emerald-500",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-md hover:shadow-lg",
    play: "bg-white/90 backdrop-blur-sm text-emerald-600 hover:bg-white shadow-lg hover:shadow-xl border border-emerald-100"
  };
  
  const sizes = {
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-200 to-emerald-200 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      
      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-emerald-400 rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-6 py-3 rounded-full text-sm font-medium mb-8 border border-emerald-200 shadow-lg backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.2)" }}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Premium Curated Collections</span>
              <Star className="w-3 h-3 text-teal-600 fill-current" />
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-4 leading-tight">
                <span className="block">Life Made</span>
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Simple
                </span>
              </h1>
              
              {/* Catchy Tagline */}
              <motion.div 
                className="text-2xl lg:text-3xl font-medium text-gray-700 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <span className="italic">"Skip the Store, Love What's More"</span>
              </motion.div>
            </motion.div>

            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Premium household essentials delivered monthly to your door. 
              <span className="font-semibold text-emerald-600"> Save 30% on retail prices</span> while 
              discovering curated products that make everyday life extraordinary.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
             <a href="#subscriptions">
  <Button size="lg" className="group shadow-2xl hover:shadow-emerald-500/25">
    Start Your Journey
    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
  </Button>
</a>

              {/* <Button variant="play" size="lg" className="group">
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch How It Works
              </Button> */}
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <motion.div 
                className="text-center lg:text-left group cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:from-teal-600 group-hover:to-emerald-600 transition-all duration-300">50K+</div>
                <div className="text-sm text-gray-600 font-medium group-hover:text-gray-800 transition-colors">Happy Families</div>
              </motion.div>
              <motion.div 
                className="text-center lg:text-left group cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:from-teal-600 group-hover:to-emerald-600 transition-all duration-300">30%</div>
                <div className="text-sm text-gray-600 font-medium group-hover:text-gray-800 transition-colors">Savings Guaranteed</div>
              </motion.div>
              <motion.div 
                className="text-center lg:text-left group cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:from-teal-600 group-hover:to-emerald-600 transition-all duration-300">1M+</div>
                <div className="text-sm text-gray-600 font-medium group-hover:text-gray-800 transition-colors">Items Delivered</div>
              </motion.div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              className="flex items-center justify-center lg:justify-start space-x-6 mt-8 pt-6 border-t border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="flex items-center space-x-2 text-gray-600">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium">100% Secure</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Heart className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium">Loved by 50K+ Families</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Section */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {/* Main Product Showcase */}
            <div className="relative">
              {/* Hero Image */}
              <motion.div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src="https://images.pexels.com/photos/7262409/pexels-photo-7262409.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Premium Household Essentials Subscription Box"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                
                {/* Floating Badge */}
                <motion.div 
                  className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-800">Monthly Delivery</span>
                  </div>
                </motion.div>

                {/* Price Badge */}
                <motion.div 
                  className="absolute bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl px-4 py-2 shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">From ₹1,999</div>
                    <div className="text-xs opacity-90">30% OFF Retail</div>
                  </div>
                </motion.div>

                {/* Quality Badge */}
                <motion.div 
                  className="absolute top-6 right-6 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full px-3 py-1 shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-bold">Premium</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Feature Icons */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
                {[
                  { icon: Package, color: "from-emerald-500 to-emerald-600", label: "Curated" },
                  { icon: Truck, color: "from-teal-500 to-teal-600", label: "Fast Delivery" },
                  { icon: Gift, color: "from-cyan-500 to-cyan-600", label: "Surprises" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Ambient Effects */}
            <motion.div 
              className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20 blur-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full opacity-20 blur-2xl"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating product cards */}
            <motion.div 
              className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-emerald-100"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-800">Monthly Box</div>
                  <div className="text-xs text-gray-600">₹1,999/month</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;