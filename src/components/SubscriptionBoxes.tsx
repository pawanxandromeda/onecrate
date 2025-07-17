import React from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  ShoppingCart,
  Heart,
  Clock,
  Package,
  Sparkles,
  ArrowRight,
  Check,
  IndianRupee
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscriptionBoxesProps {
  onSubscriptionClick?: (subscriptionId: number) => void;
  isLoggedIn: boolean;
  onSubscribe: (subscriptionId: number) => void;
}

const SubscriptionBoxes = ({ onSubscriptionClick, isLoggedIn, onSubscribe }: SubscriptionBoxesProps) => {
  const subscriptionBoxes = [
    {
      id: 1,
      title: "Basic Staples Kit",
      description: "Essential kitchen staples at wholesale prices for daily cooking needs",
      price: "₹499.00",
      originalPrice: "₹699.00",
      image: "/images/aashirvaad-shudh-atta.svg",
      rating: 4.6,
      reviews: 1100,
      popular: true,
      items: [
        "Aashirvaad Shudh Atta 5kg",
        "Fortune Rozana Gold Basmati Rice 1kg",
        "Tata Salt 1kg",
        "Fortune Sulphurless Sugar 1kg",
        "P Mark Kachi Ghani Mustard Oil 1ltr"
      ],
      savings: "30% OFF",
      itemSavings: "Save ₹10-₹50 per item"
    },
    {
      id: 2,
      title: "Premium Kitchen Kit",
      description: "Premium cooking essentials with high-quality spices and oils",
      price: "₹1099.00",
      originalPrice: "₹1699.00",
      image: "/images/amul-cow-ghee.svg",
      rating: 4.8,
      reviews: 950,
      popular: false,
      items: [
        "Amul Cow Ghee 1ltr",
        "India Gate Pure Basmati Rice 5kg",
        "Catch Super Garam Masala 200g",
        "Saffola Gold Cooking Oil 2ltr",
        "Catch Kasuri Methi 50g"
      ],
      savings: "35% OFF",
      itemSavings: "Save ₹20-₹100 per item"
    },
    {
      id: 3,
      title: "Snack Pack",
      description: "Delicious snacks and spreads for your monthly indulgence",
      price: "₹399.00",
      originalPrice: "₹549.00",
      image: "/images/kissan-mixed-fruit-jam.svg",
      rating: 4.5,
      reviews: 800,
      popular: false,
      items: [
        "Mr Makhana Butter Tomato 20g",
        "Whole Farm Premium Raw Peanuts 200g",
        "Kissan Mixed Fruit Jam 200g",
        "Maggi Hot & Sweet Tomato Chilli Sauce 900g",
        "Whole Farm Grocery Makhana 100g"
      ],
      savings: "30% OFF",
      itemSavings: "Save ₹10-₹40 per item"
    }
  ];

  const gridClass =
    subscriptionBoxes.length === 1
      ? 'flex justify-center'
      : 'grid md:grid-cols-2 lg:grid-cols-3 gap-10';

  return (
    <section id="subscriptions" className="py-24 bg-gradient-to-br from-gray-50 via-white to-emerald-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Heading */}
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
            <span>Smart Savings Plans</span>
            <Sparkles className="w-4 h-4 text-teal-600" />
          </motion.div>

          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Save More with{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Wholesale Rates
            </span>
          </h2>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Get everything you need at wholesale prices with free delivery. No hidden charges, taxes included,
            and significant savings on every item delivered monthly.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className={gridClass}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {subscriptionBoxes.map((box) => (
            <motion.div key={box.id} className="max-w-md w-full">
              <div
                className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 bg-white cursor-pointer"
                onClick={() => onSubscriptionClick?.(box.id)}
              >
                {/* Badge */}
                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg flex flex-col items-center">
                    <span className="text-xs">WHOLESALE</span>
                    <span>{box.savings}</span>
                  </div>
                </div>

                {/* Image */}
                <img src={box.image} alt={box.title} className="w-full h-64 object-cover" />

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {box.title}
                    </h3>
                    <div className="flex items-center text-yellow-500 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 mr-1" />
                      {box.rating} ({box.reviews})
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">{box.description}</p>

                  {/* Wholesale Benefits */}
                  <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="flex items-center space-x-2 text-emerald-700 font-semibold mb-2">
                      <IndianRupee className="w-4 h-4" />
                      <span>WHOLESALE BENEFITS</span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-emerald-500 mr-2 mt-1" />
                        {box.itemSavings} compared to retail
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-emerald-500 mr-2 mt-1" />
                        Free delivery - no extra charges
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-emerald-500 mr-2 mt-1" />
                        All taxes included in price
                      </li>
                    </ul>
                  </div>

                  {/* Sample Savings */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Sample Savings:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {box.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-600">
                          <span className="flex items-center">
                            <Check className="w-4 h-4 text-emerald-500 mr-2" />
                            {item}
                          </span>
                          <span className="text-emerald-600 font-medium">Save ₹{10 + idx * 10}</span>
                        </div>
                      ))}
                      <div className="text-sm text-emerald-600 font-medium mt-2">
                        + more items with similar savings
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-900">{box.price}</span>
                      <span className="text-lg text-gray-500 line-through">{box.originalPrice}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">all inclusive</div>
                      <div className="text-sm font-semibold text-emerald-600 flex items-center">
                        <Check className="w-4 h-4 mr-1" /> Free delivery
                      </div>
                    </div>
                  </div>

                  {/* Subscribe Button */}
                  <Button
                    size="lg"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering onSubscriptionClick
                      onSubscribe(box.id);
                    }}
                  >
                    Subscribe Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Savings Summary */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-100"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How You Save with Our Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-5xl font-bold text-emerald-600 mb-2">30-40%</div>
                <div className="text-lg font-medium text-gray-800">Wholesale Discounts</div>
                <p className="text-gray-600 mt-2">On every item compared to retail prices</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-5xl font-bold text-emerald-600 mb-2">₹0</div>
                <div className="text-lg font-medium text-gray-800">Delivery Charges</div>
                <p className="text-gray-600 mt-2">Free shipping with no minimum order</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-5xl font-bold text-emerald-600 mb-2">100%</div>
                <div className="text-lg font-medium text-gray-800">Taxes Included</div>
                <p className="text-gray-600 mt-2">No hidden fees or extra charges</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SubscriptionBoxes; 