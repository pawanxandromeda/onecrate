
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, Clock, Package, Truck, Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubscriptionDetailProps {
  subscriptionId: number;
  onBack: () => void;
}

const SubscriptionDetail = ({ subscriptionId, onBack }: SubscriptionDetailProps) => {
  const subscriptionData = {
    1: {
      title: "Kitchen Essentials",
      description: "Premium cooking tools, spices, and kitchen gadgets delivered monthly to elevate your culinary experience",
      price: "$39.99",
      originalPrice: "$89.99",
      mrp: "$119.99",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviews: 1250,
      popular: true,
      savings: "$80.00",
      savingsPercent: 67,
      deliveryInfo: "Free delivery • Cancel anytime",
      nextDelivery: "Dec 15, 2024",
      items: [
        { name: "Premium Spice Collection", value: "$24.99", description: "Organic spices from around the world" },
        { name: "Chef's Knife Set", value: "$35.99", description: "Professional-grade stainless steel knives" },
        { name: "Gourmet Recipe Cards", value: "$12.99", description: "Step-by-step guides by expert chefs" },
        { name: "Organic Olive Oil", value: "$18.99", description: "Cold-pressed extra virgin olive oil" },
        { name: "Bamboo Cutting Board", value: "$22.99", description: "Eco-friendly bamboo cutting board" },
        { name: "Silicone Cooking Utensils", value: "$15.99", description: "Heat-resistant silicone utensil set" }
      ],
      features: [
        "Curated by professional chefs",
        "Premium quality ingredients",
        "Eco-friendly packaging",
        "Recipe tutorials included",
        "Free shipping & returns"
      ]
    },
    2: {
      title: "Hygiene Care",
      description: "Personal care and hygiene products for your daily routine, featuring natural and organic ingredients",
      price: "$29.99",
      originalPrice: "$65.99",
      mrp: "$89.99",
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviews: 980,
      popular: false,
      savings: "$60.00",
      savingsPercent: 67,
      deliveryInfo: "Free delivery • Cancel anytime",
      nextDelivery: "Dec 20, 2024",
      items: [
        { name: "Natural Body Soap", value: "$12.99", description: "Handcrafted with organic ingredients" },
        { name: "Skincare Serum", value: "$28.99", description: "Anti-aging vitamin C serum" },
        { name: "Bamboo Toothbrush Set", value: "$8.99", description: "Eco-friendly bamboo toothbrushes" },
        { name: "Organic Shampoo", value: "$16.99", description: "Sulfate-free organic shampoo" },
        { name: "Essential Oil Blend", value: "$19.99", description: "Relaxing lavender and eucalyptus" },
        { name: "Moisturizing Lotion", value: "$14.99", description: "Deep hydration for all skin types" }
      ],
      features: [
        "100% natural ingredients",
        "Cruelty-free products",
        "Dermatologist tested",
        "Sustainable packaging",
        "Free shipping & returns"
      ]
    }
  };

  const subscription = subscriptionData[subscriptionId as keyof typeof subscriptionData];
  
  if (!subscription) {
    return <div>Subscription not found</div>;
  }

  const totalItemValue = subscription.items.reduce((sum, item) => sum + parseFloat(item.value.replace('$', '')), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 hover:bg-emerald-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Subscriptions
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Images and Gallery */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src={subscription.image}
                alt={subscription.title}
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
              {subscription.popular && (
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2">
                  Most Popular
                </Badge>
              )}
            </motion.div>

            {/* Features */}
            <Card className="p-6 shadow-lg">
              <CardTitle className="text-xl mb-4 text-gray-900">What's Included</CardTitle>
              <div className="space-y-3">
                {subscription.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{subscription.title}</h1>
              <p className="text-xl text-gray-600 mb-4">{subscription.description}</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">{subscription.rating}</span>
                  <span className="text-gray-600">({subscription.reviews} reviews)</span>
                </div>
              </div>
            </motion.div>

            {/* Pricing */}
            <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">{subscription.price}</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 line-through">MRP: {subscription.mrp}</div>
                    <div className="text-sm text-gray-600 line-through">Retail: {subscription.originalPrice}</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-emerald-600">You Save: {subscription.savings}</span>
                    <Badge className="bg-emerald-100 text-emerald-800 text-lg px-3 py-1">
                      {subscription.savingsPercent}% OFF
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Item Value: ${totalItemValue.toFixed(2)} • You Pay: {subscription.price}
                  </div>
                </div>
              </div>
            </Card>

            {/* Delivery Info */}
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                <span>Next delivery: {subscription.nextDelivery}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Cancel anytime</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 text-lg"
              >
                Subscribe Now - {subscription.price}/month
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full border-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-semibold py-4"
              >
                <Heart className="w-5 h-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>

        {/* Items Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            This Month's <span className="text-emerald-600">Curated Items</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscription.items.map((item, index) => (
              <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                    <Badge variant="secondary" className="text-emerald-600 font-semibold">
                      {item.value}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscriptionDetail;
