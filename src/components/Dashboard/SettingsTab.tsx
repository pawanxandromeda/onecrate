import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CreditCard, MapPin, Shield, User, Truck, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';
import * as Dialog from '@radix-ui/react-dialog';

// Define types for settings data
interface Address {
  label: string;
  addressLine: string;
  latitude: number;
  longitude: number;
}

interface Settings {
  userId: string;
  deliveryAddresses: Address[];
  notificationPreferences: {
    email: boolean;
    push: boolean;
  };
}

// Define props interface for SettingsErrorBoundary
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// Error Boundary Component
class SettingsErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <p className="text-red-600">An error occurred while loading settings. Please try again.</p>
          </CardContent>
        </Card>
      );
    }
    return this.props.children;
  }
}

const SettingsTab: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    push: false,
  });
  const [newAddress, setNewAddress] = useState({
    label: '',
    addressLine: '',
    latitude: 0,
    longitude: 0,
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: '', phone: '', address: '' });
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDeliveryPrefModalOpen, setIsDeliveryPrefModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch settings on mount
 useEffect(() => {
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch settings');

      const response = await res.json();
      const data: Settings = {
        userId: response?.userId || '',
        deliveryAddresses: response?.deliveryAddresses || [],
        notificationPreferences: response?.notificationPreferences || { email: true, push: false },
      };
      setSettings(data);
      setNotificationPrefs(data.notificationPreferences);
      if (data.deliveryAddresses.length > 0) {
        setNewAddress(data.deliveryAddresses[0]);
      }
    } catch (err) {
      setError('Failed to load settings');
      toast({
        title: 'Error',
        description: 'Could not load settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  fetchSettings();
}, [toast]);


  // Open Profile Modal and fetch user data
  const openProfileModal = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/user/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('Failed to fetch profile');

    const response = await res.json();
    setProfileForm({
      fullName: response.fullName || '',
      phone: response.phone || '',
      address: response.address || '',
    });
    setIsProfileModalOpen(true);
  } catch (err) {
    toast({
      title: 'Error',
      description: 'Failed to load profile data',
      variant: 'destructive',
    });
  }
};


  // Handle profile submit
 const handleProfileSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileForm),
    });

    if (!res.ok) throw new Error('Failed to update profile');
    
    const updated = await res.json(); // Optional: You can use this to update state

    setIsProfileModalOpen(false);
    toast({
      title: 'Success',
      description: 'Profile updated successfully',
    });
  } catch (err) {
    toast({
      title: 'Error',
      description: 'Failed to update profile',
      variant: 'destructive',
    });
  }
};


  // Handle notification preferences update
 const handleNotificationUpdate = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/settings/notifications', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(notificationPrefs),
    });

    if (!res.ok) throw new Error('Failed to update preferences');

    toast({
      title: 'Success',
      description: 'Notification preferences updated successfully',
    });
  } catch (err) {
    toast({
      title: 'Error',
      description: 'Failed to update notification preferences',
      variant: 'destructive',
    });
  }
};

  // Handle delivery address update
  const handleAddressUpdate = async () => {
  if (!newAddress.label || !newAddress.addressLine) {
    toast({
      title: 'Error',
      description: 'Label and address line are required',
      variant: 'destructive',
    });
    return;
  }
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/settings/delivery-address', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newAddress),
    });

    if (!res.ok) throw new Error('Failed to update address');

    setSettings((prev) => ({
      ...prev!,
      deliveryAddresses:
        prev!.deliveryAddresses.length > 0
          ? [newAddress]
          : [...prev!.deliveryAddresses, newAddress],
    }));

    toast({
      title: 'Success',
      description: 'Delivery address updated successfully',
    });
  } catch (err) {
    toast({
      title: 'Error',
      description: 'Failed to update delivery address',
      variant: 'destructive',
    });
  }
};

  // Handle pause all subscriptions
  const handlePauseSubscriptions = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/pause', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({}) // Optional: if backend expects a body
    });

    if (!res.ok) throw new Error('Failed to pause subscriptions');

    const response = await res.json();

    toast({
      title: 'Success',
      description: response.message || 'All subscriptions paused successfully',
    });
  } catch (err: any) {
    toast({
      title: 'Error',
      description: err.message || 'Failed to pause subscriptions',
      variant: 'destructive',
    });
  }
};


  // Handle mock actions for unimplemented features
  const handleMockAction = (title: string, description: string) => {
    toast({ title, description });
  };

  // Handle input changes for address
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: name === 'latitude' || name === 'longitude' ? parseFloat(value) || 0 : value,
    }));
  };

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          title: 'Profile Settings',
          description: 'Update your personal information and preferences',
          action: <Button variant="outline" size="sm" onClick={openProfileModal}>Edit Profile</Button>,
        },
        {
          icon: Shield,
          title: 'Privacy & Security',
          description: 'Manage your privacy settings and account security',
          action: <Button variant="outline" size="sm" onClick={() => setIsPrivacyModalOpen(true)}>Configure</Button>,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          title: 'Email Notifications',
          description: (
            <div className="flex items-center space-x-4">
              <Label htmlFor="email-notif">Receive email updates</Label>
              <Switch
                id="email-notif"
                checked={notificationPrefs.email}
                onCheckedChange={(checked) =>
                  setNotificationPrefs((prev) => ({ ...prev, email: checked }))
                }
              />
            </div>
          ),
          action: (
            <Button variant="outline" size="sm" onClick={handleNotificationUpdate}>
              Save
            </Button>
          ),
        },
        {
          icon: Bell,
          title: 'Push Notifications',
          description: (
            <div className="flex items-center space-x-4">
              <Label htmlFor="push-notif">Receive push notifications</Label>
              <Switch
                id="push-notif"
                checked={notificationPrefs.push}
                onCheckedChange={(checked) =>
                  setNotificationPrefs((prev) => ({ ...prev, push: checked }))
                }
              />
            </div>
          ),
          action: (
            <Button variant="outline" size="sm" onClick={handleNotificationUpdate}>
              Save
            </Button>
          ),
        },
      ],
    },
    {
      title: 'Delivery',
      items: [
        
        {
          icon: MapPin,
          title: 'Delivery Addresses',
          description: (
            <div className="space-y-4">
              {settings && settings.deliveryAddresses && settings.deliveryAddresses.length > 0 ? (
                settings.deliveryAddresses.map((addr, index) => (
                  <div key={index} className="text-sm text-gray-500">
                    {addr.label}: {addr.addressLine} ({addr.latitude}, {addr.longitude})
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No addresses saved</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  name="label"
                  value={newAddress.label}
                  onChange={handleAddressChange}
                  placeholder="e.g., Home"
                />
                <Label htmlFor="addressLine">Address Line</Label>
                <Input
                  id="addressLine"
                  name="addressLine"
                  value={newAddress.addressLine}
                  onChange={handleAddressChange}
                  placeholder="e.g., 123 Main St"
                />
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  value={newAddress.latitude}
                  onChange={handleAddressChange}
                  placeholder="e.g., 12.34"
                />
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  value={newAddress.longitude}
                  onChange={handleAddressChange}
                  placeholder="e.g., 56.78"
                />
              </div>
            </div>
          ),
          action: (
            <Button variant="outline" size="sm" onClick={handleAddressUpdate}>
              Save Address
            </Button>
          ),
        },
        {
          icon: Truck,
          title: 'Delivery Preferences',
          description: 'Set your preferred delivery times and instructions',
          action: <Button variant="outline" size="sm" onClick={() => setIsDeliveryPrefModalOpen(true)}>Configure</Button>,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          title: 'Help & Support',
          description: 'Get help with your account and subscriptions',
          action: <Button variant="outline" size="sm" onClick={() => setIsSupportModalOpen(true)}>Contact Support</Button>,
        },
      ],
    },
  ];

  if (loading) return <div>Loading settings...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!settings) return <div className="text-red-600">Settings data is unavailable. Please try again.</div>;

  return (
    <SettingsErrorBoundary>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8 Cartoon-font"
      >
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Settings</h3>
          <p className="text-gray-600">Manage your account preferences and settings</p>
        </div>

        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h4 className="text-lg font-medium text-gray-900 mb-4">{group.title}</h4>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-0">
                {group.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`flex items-center justify-between p-6 ${
                      itemIndex !== group.items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 mb-1">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </div>
                    {item.action}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-900 mb-1">Pause All Subscriptions</div>
                <div className="text-sm text-gray-500">Temporarily pause all your active subscriptions</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
                onClick={handlePauseSubscriptions}
              >
                Pause All
              </Button>
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <div className="font-medium text-gray-900 mb-1">Delete Account</div>
                <div className="text-sm text-gray-500">Permanently delete your account and all data</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Modal */}
        <Dialog.Root open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <Dialog.Title className="text-lg font-medium">Edit Profile</Dialog.Title>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsProfileModalOpen(false)}>Cancel</Button>
                <Button onClick={handleProfileSubmit}>Save</Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Privacy & Security Modal */}
        <Dialog.Root open={isPrivacyModalOpen} onOpenChange={setIsPrivacyModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <Dialog.Title className="text-lg font-medium">Privacy & Security</Dialog.Title>
              <div className="mt-4">
                <p>Manage your privacy settings and account security here.</p>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsPrivacyModalOpen(false)}>Cancel</Button>
                <Button onClick={() => handleMockAction('Success', 'Password changed successfully')}>Save</Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Payment Methods Modal */}
        <Dialog.Root open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <Dialog.Title className="text-lg font-medium">Payment Methods</Dialog.Title>
              <div className="mt-4">
                <p>Manage your saved payment options and billing here.</p>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">No payment methods saved.</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button>
                <Button onClick={() => handleMockAction('Success', 'Payment method added')}>Add Payment Method</Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Delivery Preferences Modal */}
        <Dialog.Root open={isDeliveryPrefModalOpen} onOpenChange={setIsDeliveryPrefModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <Dialog.Title className="text-lg font-medium">Delivery Preferences</Dialog.Title>
              <div className="mt-4">
                <p>Set your preferred delivery times and instructions.</p>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="deliveryTime">Preferred Delivery Time</Label>
                    <Input id="deliveryTime" placeholder="e.g., 9 AM - 12 PM" />
                  </div>
                  <div>
                    <Label htmlFor="instructions">Delivery Instructions</Label>
                    <Input id="instructions" placeholder="e.g., Leave at the door" />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDeliveryPrefModalOpen(false)}>Cancel</Button>
                <Button onClick={() => handleMockAction('Success', 'Delivery preferences saved')}>Save</Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Help & Support Modal */}
        <Dialog.Root open={isSupportModalOpen} onOpenChange={setIsSupportModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <Dialog.Title className="text-lg font-medium">Contact Support</Dialog.Title>
              <div className="mt-4">
                <p>Get help with your account and subscriptions.</p>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="e.g., Issue with subscription" />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <textarea id="message" className="w-full p-2 border rounded" rows={4}></textarea>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsSupportModalOpen(false)}>Cancel</Button>
                <Button onClick={() => handleMockAction('Success', 'Support request submitted')}>Submit</Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Delete Account Modal */}
        <Dialog.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <Dialog.Title className="text-lg font-medium">Delete Account</Dialog.Title>
              <div className="mt-4">
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={() => handleMockAction('Success', 'Account deleted')}
                >
                  Delete Account
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </motion.div>
    </SettingsErrorBoundary>
  );
};

export default SettingsTab;