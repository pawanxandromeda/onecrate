import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { User, Package, Settings, Heart, CreditCard, Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';

import SubscriptionsTab from './Dashboard/SubscriptionsTab';
import ProductsTab from './Dashboard/ProductsTab';
import KitBuilderTab from './Dashboard/KitBuilderTab';
import SettingsTab from './Dashboard/SettingsTab';
import WishlistTab from './Dashboard/WishlistTab';
import ProfileTab from './Dashboard/ProfileTab';
import api from '@/lib/api';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [analytics, setAnalytics] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    memberSince: "January 2024",
    subscriptions: 0,
    totalSavings: 0,
    totalSpend: 0,
    avgSavings: 0,
    lastSubscription: "N/A"
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'subscriptions', name: 'Subscriptions', icon: CreditCard },
    { id: 'products', name: 'Products', icon: Search },
    { id: 'kit-builder', name: 'Kit Builder', icon: Package },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />;
      case 'subscriptions': return <SubscriptionsTab />;
      case 'products': return <ProductsTab />;
      case 'kit-builder': return <KitBuilderTab setActiveTab={setActiveTab} />;
      case 'settings': return <SettingsTab />;
      case 'wishlist': return <WishlistTab />;
      default: return <ProfileTab />;
    }
  };

  useEffect(() => {
    const fetchSubscriptionAnalytics = async () => {
    

      try {
      const token = localStorage.getItem('token');
        const res = await api.get('/subscriptionsget', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const subscriptions = res.data.subscriptions;
        console.log(subscriptions)

     
        if (!Array.isArray(subscriptions) || subscriptions.length === 0) return;

        const totalSavings = subscriptions.reduce((acc, sub) => acc + (sub.totalSavings || 0), 0);
        const totalSpend = subscriptions.reduce((acc, sub) => acc + (sub.grandTotal || 0), 0);
        const avgSavings = subscriptions.length ? Math.round(totalSavings / subscriptions.length) : 0;
        const lastDate = new Date(subscriptions[0].createdAt).toLocaleDateString();

        setAnalytics(prev => ({
          ...prev,
          subscriptions: subscriptions.length,
          totalSavings,
          totalSpend,
          avgSavings,
          lastSubscription: lastDate,
        }));

      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch subscription data.");
      }
    };

    fetchSubscriptionAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">SubscriptionHub</h1>
                <p className="text-sm text-gray-500">Premium Member</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{analytics.name}</div>
                <div className="text-xs text-gray-500">Member since {analytics.memberSince}</div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">

          {/* Analytics Cards */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6 text-center">
                <Package className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{analytics.subscriptions}</div>
                <div className="text-sm text-gray-600">Active Subscriptions</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6 text-center">
                <CreditCard className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">₹{analytics.totalSavings.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Savings</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6 text-center">
                <CreditCard className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">₹{analytics.totalSpend.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Spend</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">₹{analytics.avgSavings.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Avg Savings/Subscription</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
              <div className="flex space-x-1 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline text-sm">{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div variants={itemVariants}>
            {renderTabContent()}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;
