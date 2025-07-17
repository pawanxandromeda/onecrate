import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ArrowLeft, CheckCircle, Truck, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubscriptionDetailProps {
  subscriptionId: number;
  onBack: () => void;
  isLoggedIn: boolean;
  onSubscribe: (subscriptionId: number) => void;
}

const SubscriptionDetail = ({ subscriptionId, onBack, isLoggedIn, onSubscribe }: SubscriptionDetailProps) => {
  const subscriptionData = {
    1: {
      title: "Basic Staples Kit",
      description: "Essential kitchen staples at wholesale prices for daily cooking needs",
      price: "₹499.00",
      originalPrice: "₹699.00",
      mrp: "₹714.00",
      image: "/images/aashirvaad-shudh-atta.svg",
      rating: 4.6,
      reviews: 1100,
      popular: true,
      deliveryInfo: "Free delivery • Cancel anytime",
      nextDelivery: "Aug 20, 2025",
      items: [
        { name: "Aashirvaad Shudh Atta 5kg", value: "₹259", description: "High-quality whole wheat flour" },
        { name: "Fortune Rozana Gold Basmati Rice 1kg", value: "₹130", description: "Premium aged basmati rice" },
        { name: "Tata Salt 1kg", value: "₹30", description: "Pure iodized salt" },
        { name: "Fortune Sulphurless Sugar 1kg", value: "₹75", description: "Refined sugar without sulphur" },
        { name: "P Mark Kachi Ghani Mustard Oil 1ltr", value: "₹220", description: "Cold-pressed mustard oil" }
      ],
      features: [
        "Wholesale pricing on essentials",
        "High-quality certified products",
        "Eco-friendly packaging",
        "Fresh monthly deliveries",
        "Free shipping & returns"
      ]
    },
    2: {
      title: "Premium Kitchen Kit",
      description: "Premium cooking essentials with high-quality spices and oils",
      price: "₹1099.00",
      originalPrice: "₹1699.00",
      mrp: "₹1780.00",
      image: "/images/amul-cow-ghee.svg",
      rating: 4.8,
      reviews: 950,
      popular: false,
      deliveryInfo: "Free delivery • Cancel anytime",
      nextDelivery: "Aug 18, 2025",
      items: [
        { name: "Amul Cow Ghee 1ltr", value: "₹685", description: "Pure cow ghee for rich flavor" },
        { name: "India Gate Pure Basmati Rice 5kg", value: "₹490", description: "Premium basmati rice" },
        { name: "Catch Super Garam Masala 200g", value: "₹100", description: "Authentic spice blend" },
        { name: "Saffola Gold Cooking Oil 2ltr", value: "₹449", description: "Healthy blended oil" },
        { name: "Catch Kasuri Methi 50g", value: "₹56", description: "Aromatic dried fenugreek leaves" }
      ],
      features: [
        "Curated premium ingredients",
        "Enhances culinary experience",
        "Eco-friendly packaging",
        "Fresh monthly deliveries",
        "Free shipping & returns"
      ]
    },
    3: {
      title: "Snack Pack",
      description: "Delicious snacks and spreads for your monthly indulgence",
      price: "₹399.00",
      originalPrice: "₹549.00",
      mrp: "₹545.00",
      image: "/images/kissan-mixed-fruit-jam.svg",
      rating: 4.5,
      reviews: 800,
      popular: false,
      deliveryInfo: "Free delivery • Cancel anytime",
      nextDelivery: "Aug 22, 2025",
      items: [
        { name: "Mr Makhana Butter Tomato 20g", value: "₹50", description: "Flavorful roasted makhana" },
        { name: "Whole Farm Premium Raw Peanuts 200g", value: "₹65", description: "Fresh raw peanuts" },
        { name: "Kissan Mixed Fruit Jam 200g", value: "₹90", description: "Sweet and tangy fruit jam" },
        { name: "Maggi Hot & Sweet Tomato Chilli Sauce 900g", value: "₹130", description: "Spicy tomato sauce" },
        { name: "Whole Farm Grocery Makhana 100g", value: "₹210", description: "Light and healthy snack" }
      ],
      features: [
        "Mix of healthy & indulgent snacks",
        "Perfect for family sharing",
        "Sealed for freshness",
        "Delivered chilled",
        "Free shipping & returns"
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
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-semibold py-4"
                onClick={() => onSubscribe(subscriptionId)}
              >
                Subscribe Now – {subscription.price}/month
              </Button>
              {/* <Button variant="outline" size="lg" className="w-full border-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-semibold py-4">
                <Heart className="w-5 h-5 mr-2" />
                Add to Wishlist
              </Button> */}
            </div>
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