import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ArrowLeft, CheckCircle, Truck, Shield } from 'lucide-react';
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
      price: "₹3319.17",
      originalPrice: "₹4979.17",
      mrp: "₹5979.17",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.8,
      reviews: 1250,
      popular: true,
      deliveryInfo: "Free delivery • Cancel anytime",
      nextDelivery: "Aug 20, 2025",
      items: [
        { name: "Premium Spice Collection", value: "₹599", description: "Organic spices from around the world" },
        { name: "Chef's Knife Set", value: "₹999", description: "Professional-grade stainless steel knives" },
        { name: "Gourmet Recipe Cards", value: "₹199", description: "Step-by-step guides by expert chefs" },
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
      title: "Daily Staples",
      description: "Essential groceries delivered monthly at wholesale prices",
      price: "₹2499.00",
      originalPrice: "₹3799.00",
      mrp: "₹4599.00",
      image: "https://images.pexels.com/photos/4197981/pexels-photo-4197981.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.6,
      reviews: 845,
      popular: false,
      deliveryInfo: "Free delivery • Cancel anytime",
      nextDelivery: "Aug 18, 2025",
      items: [
        { name: "Basmati Rice 5kg", value: "₹749", description: "Premium aged rice" },
        { name: "Whole Wheat Flour 5kg", value: "₹399", description: "High-fiber quality atta" },
        { name: "Mixed Pulses 3kg", value: "₹799", description: "Packed with protein" },
      ],
      features: [
        "Wholesale pricing on all items",
        "Locally sourced and certified",
        "Delivered fresh every month",
        "Eco packaging",
        "Free delivery always"
      ]
    },
    3: {
      title: "Snacks & Beverages",
      description: "Enjoy monthly treats with chips, cookies, juices & more at unbeatable rates",
      price: "₹1899.00",
      originalPrice: "₹2899.00",
      mrp: "₹3399.00",
      image: "https://images.pexels.com/photos/4791269/pexels-photo-4791269.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.7,
      reviews: 970,
      popular: false,
      deliveryInfo: "Free delivery • Cancel anytime",
      nextDelivery: "Aug 22, 2025",
      items: [
        { name: "Cookies Combo Pack", value: "₹399", description: "Assorted flavors - 1kg" },
        { name: "Chips Family Pack", value: "₹299", description: "10 large packets combo" },
        { name: "Mango Juice Bottles (6)", value: "₹499", description: "Real fruit goodness" },
      ],
      features: [
        "Includes healthy & indulgent snacks",
        "Perfect for family sharing",
        "Sealed for freshness",
        "Delivered chilled",
        "Cancel anytime"
      ]
    }
  };

  const subscription = subscriptionData[subscriptionId as keyof typeof subscriptionData];
  if (!subscription) return <div>Subscription not found</div>;

  const totalItemValue = subscription.items.reduce(
    (sum, item) => sum + parseFloat(item.value.replace('₹', '').replace(',', '')),
    0
  );
  const savingsAmount = (parseFloat(subscription.originalPrice.replace('₹', '')) - parseFloat(subscription.price.replace('₹', ''))).toFixed(2);
  const savingsPercent = Math.round((1 - parseFloat(subscription.price.replace('₹', '')) / parseFloat(subscription.originalPrice.replace('₹', ''))) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-6 flex items-center gap-2 hover:bg-emerald-50">
          <ArrowLeft className="w-4 h-4" />
          Back to Subscriptions
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Section */}
          <div className="space-y-6">
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              src={subscription.image}
              alt={subscription.title}
              className="w-full h-96 object-cover rounded-2xl shadow-xl"
            />

            {subscription.popular && (
              <Badge className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2">
                Most Popular
              </Badge>
            )}

            {/* Features */}
            <Card className="p-6 shadow-lg">
              <CardTitle className="text-xl mb-4 text-gray-900">What's Included</CardTitle>
              <div className="space-y-3">
                {subscription.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{subscription.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{subscription.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-semibold text-gray-900">{subscription.rating}</span>
              <span className="text-gray-600">({subscription.reviews} reviews)</span>
            </div>

            {/* Pricing Summary */}
            <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-gray-900">{subscription.price}</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div className="line-through">MRP: {subscription.mrp}</div>
                  <div className="line-through">Retail: {subscription.originalPrice}</div>
                </div>
              </div>

              <div className="mt-4 bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-emerald-600">You Save: ₹{savingsAmount}</span>
                  <Badge className="bg-emerald-100 text-emerald-800 px-3 py-1 text-sm">{savingsPercent}% OFF</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Total Item Value: ₹{totalItemValue.toFixed(2)} • You Pay: {subscription.price}
                </div>
              </div>
            </Card>

            {/* Delivery Info */}
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                <span>Next delivery: {subscription.nextDelivery}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Cancel anytime</span>
              </div>
            </div>

            {/* Actions */}
            {/* <div className="space-y-3">
              <Button size="lg" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-semibold py-4">
                Subscribe Now – {subscription.price}/month
              </Button>
              <Button variant="outline" size="lg" className="w-full border-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-semibold py-4">
                <Heart className="w-5 h-5 mr-2" />
                Add to Wishlist
              </Button>
            </div> */}
          </div>
        </div>

        {/* Item Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            This Month's <span className="text-emerald-600">Curated Items</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscription.items.map((item, idx) => (
              <Card key={idx} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                    <Badge variant="secondary" className="text-emerald-600 font-semibold">
                      {item.value}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{item.description}</p>
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
