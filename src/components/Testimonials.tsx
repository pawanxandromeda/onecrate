import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Simran Kaur",
      role: "Homemaker & Entrepreneur",
     // image: "https://images.unsplash.com/photo-1494790108755-2616b612b047?auto=format&fit=crop&w=150&q=80",
      content: "OneCrate has transformed our household management. Premium products at incredible savings - we save ₹3500 monthly while getting top-quality essentials!",
      rating: 5,
      location: "Mohali"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "IT Professional",
    //  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      content: "The convenience is unmatched. Premium kitchen essentials delivered right to my door in Mohali, perfectly curated for my bachelor lifestyle. Recipe cards are a game-changer!",
      rating: 5,
      location: "Mohali"
    },
    {
      id: 3,
      name: "Priya Sharma",
      role: "Interior Designer",
     // image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      content: "As a quality-conscious professional, Plento exceeds expectations. Beautiful packaging, premium products, and outstanding customer service here in Mohali.",
      rating: 5,
      location: "Mohali"
    },
    {
      id: 4,
      name: "Dr. Amanpreet Singh",
      role: "Healthcare Professional",
     // image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      content: "The hygiene care kit is perfect for my Mohali clinic. Natural, organic products that are gentle yet effective. My staff and patients love the quality!",
      rating: 5,
      location: "Mohali"
    },
    {
      id: 5,
      name: "Neha Gupta",
      role: "Homemaker & Blogger",
     // image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=150&q=80",
      content: "I've tried many subscription boxes, but Plento stands out. Perfect for Mohali families - thoughtful curation, premium quality, and unbeatable savings!",
      rating: 5,
      location: "Mohali"
    },
    {
      id: 6,
      name: "Vikram Singh",
      role: "Marketing Manager",
    //  image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      content: "The pet care kit has been revolutionary for our Lab in Mohali. Premium food and grooming products at unbeatable prices. Our Max has never been healthier!",
      rating: 5,
      location: "Mohali"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
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
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
            Stories from Our{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Mohali Community
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-serif">
            Discover how families in Mohali are transforming their homes with Plento's curated essentials
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.id} variants={cardVariants}>
              <Card className="premium-card h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Quote className="w-8 h-8 text-emerald-500 mb-4" />
                  </div>
                  
                  <p className="text-gray-700 mb-6 font-serif leading-relaxed text-lg italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <div className="flex items-center">
                    {/* <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-emerald-200"
                    /> */}
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900 font-display">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-xs text-emerald-600 font-medium">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-4 bg-emerald-50 rounded-full px-8 py-4">
            <div className="flex -space-x-2">
              {/* {testimonials.slice(0, 4).map((testimonial, index) => (
                <img
                  key={index}
                  src={testimonial.image}
                  alt=""
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              ))} */}
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">Join 5,000+ Mohali Families</div>
              <div className="text-sm text-gray-600">Average rating: 4.9/5 ⭐</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;