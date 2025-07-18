import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Plus, Minus, ShoppingCart, Filter, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/user';
import AuthModal from '../AuthModal';

// Types
interface Category {
  id: string;
  name: string;
  count: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  mrp: number;
  price: number;
  unit: string;
  rating: number;
  image: string;
}

interface Cart {
  [productId: number]: number;
}

interface User {
  id?: string | number;
  name?: string;
  email?: string;
  phone?: string;
}

const PLATFORM_FEE = 99;

// Function to load Razorpay SDK dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
};

const ProductsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [cart, setCart] = useState<Cart>({});
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [subscriptionName, setSubscriptionName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user] = useAtom(userAtom);

  const categories: Category[] = [
    { id: 'all', name: 'All Products', count: 100 },
    { id: 'kitchen', name: 'Kitchen', count: 100 },
  ];

  const subcategories = [
    { id: 'all', name: 'All Subcategories' },
    { id: 'atta', name: 'Atta' },
    { id: 'rice', name: 'Rice' },
    { id: 'oils', name: 'Oils' },
    { id: 'ghee', name: 'Ghee' },
    { id: 'spices', name: 'Spices' },
    { id: 'salt_sugar', name: 'Salt & Sugar' },
    { id: 'sauces_spreads', name: 'Sauces & Spreads' },
    { id: 'dishwash', name: 'Dishwash' },
  ];

  const products: Product[] = [
    // Sample products (unchanged from original)
    { id: 1, name: 'Aashirvaad Shudh Atta', category: 'kitchen', subcategory: 'atta', mrp: 2, price: Math.round(2 * 0.92), unit: '5 kg', rating: 4.5, image: '/images/aashirvaad-shudh-atta.svg' },
    // ... (include all other products as in the original code)
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'all' || product.subcategory === selectedSubcategory;
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const addToCart = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
    toast.success(`Added ${product?.name} to cart`, { duration: 2000 });
  };

  const removeFromCart = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (cart[productId] > 0) {
      setCart((prev) => ({
        ...prev,
        [productId]: Math.max((prev[productId] || 0) - 1, 0),
      }));
      if (cart[productId] === 1) {
        toast.info(`Removed ${product?.name} from cart`, { duration: 2000 });
      }
    }
  };

  const clearCart = () => {
    setCart({});
    setSubscriptionName('');
    toast.warning("Cart cleared", { duration: 2000 });
    setIsCheckoutOpen(false);
  };

  const getTotalItems = (): number =>
    Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const getTotalPrice = (): number =>
    Object.entries(cart).reduce((total, [id, qty]) => {
      const product = products.find((p) => p.id === parseInt(id));
      return total + (product ? product.price * qty : 0);
    }, 0);

  const getTotalMRP = (): number =>
    Object.entries(cart).reduce((total, [id, qty]) => {
      const product = products.find((p) => p.id === parseInt(id));
      return total + (product ? product.mrp * qty : 0);
    }, 0);

  const getTotalSavings = (): number => getTotalMRP() - getTotalPrice();

  const getSuggestedAddition = () => {
    const currentTotal = getTotalPrice() + PLATFORM_FEE;
    const targetThreshold = Math.ceil(currentTotal / 500) * 500;
    const difference = targetThreshold - currentTotal;
    return { difference, targetThreshold };
  };

  const handleReviewAndCheckout = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const handleCheckout = async () => {
    if (!subscriptionName.trim()) {
      toast.error("Please enter a subscription name", { duration: 3000 });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found. Please log in again.", { duration: 3000 });
      setIsAuthModalOpen(true);
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
    };

    try {
      await loadRazorpayScript();

      // Step 1: Send subscription data to backend to create Razorpay Subscription
      const response = await fetch('https://onecrate-backend.onrender.com/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(subscriptionData), // Send subscriptionData directly
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create Razorpay subscription');
      }

      const { razorpaySubscription, razorpayKeyId, subscription } = await response.json();

      setIsCheckoutOpen(false); // Close modal if open

      const options = {
        key: razorpayKeyId,
        subscription_id: razorpaySubscription.id,
        name: 'OneCrate Essentials',
        description: `Subscription: ${subscriptionName}`,
        image: '/logo.svg',
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('https://onecrate-backend.onrender.com/api/subscriptions/verify-payment', {
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

            if (!verifyRes.ok) {
              const errorData = await verifyRes.json();
              throw new Error(errorData.message || 'Payment verification failed');
            }

            toast.success(`Subscription created successfully for ₹${subscriptionData.grandTotal}/month`, {
              duration: 3000,
            });
            setCart({});
            setSubscriptionName('');
          } catch (error) {
            toast.error(error.message || 'Verification failed. Try again.', { duration: 3000 });
            console.error('Verification Error:', error);
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#059669',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.message || "Subscription creation failed. Try again.", { duration: 3000 });
      console.error('Checkout Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFilter = () => {
    setSelectedSubcategory('all');
    toast.info("Subcategory filter removed", { duration: 2000 });
  };

  const { difference, targetThreshold } = getSuggestedAddition();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 bg-gradient-to-b from-gray-50 to-white"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Browse Our Products</h3>
        {getTotalItems() > 0 && (
          <div className="flex items-center space-x-3">
            <div className="text-sm sm:text-base font-semibold text-gray-700">
              <span className="text-emerald-600">{getTotalItems()}</span> items • ₹<span className="text-emerald-600">{getTotalPrice()}</span>
            </div>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-6 py-2 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 shadow-md"
              onClick={handleReviewAndCheckout}
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Review & Checkout
            </Button>
          </div>
        )}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for products..."
            className="w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm text-gray-900 placeholder-gray-400 text-sm sm:text-base transition-all duration-200"
          />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 sm:py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-medium shadow-sm text-sm sm:text-base transition-all duration-200"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            Filters
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 sm:py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-medium shadow-sm text-sm sm:text-base transition-all duration-200"
            onClick={handleRemoveFilter}
            disabled={selectedSubcategory === 'all'}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
            Remove Filter
          </Button>
        </div>
      </div>

      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[90vw] max-w-md rounded-2xl p-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">Filter Products</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2 mt-4">
            {subcategories.map((sub) => (
              <Button
                key={sub.id}
                variant={selectedSubcategory === sub.id ? 'default' : 'outline'}
                className={`w-full text-left justify-start px-4 py-2 rounded-xl text-sm sm:text-base ${
                  selectedSubcategory === sub.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setSelectedSubcategory(sub.id);
                  setIsFilterOpen(false);
                }}
              >
                {sub.name}
              </Button>
            ))}
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(false)}
              className="text-gray-700 border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCategory(c.id);
              setSelectedSubcategory('all');
            }}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${
              selectedCategory === c.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {c.name} <span className="opacity-80">({c.count})</span>
          </button>
        ))}
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white border border-gray-200 rounded-2xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                <div className="flex flex-col items-center mb-3 sm:mb-4 flex-grow">
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-28 h-28 sm:w-36 sm:h-36 mx-auto object-contain rounded-lg"
                    />
                  </div>
                  <h4 className="font-semibold text-base sm:text-lg text-gray-900 text-center mb-2 line-clamp-2">{product.name}</h4>
                  <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">{product.unit}</p>

                  <div className="mt-auto w-full">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-lg sm:text-xl font-bold text-gray-900">₹{product.price}</span>
                          <span className="text-xs sm:text-sm text-gray-400 line-through">₹{product.mrp}</span>
                        </div>
                        <div className="text-xs font-medium text-emerald-600">
                          Save ₹{product.mrp - product.price} ({Math.round(((product.mrp - product.price) / product.mrp) * 100)}%)
                        </div>
                      </div>
                      <div className="flex items-center bg-amber-100 px-2 sm:px-2.5 py-1 rounded-full">
                        <span className="text-amber-700 text-xs sm:text-sm font-medium">★ {product.rating}</span>
                      </div>
                    </div>

                    {cart[product.id] ? (
                      <div className="flex items-center justify-between bg-gray-100 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(product.id)}
                          className="rounded-full hover:bg-gray-200"
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">{cart[product.id]}</span>
                        <Button
                          size="icon"
                          onClick={() => addToCart(product.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="lg"
                        onClick={() => addToCart(product.id)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 sm:py-2.5 rounded-xl font-semibold text-sm sm:text-base shadow-sm transition-all duration-200"
                      >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> Add to Cart
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Checkout Dialog */}
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
                  <span className="text-sm sm:text-base font-bold text-gray-900">Grand Total (Monthly)</span>
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
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Clear Cart
            </Button>
            <Button
              onClick={handleCheckout}
              disabled={getTotalItems() === 0 || isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all duration-200 disabled:opacity-50"
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> {isSubmitting ? 'Processing...' : 'Create Subscription'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsCheckoutOpen(true)}
      />
    </motion.div>
  );
};

export default ProductsTab;