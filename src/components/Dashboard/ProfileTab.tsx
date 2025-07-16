import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Edit3, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Address {
  houseNo: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface UserInfo {
  fullName: string;
  email: string;
  phone: string;
  address: Address;
  memberSince: string;
}

const ProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: {
      houseNo: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    memberSince: '',
  });

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: {
      houseNo: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('https://onecrate-backend.onrender.com/api/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        setUserInfo(data);
        setFormData({
          fullName: data.fullName || '',
          phone: data.phone || '',
          address: data.address || {
            houseNo: '',
            street: '',
            landmark: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
          },
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch('https://onecrate-backend.onrender.com/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Unauthorized');
      const updated = await res.json();
      setUserInfo({ ...userInfo, ...updated });
      setIsEditing(false);
      toast.success("Profile info updated.");
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [addressField]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100">
          <CardTitle className="text-xl font-semibold text-gray-900">Profile Information</CardTitle>
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ProfileField
                icon={<User />}
                label="Full Name"
                value={isEditing ? formData.fullName : userInfo.fullName}
                name="fullName"
                editable={isEditing}
                onChange={handleChange}
              />
              <ProfileField icon={<Mail />} label="Email" value={userInfo.email} editable={false} />
              <ProfileField
                icon={<Phone />}
                label="Phone"
                value={isEditing ? formData.phone : userInfo.phone}
                name="phone"
                editable={isEditing}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <MapPin />
                  </div>
                  <div className="w-full text-sm text-gray-500 mb-1">Address</div>
                </div>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="address.houseNo"
                      value={formData.address.houseNo}
                      onChange={handleChange}
                      placeholder="House No."
                      className="font-medium text-gray-900 border border-gray-200 rounded px-2 py-1"
                    />
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      placeholder="Street"
                      className="font-medium text-gray-900 border border-gray-200 rounded px-2 py-1"
                    />
                    <input
                      type="text"
                      name="address.landmark"
                      value={formData.address.landmark}
                      onChange={handleChange}
                      placeholder="Landmark (optional)"
                      className="font-medium text-gray-900 border border-gray-200 rounded px-2 py-1"
                    />
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="font-medium text-gray-900 border border-gray-200 rounded px-2 py-1"
                    />
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="font-medium text-gray-900 border border-gray-200 rounded px-2 py-1"
                    />
                    <input
                      type="text"
                      name="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleChange}
                      placeholder="Postal Code"
                      className="font-medium text-gray-900 border border-gray-200 rounded px-2 py-1"
                    />
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className="font-medium text-gray-900 border border-gray-200 rounded px-2 py-1"
                    />
                  </div>
                ) : (
                  <div className="font-medium text-gray-900">
  {userInfo?.address?.houseNo || userInfo?.address?.street || userInfo?.address?.city ? (
    `${userInfo.address.houseNo || ''}, ${userInfo.address.street || ''}` +
    `${userInfo.address.landmark ? `, ${userInfo.address.landmark}` : ''}, ` +
    `${userInfo.address.city || ''}, ${userInfo.address.state || ''}, ` +
    `${userInfo.address.postalCode || ''}, ${userInfo.address.country || ''}`
  ) : (
    'No address provided'
  )}
</div>

                )}
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Member Since</div>
                <div className="font-semibold text-gray-900">{userInfo.memberSince}</div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-100">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
         </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ProfileField = ({ icon, label, value, editable = false, name, onChange }: any) => (
  <div className="flex items-center space-x-4">
    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <div>
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      {editable ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="font-medium text-gray-900 border border-gray-200 rounded px-2 py-1"
        />
      ) : (
        <div className="font-medium text-gray-900">{value}</div>
      )}
    </div>
  </div>
);

export default ProfileTab;