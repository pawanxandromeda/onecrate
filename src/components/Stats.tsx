
import React from 'react';
import { motion } from 'framer-motion';

const Stats = () => {
  const stats = [
    { number: "50,000+", label: "Happy Customers", suffix: "" },
    { number: "1M+", label: "Products Delivered", suffix: "" },
    { number: "99.5%", label: "Customer Satisfaction", suffix: "" },
    { number: "500+", label: "Premium Brands", suffix: "" }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <motion.h3 
                className="text-4xl lg:text-5xl font-bold mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {stat.number}
              </motion.h3>
              <p className="text-emerald-100 text-lg font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
