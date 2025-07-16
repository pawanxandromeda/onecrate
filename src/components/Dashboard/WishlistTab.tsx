import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const WishlistTab = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Premium Basmati Rice",
      price: 180,
      originalPrice: 220,
      unit: "1kg",
      rating: 4.8,
      image: "🍚",
      category: "Kitchen"
    },
    {
      id: 2,
      name: "Organic Face Cream",
      price: 450,
      originalPrice: 600,
      unit: "50g",
      rating: 4.6,
      image: "🧴",
      category: "Personal Care"
    },
    {
      id: 3,
      name: "Premium Dog Food",
      price: 1200,
      originalPrice: 1500,
      unit: "5kg",
      rating: 4.9,
      image: "🐕",
      category: "Pet Care"
    }
  ]);

  const removeFromWishlist = (itemId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const addToCart = (itemId) => {
    // Add to cart logic here
    console.log('Added to cart:', itemId);
  };

  if (wishlistItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-12">
            <div className="text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6">Start adding items you love to keep track of them</p>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                Browse Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Your Wishlist</h3>
        <div className="text-sm text-gray-600">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="relative">
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-0 right-0 p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{item.image}</div>
                  <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{item.unit}</p>
                  <div className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {item.category}
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
                    <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    Save ₹{item.originalPrice - item.price} ({Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off)
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button
                    onClick={() => addToCart(item.id)}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => removeFromWishlist(item.id)}
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Remove from Wishlist
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default WishlistTab;