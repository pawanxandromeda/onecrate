import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Star, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../context/AuthContext';


interface PrebuiltKit {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  savings: number;
  rating: number;
  items: string[];
  popular?: boolean;
}

interface Product {
  id: number;
  name: string;
  price: number;
  mrp: number;
  unit: string;
  image: string;
}

interface KitBuilderTabProps {
  setActiveTab: (tabId: string) => void;
  onSubscribe?: (kitId: number) => void;
}

const PLATFORM_FEE = 50; // Example platform fee
const targetThreshold = 500; // Example threshold for savings prompt

const KitBuilderTab: React.FC<KitBuilderTabProps> = ({ setActiveTab, onSubscribe }) => {
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [subscriptionName, setSubscriptionName] = useState('');
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Example products for custom kit (replace with actual data source)
  const products: Product[] = [
    { id: 1, name: 'Aashirvaad Shudh Atta 5kg', price: 250, mrp: 300, unit: '5kg', image: '/images/atta.jpg' },
    { id: 2, name: 'Fortune Rozana Gold Basmati Rice 1kg', price: 100, mrp: 120, unit: '1kg', image: '/images/rice.jpg' },
    { id: 3, name: 'Tata Salt 1kg', price: 20, mrp: 25, unit: '1kg', image: '/images/salt.jpg' },
    // Add more products as needed
  ];

  const prebuiltKits: PrebuiltKit[] = [
    {
      id: 1,
      name: "Basic Staples Kit",
      description: "Essential kitchen staples at wholesale prices for daily cooking needs",
      price: 499,
      originalPrice: 699,
      savings: 200,
      rating: 4.6,
      items: [
        "Aashirvaad Shudh Atta 5kg",
        "Fortune Rozana Gold Basmati Rice 1kg",
        "Tata Salt 1kg",
        "Fortune Sulphurless Sugar 1kg",
        "P Mark Kachi Ghani Mustard Oil 1ltr"
      ],
      popular: true,
    },
    {
      id: 2,
      name: "Premium Kitchen Kit",
      description: "Premium cooking essentials with high-quality spices and oils",
      price: 1099,
      originalPrice: 1699,
      savings: 600,
      rating: 4.8,
      items: [
        "Amul Cow Ghee 1ltr",
        "India Gate Pure Basmati Rice 5kg",
        "Catch Super Garam Masala 200g",
        "Saffola Gold Cooking Oil 2ltr",
        "Catch Kasuri Methi 50g"
      ],
      popular: false,
    },
    {
      id: 3,
      name: "Snack Pack",
      description: "Delicious snacks and spreads for your monthly indulgence",
      price: 399,
      originalPrice: 549,
      savings: 150,
      rating: 4.5,
      items: [
        "Mr Makhana Butter Tomato 20g",
        "Whole Farm Premium Raw Peanuts 200g",
        "Kissan Mixed Fruit Jam 200g",
        "Maggi Hot & Sweet Tomato Chilli Sauce 900g",
        "Whole Farm Grocery Makhana 100g"
      ],
      popular: false,
    },
    {
      id: 4,
      name: "Healthy Cooking Kit",
      description: "Healthy ingredients for nutritious and flavorful meals",
      price: 649,
      originalPrice: 975,
      savings: 326,
      rating: 4.7,
      items: [
        "Saffola Gold Cooking Oil 2ltr",
        "India Gate Pure Basmati Rice 5kg",
        "Tata Salt 1kg",
        "Catch Kasuri Methi 50g"
      ],
      popular: false,
    },
    {
      id: 5,
      name: "Family Essentials Kit",
      description: "Must-have staples for family cooking and breakfast needs",
      price: 449,
      originalPrice: 649,
      savings: 200,
      rating: 4.4,
      items: [
        "Aashirvaad Shudh Atta 5kg",
        "Fortune Sulphurless Sugar 1kg",
        "P Mark Kachi Ghani Mustard Oil 1ltr",
        "Kissan Mixed Fruit Jam 200g",
        "Tata Salt 1kg"
      ],
      popular: false,
    },
  ];

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Cart helper functions
  const getTotalItems = () => Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const getTotalPrice = () => Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id === parseInt(id));
    return sum + (product?.price || 0) * qty;
  }, 0);
  const getTotalMRP = () => Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id === parseInt(id));
    return sum + (product?.mrp || 0) * qty;
  }, 0);
  const getTotalSavings = () => getTotalMRP() - getTotalPrice();
  const addToCart = (productId: number) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };
  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId] -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };
  const clearCart = () => setCart({});

  const difference = targetThreshold - getTotalPrice();

  const handleCheckout = async () => {
    if (!subscriptionName.trim()) {
      toast({
        title: 'Subscription Name Required',
        description: 'Please enter a subscription name.',
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token || !isLoggedIn) {
      toast({
        title: 'Login Required',
        description: 'Please log in or sign up to subscribe.',
        variant: 'destructive',
        duration: 3000,
      });
      if (typeof onSubscribe === 'function') {
        onSubscribe(0); // Trigger login modal via parent
      }
      return;
    }

    setIsSubmitting(true);

    const subscriptionData = {
      subscriptionName,
      items: Object.entries(cart).map(([id, qty]) => {
        const product = products.find((p) => p.id === parseInt(id));
        return {
          productId: parseInt(id),
          name: product?.name,
          quantity: qty,
          price: product?.price,
          mrp: product?.mrp,
          unit: product?.unit,
        };
      }),
      totalItems: getTotalItems(),
      subtotal: getTotalPrice(),
      platformFee: PLATFORM_FEE,
      totalMRP: getTotalMRP(),
      totalSavings: getTotalSavings(),
      grandTotal: getTotalPrice() + PLATFORM_FEE,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('https://onecrate-backend.onrender.com/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create subscription');
      }

      const result = await response.json();
      const { razorpaySubscription, razorpayKeyId } = result;

      setIsCheckoutOpen(false);

      const options = {
        key: razorpayKeyId,
        subscription_id: razorpaySubscription.id,
        name: '12 Crate',
        description: `Subscription: ${subscriptionName}`,
        image: '/logo.svg',
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch('https://onecrate-backend.onrender.com/api/subscriptions/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.message || 'Payment verification failed');
            }

            toast({
              title: 'Subscription Successful',
              description: `Successfully subscribed to ${subscriptionName} for ₹${getTotalPrice() + PLATFORM_FEE}`,
            });
            setCart({});
            setSubscriptionName('');
            window.location.href = '/#profile';
          } catch (error: any) {
            toast({
              title: 'Payment Failed',
              description: error.message || 'Payment verification failed. Please try again.',
              variant: 'destructive',
              duration: 3000,
            });
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#059669',
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

      razorpay.on('payment.failed', (response: any) => {
        toast({
          title: 'Payment Failed',
          description: response.error.description || 'Payment failed. Please try again.',
          variant: 'destructive',
          duration: 3000,
        });
      });
    } catch (error: any) {
      toast({
        title: 'Subscription Error',
        description: error.message || 'Failed to create subscription. Please try again.',
        variant: 'destructive',
        duration: 3000,
      });
      console.error('Subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubscribe = async (kit: PrebuiltKit) => {
    if (!isLoggedIn) {
      if (typeof onSubscribe === 'function') {
        onSubscribe(kit.id);
      } else {
        toast({
          title: 'Login Required',
          description: 'Please log in or sign up to subscribe.',
          variant: 'destructive',
          duration: 3000,
        });
      }
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: 'Authentication Error',
        description: 'Authentication token not found. Please log in again.',
        variant: 'destructive',
        duration: 3000,
      });
      if (typeof onSubscribe === 'function') {
        onSubscribe(kit.id);
      }
      return;
    }

    const subscriptionData = {
      subscriptionName: kit.name,
      items: kit.items.map((item, index) => ({
        productId: kit.id * 100 + index, // Generate unique product IDs
        name: item,
        quantity: 1,
        price: kit.price / kit.items.length, // Approximate price per item
        mrp: kit.originalPrice / kit.items.length, // Approximate MRP per item
        unit: 'unit',
      })),
      totalItems: kit.items.length,
      subtotal: kit.price,
      platformFee: PLATFORM_FEE,
      totalMRP: kit.originalPrice,
      totalSavings: kit.savings,
      grandTotal: kit.price + PLATFORM_FEE,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('https://onecrate-backend.onrender.com/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create subscription');
      }

      const result = await response.json();
      const { razorpaySubscription, razorpayKeyId } = result;

      const options = {
        key: razorpayKeyId,
        subscription_id: razorpaySubscription.id,
        name: '12 Crate',
        description: `Subscription: ${kit.name}`,
        image: '/logo.svg',
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch('https://onecrate-backend.onrender.com/api/subscriptions/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.message || 'Payment verification failed');
            }

            toast({
              title: 'Subscription Successful',
              description: `Successfully subscribed to ${kit.name} for ₹${kit.price + PLATFORM_FEE}`,
            });
            window.location.href = '/#profile';
          } catch (error: any) {
            toast({
              title: 'Payment Failed',
              description: error.message || 'Payment verification failed. Please try again.',
              variant: 'destructive',
              duration: 3000,
            });
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#059669',
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

      razorpay.on('payment.failed', (response: any) => {
        toast({
          title: 'Payment Failed',
          description: response.error.description || 'Payment failed. Please try again.',
          variant: 'destructive',
          duration: 3000,
        });
      });
    } catch (error: any) {
      toast({
        title: 'Subscription Error',
        description: error.message || 'Failed to create subscription. Please try again.',
        variant: 'destructive',
        duration: 3000,
      });
      console.error('Subscription error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Prebuilt Kits</h3>
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {prebuiltKits.length} Available
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            onClick={() => setIsCheckoutOpen(true)} // Open checkout dialog for custom kit
            className="bg-gray-100 border-2 border-dashed border-gray-300 hover:border-gray-500 cursor-pointer transition-all hover:shadow-lg flex items-center justify-center p-8"
          >
            <CardContent className="flex flex-col items-center text-center">
              <Plus className="w-8 h-8 text-gray-700 mb-2" />
              <h4 className="text-lg font-semibold text-gray-800 mb-1">Create Your Own Kit</h4>
              <p className="text-sm text-gray-600">Choose products and build your custom kit</p>
            </CardContent>
          </Card>

          {prebuiltKits.map((kit) => (
            <Card key={kit.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{kit.name}</h4>
                      {kit.popular && (
                        <Badge className="bg-gray-900 text-white text-xs">Popular</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{kit.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{kit.rating}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-600">{kit.items.length} items</span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl font-bold text-gray-900">₹{kit.price}</span>
                    <span className="text-sm text-gray-500 line-through">₹{kit.originalPrice}</span>
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    Save ₹{kit.savings} ({Math.round((kit.savings / kit.originalPrice) * 100)}% off)
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Includes:</div>
                  <div className="flex flex-wrap gap-1">
                    {kit.items.slice(0, 3).map((item, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {item}
                      </span>
                    ))}
                    {kit.items.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{kit.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                  onClick={() => handleSubscribe(kit)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Subscribe to Kit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-3 sm:p-4">
            <DialogTitle className="text-lg sm:text-xl font-bold text-white">Your Subscription Cart</DialogTitle>
            <p className="text-xs text-emerald-100">Enter a subscription name and review your items</p>
          </DialogHeader>
          <div className="p-3 sm:p-4 bg-gray-50">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Name</label>
              <Input
                value={subscriptionName}
                onChange={(e) => setSubscriptionName(e.target.value)}
                placeholder="Enter subscription name (e.g., Monthly Groceries)"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm text-gray-900 text-sm"
              />
            </div>
            <div className="max-h-[40vh] overflow-y-auto">
              {getTotalItems() === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-2 sm:mb-3" />
                  <p className="text-sm sm:text-base font-medium text-gray-600">Your cart is empty</p>
                  <p className="text-xs text-gray-400">Add some items to start shopping!</p>
                </div>
              ) : (
                <>
                  {Object.entries(cart).map(([id, qty]) => {
                    const product = products.find((p) => p.id === parseInt(id));
                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-between items-center p-2 sm:p-3 rounded-xl bg-white shadow-sm mb-2 border border-gray-100"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 flex-1">
                          <div className="bg-gray-100 rounded-xl p-1 sm:p-2">
                            <img
                              src={product?.image}
                              alt={product?.name}
                              className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-1">{product?.name}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              <span className="font-medium">₹{product?.price}</span> × {qty} •{' '}
                              <span className="text-gray-400 line-through">₹{product?.mrp}</span>
                            </div>
                            <div className="text-xs text-emerald-600 font-medium mt-1">
                              Saving ₹{(product?.mrp - product?.price) * qty} ({Math.round(((product?.mrp - product?.price) / product?.mrp) * 100)}%)
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromCart(Number(id))}
                            className="rounded-full border-gray-200 hover:bg-gray-100 p-1"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 text-center font-semibold text-gray-900 text-xs sm:text-sm">{qty}</span>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-1"
                            onClick={() => addToCart(Number(id))}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
          {getTotalItems() > 0 && (
            <div className="p-3 sm:p-4 bg-white border-t border-gray-100">
              {difference > 0 && difference < 500 && (
                <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center">
                  <span className="text-emerald-700 text-xs font-medium">
                    Add an item worth ₹{Math.ceil(difference)} more to reach ₹{targetThreshold} and unlock additional savings!
                  </span>
                </div>
              )}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium text-xs sm:text-sm">Discounted ({getTotalItems()} items price)</span>
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm">₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium text-xs sm:text-sm">Platform Fee</span>
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm">₹{PLATFORM_FEE}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium text-xs sm:text-sm">Total MRP</span>
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm">₹{getTotalMRP()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-600 font-semibold text-xs sm:text-sm">Total Savings</span>
                  <span className="font-semibold text-emerald-600 text-xs sm:text-sm">₹{getTotalSavings()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 sm:pt-3 border-t border-gray-200">
                  <span className="text-sm sm:text-base font-bold text-gray-900">Grand Total</span>
                  <span className="text-sm sm:text-base font-bold text-emerald-600">₹{getTotalPrice() + PLATFORM_FEE}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="p-3 sm:p-4 bg-white border-t border-gray-100 flex justify-between">
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-500 border-red-200 hover:bg-red-50 px-3 sm:px-4 py-1 sm:py-2 rounded-xl font-semibold text-xs sm:text-sm"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Clear Cart
            </Button>
            <Button
              onClick={handleCheckout}
              disabled={getTotalItems() === 0 || isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all duration-200 disabled:opacity-50"
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {isSubmitting ? 'Processing...' : 'Create Subscription'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default KitBuilderTab;