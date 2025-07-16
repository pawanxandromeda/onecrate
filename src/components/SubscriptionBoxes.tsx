import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Clock, Package, Sparkles, ArrowRight, Check } from 'lucide-react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50";
  
  const variants = {
    primary: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl focus:ring-emerald-500",
    secondary: "bg-white text-gray-900 border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 shadow-md hover:shadow-lg",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-md hover:shadow-lg"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
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

interface SubscriptionBoxesProps {
  onSubscriptionClick?: (subscriptionId: number) => void;
}

const SubscriptionBoxes = ({ onSubscriptionClick }: SubscriptionBoxesProps) => {
  const subscriptionBoxes = [
    {
      id: 1,
      title: "Kitchen Essentials",
      description: "Premium cooking tools, spices, and kitchen gadgets delivered monthly to elevate your culinary experience",
      price: "₹3319.17",
      originalPrice: "₹4979.17",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.8,
      reviews: 1250,
      popular: true,
      items: ["Premium Spices", "Cooking Tools", "Recipe Cards", "Organic Ingredients", "Kitchen Gadgets"],
      savings: "33% OFF"
    },
    {
      id: 2,
      title: "Hygiene Care",
      description: "Personal care and hygiene products for your daily routine, featuring natural and organic options",
      price: "₹2489.17",
      originalPrice: "₹3817.17",
      image: "https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.9,
      reviews: 980,
      popular: false,
      items: ["Natural Soaps", "Skincare", "Dental Care", "Hair Products", "Body Care"],
      savings: "35% OFF"
    },
    {
      id: 3,
      title: "Bathroom Luxury",
      description: "Transform your bathroom with premium accessories and essentials for a spa-like experience",
      price: "₹2904.17",
      originalPrice: "₹4397.17",
      image: "https://images.pexels.com/photos/6621496/pexels-photo-6621496.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.7,
      reviews: 756,
      popular: false,
      items: ["Luxury Towels", "Bath Bombs", "Aromatherapy", "Organizers", "Premium Accessories"],
      savings: "34% OFF"
    },
    {
      id: 4,
      title: "Cleaning Supplies",
      description: "Eco-friendly cleaning products for a spotless home that's safe for your family and environment",
      price: "₹2074.17",
      originalPrice: "₹3319.17",
      image: "https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.6,
      reviews: 642,
      popular: false,
      items: ["Eco Cleaners", "Microfiber Cloths", "Natural Detergents", "Scrubbers", "Disinfectants"],
      savings: "38% OFF"
    },
    {
      id: 5,
      title: "Pet Care Kit",
      description: "Everything your furry friends need for health and happiness, curated by pet care experts",
      price: "₹3734.17",
      originalPrice: "₹5643.17",
      image: "https://images.pexels.com/photos/4498185/pexels-photo-4498185.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.9,
      reviews: 1123,
      popular: true,
      items: ["Premium Food", "Toys & Treats", "Grooming Tools", "Health Supplements", "Accessories"],
      savings: "34% OFF"
    },
    {
      id: 6,
      title: "Home Decor",
      description: "Curated decor pieces to beautify your living space with style and elegance",
      price: "₹4149.17",
      originalPrice: "₹6224.17",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.8,
      reviews: 890,
      popular: false,
      items: ["Candles", "Plants", "Art Pieces", "Decorative Items", "Seasonal Decor"],
      savings: "33% OFF"
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
    <section id="subscriptions" className="py-24 bg-gradient-to-br from-gray-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

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
            <Package className="w-4 h-4 text-emerald-600" />
            <span>Premium Subscription Boxes</span>
            <Sparkles className="w-4 h-4 text-teal-600" />
          </motion.div>

          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Choose Your Perfect{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Subscription
            </span>
          </h2>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover our carefully curated subscription boxes designed to make your life easier, 
            more convenient, and filled with premium essentials delivered right to your door.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {subscriptionBoxes.map((box) => (
            <motion.div key={box.id} variants={cardVariants}>
              <div className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-0 bg-white cursor-pointer"
                onClick={() => onSubscriptionClick?.(box.id)}
              >
                {/* Popular Badge */}
                {box.popular && (
                  <div className="absolute top-6 left-6 z-20">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}
                
                {/* Savings Badge */}
                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {box.savings}
                  </div>
                </div>

                {/* Wishlist Button */}
                <div className="absolute top-20 right-6 z-20">
                  <motion.button
                    className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                  </motion.button>
                </div>

                {/* Image Section */}
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={box.image} 
                    alt={box.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  
                  {/* Floating Elements */}
                  <motion.div 
                    className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-gray-800 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Clock className="w-4 h-4 inline mr-1 text-emerald-600" />
                    Monthly
                  </motion.div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {box.title}
                    </h3>
                    <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-700">{box.rating}</span>
                      <span className="text-xs text-gray-500">({box.reviews})</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {box.description}
                  </p>

                  {/* Items Preview */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">What's Included:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {box.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                      {box.items.length > 3 && (
                        <div className="text-sm text-emerald-600 font-medium">
                          +{box.items.length - 3} more premium items
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-900">{box.price}</span>
                      <span className="text-lg text-gray-500 line-through">{box.originalPrice}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">per month</div>
                      <div className="text-sm font-semibold text-emerald-600">Free shipping</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button 
                      className="flex-1 group"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Subscribe Now</span>
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <motion.button
                      className="w-14 h-12 border-2 border-emerald-200 rounded-xl flex items-center justify-center hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ShoppingCart className="w-5 h-5 text-emerald-600" />
                    </motion.button>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {/* <Button 
            variant="outline" 
            size="lg"
            className="px-12 py-4 text-lg font-semibold"
          >
            View All Subscriptions
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button> */}
        </motion.div>
      </div>
    </section>
  );
};

export default SubscriptionBoxes;