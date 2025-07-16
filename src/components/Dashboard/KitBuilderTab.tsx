import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

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

interface KitBuilderTabProps {
  setActiveTab: (tabId: string) => void;
}

const KitBuilderTab: React.FC<KitBuilderTabProps> = ({ setActiveTab }) => {
  const prebuiltKits: PrebuiltKit[] = [
    {
      id: 1,
      name: "Essential Kitchen Starter",
      description: "Perfect for new households with all kitchen basics",
      price: 899,
      originalPrice: 1200,
      savings: 301,
      rating: 4.8,
      items: ["Basmati Rice 1kg", "Toor Dal 500g", "Cooking Oil 1L", "Wheat Atta 1kg", "Turmeric Powder", "Salt"],
      popular: true,
    },
  ];

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

                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Subscribe to Kit
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Create Custom Kit Card */}
          <Card
            onClick={() => setActiveTab('products')}
            className="bg-gray-100 border-2 border-dashed border-gray-300 hover:border-gray-500 cursor-pointer transition-all hover:shadow-lg flex items-center justify-center p-8"
          >
            <CardContent className="flex flex-col items-center text-center">
              <Plus className="w-8 h-8 text-gray-700 mb-2" />
              <h4 className="text-lg font-semibold text-gray-800 mb-1">Create Your Own Kit</h4>
              <p className="text-sm text-gray-600">Choose products and build your custom kit</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default KitBuilderTab;
