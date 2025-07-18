import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api'; // Your axios instance
import { toast } from 'sonner';

const SubscriptionsTab = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/subscriptionsget', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubscriptions(res.data.subscriptions);
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to fetch subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (loading) {
    return <div className="text-center text-sm text-gray-500 py-4">Loading subscriptions...</div>;
  }

  if (subscriptions.length === 0) {
    return <div className="text-center text-sm text-gray-500 py-4">You have no active subscriptions.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Your Subscriptions</h3>
        <Button className="bg-gray-900 hover:bg-gray-800 text-white">
          <Package className="w-4 h-4 mr-2" />
          New Subscription
        </Button>
      </div>

      <div className="space-y-4">
        {subscriptions.map((subscription) => (
          <Card key={subscription._id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{subscription.subscriptionName}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Next: N/A</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  {subscription.paymentStatus === 'completed' ? 'Active' : 'Pending'}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-lg font-semibold text-gray-900">₹{subscription.grandTotal}</span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    Saving ₹{subscription.totalSavings}/month
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Pause
                  </Button>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500 mb-2">Items in this kit:</div>
                <div className="flex flex-wrap gap-2">
                  {subscription.items?.map((item: any, index: number) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default SubscriptionsTab;
