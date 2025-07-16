import React from 'react';
import { Package, Truck, Heart, RefreshCw, Star, Shield, DollarSign, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: Package,
      title: "Choose Your Kit",
      description: "Select from our curated subscription boxes tailored to your lifestyle needs and preferences",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      id: 2,
      icon: RefreshCw,
      title: "Customize Frequency",
      description: "Set your delivery schedule - monthly, bi-weekly, or quarterly based on your consumption needs",
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      id: 3,
      icon: Truck,
      title: "Quality Delivery",
      description: "Receive your premium essentials delivered right to your doorstep with in person verified items",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    },
    {
      id: 4,
      icon: Heart,
      title: "Enjoy & Save",
      description: "Enjoy premium products at 30% less than MRP while discovering new favorites each month",
      color: "from-red-500 to-orange-500",
      bgColor: "from-red-50 to-orange-50"
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Serve Healthy Living",
      description: "We curate only the best quality products that promote a healthy and sustainable lifestyle for you and your family.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Shield,
      title: "Best Quality",
      description: "Every product in our subscription boxes is carefully selected and tested to ensure premium quality and customer satisfaction.",
      color: "from-blue-500 to-cyan-500"
    },
   {
icon: DollarSign,
  title: "Budget-Friendly Savings",
  description: "Save money with cost-effective kits, carefully curated to provide essential items at the best value, helping you stay within your budget.",
  color: "from-green-500 to-emerald-500"
}
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-white via-gray-50 to-emerald-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-6 py-3 rounded-full text-sm font-medium mb-8 border border-emerald-200 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Star className="w-4 h-4 text-emerald-600" />
            <span>How It Works</span>
          </motion.div>

          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              OneCrate?
            </span>
          </h2>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our streamlined process ensures you get the best house essentials without the hassle of shopping, 
            with premium quality guaranteed at unbeatable prices.
          </p>
        </motion.div>

        {/* Steps Section */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              variants={itemVariants}
              className="relative group"
            >
              <div className="text-center">
                {/* Connecting Line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-1/2 w-full h-1 z-0">
                    <div className="h-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${step.color} rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: index * 0.3 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                )}

                {/* Main Card */}
                <motion.div 
                  className={`relative z-10 bg-gradient-to-br ${step.bgColor} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/50`}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Icon Container */}
                  <motion.div 
                    className={`relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${step.color} p-1 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-gray-700 group-hover:text-gray-900 transition-colors" />
                    </div>
                    
                    {/* Step Number */}
                    <div className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {step.id}
                    </div>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Section */}
        <motion.div 
          className="grid md:grid-cols-3 gap-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div 
                    className={`w-20 h-20 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <benefit.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-emerald-600 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {/* Decorative Elements */}
                <motion.div 
                  className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-r ${benefit.color} rounded-full opacity-30`}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className={`absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-r ${benefit.color} rounded-full opacity-40`}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

      
      </div>
    </section>
  );
};

export default HowItWorks;