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

const PLATFORM_FEE = 1;

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
    // Atta
    { id: 1, name: 'Aashirvaad Shudh Atta', category: 'kitchen', subcategory: 'atta', mrp: 2, price: Math.round(1 * 0.92), unit: '5 kg', rating: 4.5, image: '/images/aashirvaad-shudh-atta.svg' },
    { id: 2, name: 'Aashirvaad Shudh Chakki Atta', category: 'kitchen', subcategory: 'atta', mrp: 495, price: Math.round(495 * 0.93), unit: '10 kg', rating: 4.6, image: '/images/aashirvaad-shudh-chakki-atta.svg' },
    { id: 3, name: 'Fortune Chakki Fresh', category: 'kitchen', subcategory: 'atta', mrp: 222, price: Math.round(222 * 0.92), unit: '5 kg', rating: 4.4, image: '/images/fortune-chakki-fresh.svg' },
    { id: 4, name: 'Aashirvaad Select 100% MP Sharbati Atta', category: 'kitchen', subcategory: 'atta', mrp: 370, price: Math.round(370 * 0.91), unit: '5 kg', rating: 4.7, image: '/images/aashirvaad-select-100-mp-sharbati-atta.svg' },
    { id: 5, name: 'Patanjali Whole Wheat Chakki Atta', category: 'kitchen', subcategory: 'atta', mrp: 250, price: Math.round(250 * 0.93), unit: '5 kg', rating: 4.3, image: '/images/patanjali-whole-wheat-chakki-atta.svg' },
    // Rice
    { id: 6, name: 'Fortune Rozana Gold Basmati Rice', category: 'kitchen', subcategory: 'rice', mrp: 130, price: Math.round(130 * 0.95), unit: '1 kg', rating: 4.6, image: '/images/fortune-rozana-gold-basmati-rice.svg' },
    { id: 7, name: 'Daawat Rozana', category: 'kitchen', subcategory: 'rice', mrp: 495, price: Math.round(495 * 0.92), unit: '5 kg', rating: 4.5, image: '/images/daawat-rozana.svg' },
    { id: 8, name: 'India Gate Pure Basmati Rice', category: 'kitchen', subcategory: 'rice', mrp: 490, price: Math.round(490 * 0.93), unit: '5 kg', rating: 4.7, image: '/images/india-gate-pure-basmati-rice.svg' },
    { id: 9, name: 'Daawat Super Basmati Rice', category: 'kitchen', subcategory: 'rice', mrp: 200, price: Math.round(200 * 0.94), unit: '1 kg', rating: 4.4, image: '/images/daawat-super-basmati-rice.svg' },
    { id: 10, name: 'India Gate Feast Rozana Basmati Rice', category: 'kitchen', subcategory: 'rice', mrp: 505, price: Math.round(505 * 0.92), unit: '5 kg', rating: 4.8, image: '/images/india-gate-feast-rozana-basmati-rice.svg' },
    // Oils
    { id: 11, name: 'Fortune Sunlite Refined Sunflower Oil', category: 'kitchen', subcategory: 'oils', mrp: 180, price: Math.round(180 * 0.90), unit: '870 g', rating: 4.2, image: '/images/fortune-sunlite-refined-sunflower-oil.svg' },
    { id: 12, name: 'Mashal Kachi Ghani Mustard Oil', category: 'kitchen', subcategory: 'oils', mrp: 195, price: Math.round(195 * 0.89), unit: '1 ltr', rating: 4.5, image: '/images/mashal-kachi-ghani-mustard-oil.svg' },
    { id: 13, name: 'Saffola Active Rice Bran Oil', category: 'kitchen', subcategory: 'oils', mrp: 187, price: Math.round(187 * 0.90), unit: '850 g', rating: 4.3, image: '/images/saffola-active-rice-bran-oil.svg' },
    { id: 14, name: 'P Mark Kachi Ghani Mustard Oil', category: 'kitchen', subcategory: 'oils', mrp: 220, price: Math.round(220 * 0.88), unit: '1 ltr', rating: 4.6, image: '/images/p-mark-kachi-ghani-mustard-oil.svg' },
    { id: 15, name: 'P Mark Kachi Ghani Mustard Oil 5L', category: 'kitchen', subcategory: 'oils', mrp: 970, price: Math.round(970 * 0.89), unit: '5 ltr', rating: 4.7, image: '/images/p-mark-kachi-ghani-mustard-oil-5l.svg' },
    { id: 16, name: 'Patanjali Mustard Oil', category: 'kitchen', subcategory: 'oils', mrp: 190, price: Math.round(190 * 0.90), unit: '1 ltr', rating: 4.4, image: '/images/patanjali-mustard-oil.svg' },
    { id: 17, name: 'Saffola Gold Blend of Rice Bran & Corn Blended Cooking Oil', category: 'kitchen', subcategory: 'oils', mrp: 449, price: Math.round(449 * 0.89), unit: '2 ltr', rating: 4.5, image: '/images/saffola-gold-blend-of-rice-bran-corn-blended-cooking-oil.svg' },
    { id: 18, name: 'Gagan Active Refined Groundnut Oil', category: 'kitchen', subcategory: 'oils', mrp: 251, price: Math.round(251 * 0.90), unit: '1 ltr', rating: 4.3, image: '/images/gagan-active-refined-groundnut-oil.svg' },
    // Snacks
    { id: 19, name: 'Mr Makhana Butter Tomato', category: 'kitchen', subcategory: 'snacks', mrp: 50, price: Math.round(50 * 0.85), unit: '20 g', rating: 4.0, image: '/images/mr-makhana-butter-tomato.svg' },
    { id: 21, name: 'Whole Farm Premium Raw Peanuts 200g', category: 'kitchen', subcategory: 'snacks', mrp: 65, price: Math.round(65 * 0.86), unit: '200 g', rating: 4.2, image: '/images/whole-farm-premium-raw-peanuts-200g.svg' },
    { id: 22, name: 'Whole Farm Grocery Makhana', category: 'kitchen', subcategory: 'snacks', mrp: 210, price: Math.round(210 * 0.85), unit: '100 g', rating: 4.3, image: '/images/whole-farm-grocery-makhana.svg' },
    { id: 23, name: 'Whole Farm Premium Raw Peanuts 500 2', category: 'kitchen', subcategory: 'snacks', mrp: 180, price: Math.round(200 * 0.86), unit: '500 g', rating: 4.4, image: '/images/whole-farm-premium-raw-peanuts-200g-2.svg' },
    // Ghee
    { id: 24, name: 'Amul Pure Ghee', category: 'kitchen', subcategory: 'ghee', mrp: 650, price: Math.round(650 * 0.95), unit: '1 ltr', rating: 4.8, image: '/images/amul-pure-ghee.svg' },
    { id: 25, name: 'Amul Cow Ghee', category: 'kitchen', subcategory: 'ghee', mrp: 685, price: Math.round(685 * 0.94), unit: '1 ltr', rating: 4.9, image: '/images/amul-cow-ghee.svg' },
    { id: 26, name: 'Milkfood Rich Desi Ghee', category: 'kitchen', subcategory: 'ghee', mrp: 630, price: Math.round(630 * 0.95), unit: '900 ml', rating: 4.7, image: '/images/milkfood-rich-desi-ghee.svg' },
    { id: 27, name: 'Verka Desi Ghee', category: 'kitchen', subcategory: 'ghee', mrp: 350, price: Math.round(350 * 0.94), unit: '500 ml', rating: 4.6, image: '/images/verka-desi-ghee.svg' },
    { id: 28, name: 'Gowardhan Premium Cow Ghee', category: 'kitchen', subcategory: 'ghee', mrp: 799, price: Math.round(799 * 0.93), unit: '1 ltr', rating: 4.9, image: '/images/gowardhan-premium-cow-ghee.svg' },
    { id: 29, name: 'Patanjali Cow Ghee', category: 'kitchen', subcategory: 'ghee', mrp: 390, price: Math.round(390 * 0.94), unit: '500 ml', rating: 4.5, image: '/images/patanjali-cow-ghee.svg' },
    { id: 30, name: 'Gagan Vanaspati', category: 'kitchen', subcategory: 'oils', mrp: 200, price: Math.round(200 * 0.88), unit: '1 ltr', rating: 4.0, image: '/images/gagan-vanaspati.svg' },
    // Spices
    { id: 31, name: 'Catch Cumin Seeds/Jeera Seeds', category: 'kitchen', subcategory: 'spices', mrp: 130, price: Math.round(130 * 0.87), unit: '200 g', rating: 4.3, image: '/images/catch-cumin-seeds.svg' },
    { id: 32, name: 'Whole Farm Coriander Seeds', category: 'kitchen', subcategory: 'spices', mrp: 90, price: Math.round(90 * 0.86), unit: '200 g', rating: 4.2, image: '/images/whole-farm-coriander-seeds.svg' },
    { id: 33, name: 'Whole Farm Premium Tamarind', category: 'kitchen', subcategory: 'spices', mrp: 80, price: Math.round(80 * 0.85), unit: '200 g', rating: 4.1, image: '/images/whole-farm-premium-tamarind.svg' },
    { id: 34, name: 'Catch Kasuri Methi', category: 'kitchen', subcategory: 'spices', mrp: 56, price: Math.round(56 * 0.86), unit: '50 g', rating: 4.4, image: '/images/catch-kasuri-methi.svg' },
    { id: 35, name: 'Catch Ajwain Seeds', category: 'kitchen', subcategory: 'spices', mrp: 100, price: Math.round(100 * 0.87), unit: '100 g', rating: 4.3, image: '/images/catch-ajwain-seeds.svg' },
    { id: 36, name: 'Whole Farm Premium Cumin Seeds', category: 'kitchen', subcategory: 'spices', mrp: 125, price: Math.round(125 * 0.86), unit: '100 g', rating: 4.3, image: '/images/whole-farm-premium-cumin-seeds.svg' },
    { id: 37, name: 'Whole Farm Premium Choti Elaichi/Green Cardamom', category: 'kitchen', subcategory: 'spices', mrp: 160, price: Math.round(160 * 0.85), unit: '20 g', rating: 4.5, image: '/images/whole-farm-premium-choti-elaichi.svg' },
    { id: 38, name: 'Maggi Masala-ae-Magic', category: 'kitchen', subcategory: 'spices', mrp: 60, price: Math.round(60 * 0.88), unit: '72 g', rating: 4.2, image: '/images/maggi-masala-ae-magic.svg' },
    { id: 39, name: 'MDH Degi Mirch', category: 'kitchen', subcategory: 'spices', mrp: 110, price: Math.round(110 * 0.87), unit: '100 g', rating: 4.4, image: '/images/mdh-degi-mirch.svg' },
    { id: 40, name: 'Catch Red Chili Powder', category: 'kitchen', subcategory: 'spices', mrp: 55, price: Math.round(55 * 0.86), unit: '100 g', rating: 4.3, image: '/images/catch-red-chili-powder.svg' },
    { id: 41, name: 'Catch Turmeric Powder/Haldi', category: 'kitchen', subcategory: 'spices', mrp: 45, price: Math.round(45 * 0.86), unit: '100 g', rating: 4.2, image: '/images/catch-turmeric-powder.svg' },
    { id: 42, name: 'Catch Coriander Powder/Dhania Powder', category: 'kitchen', subcategory: 'spices', mrp: 80, price: Math.round(80 * 0.87), unit: '200 g', rating: 4.3, image: '/images/catch-coriander-powder.svg' },
    { id: 43, name: 'Catch Super Garam Masala', category: 'kitchen', subcategory: 'spices', mrp: 100, price: Math.round(100 * 0.86), unit: '200 g', rating: 4.4, image: '/images/catch-super-garam-masala.svg' },
    { id: 44, name: 'Catch Hing Powder', category: 'kitchen', subcategory: 'spices', mrp: 74, price: Math.round(74 * 0.85), unit: '25 g', rating: 4.3, image: '/images/catch-hing-powder.svg' },
    { id: 45, name: 'Catch Chaat Masala', category: 'kitchen', subcategory: 'spices', mrp: 90, price: Math.round(90 * 0.87), unit: '100 g', rating: 4.2, image: '/images/catch-chaat-masala.svg' },
    { id: 46, name: 'Everest Coriander Powder', category: 'kitchen', subcategory: 'spices', mrp: 40, price: Math.round(40 * 0.88), unit: '100 g', rating: 4.2, image: '/images/everest-coriander-powder.svg' },
    { id: 47, name: 'Everest Tikhalal Red Chili Powder', category: 'kitchen', subcategory: 'spices', mrp: 54, price: Math.round(54 * 0.86), unit: '100 g', rating: 4.3, image: '/images/everest-tikhalal-red-chili-powder.svg' },
    // Salt & Sugar
    { id: 48, name: 'Tata Salt', category: 'kitchen', subcategory: 'salt_sugar', mrp: 30, price: Math.round(30 * 0.95), unit: '1 kg', rating: 4.3, image: '/images/tata-salt.svg' },
    { id: 49, name: 'Fortune Sulphurless Sugar', category: 'kitchen', subcategory: 'salt_sugar', mrp: 75, price: Math.round(75 * 0.93), unit: '1 kg', rating: 4.2, image: '/images/fortune-sulphurless-sugar.svg' },
    { id: 50, name: 'Tata Himalayan Rock Salt', category: 'kitchen', subcategory: 'salt_sugar', mrp: 120, price: Math.round(120 * 0.92), unit: '1 kg', rating: 4.4, image: '/images/tata-himalayan-rock-salt.svg' },
    { id: 51, name: 'Catch Black Salt', category: 'kitchen', subcategory: 'salt_sugar', mrp: 47, price: Math.round(47 * 0.93), unit: '200 g', rating: 4.2, image: '/images/catch-black-salt.svg' },
    { id: 52, name: 'Uttam Sugar Sulphurless Sugar', category: 'kitchen', subcategory: 'salt_sugar', mrp: 65, price: Math.round(65 * 0.94), unit: '1 kg', rating: 4.2, image: '/images/uttam-sugar-sulphurless.svg' },
    { id: 53, name: 'Whole Farm Grocery Sugar', category: 'kitchen', subcategory: 'salt_sugar', mrp: 299, price: Math.round(299 * 0.92), unit: '5 kg', rating: 4.3, image: '/images/whole-farm-grocery-sugar.svg' },
    { id: 54, name: 'Catch Table Salt', category: 'kitchen', subcategory: 'salt_sugar', mrp: 30, price: Math.round(30 * 0.95), unit: '100 g', rating: 4.1, image: '/images/catch-table-salt.svg' },
    { id: 55, name: 'Sugar Free Natura Sweetener', category: 'kitchen', subcategory: 'salt_sugar', mrp: 220, price: Math.round(220 * 0.92), unit: '300 tablets', rating: 4.3, image: '/images/sugar-free-natura-sweetener.svg' },
    { id: 56, name: 'Sugar Free Gold Sweetener', category: 'kitchen', subcategory: 'salt_sugar', mrp: 165, price: Math.round(165 * 0.93), unit: '100 g', rating: 4.2, image: '/images/sugar-free-gold-sweetener-100g.svg' },
    { id: 57, name: 'Sugar Free Gold Sweetener', category: 'kitchen', subcategory: 'salt_sugar', mrp: 320, price: Math.round(320 * 0.92), unit: '500 tablets', rating: 4.3, image: '/images/sugar-free-gold-sweetener-500.svg' },
    { id: 58, name: 'Catch Pink Rock Salt', category: 'kitchen', subcategory: 'salt_sugar', mrp: 45, price: Math.round(45 * 0.93), unit: '100 g', rating: 4.2, image: '/images/catch-pink-rock-salt.svg' },
    { id: 59, name: 'Lijjat Plain Urad Dal Papad', category: 'kitchen', subcategory: 'salt_sugar', mrp: 77, price: Math.round(77 * 0.92), unit: '200 g', rating: 4.3, image: '/images/lijjat-plain-urad-dal-papad.svg' },
    { id: 60, name: 'DNV Sabudana Papad', category: 'kitchen', subcategory: 'salt_sugar', mrp: 50, price: Math.round(50 * 0.93), unit: '100 g', rating: 4.2, image: '/images/dnv-sabudana-papad.svg' },
    { id: 61, name: 'Lijjat Punjabi Masala Papad', category: 'kitchen', subcategory: 'salt_sugar', mrp: 89, price: Math.round(89 * 0.92), unit: '200 g', rating: 4.3, image: '/images/lijjat-punjabi-masala-papad.svg' },
    // Sauces & Spreads
    { id: 62, name: 'Kissan Fresh Tomato Ketchup', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 100, price: Math.round(100 * 0.90), unit: '850 g', rating: 4.3, image: '/images/kissan-fresh-tomato-ketchup-850g.svg' },
    { id: 63, name: 'Kissan Fresh Tomato Ketchup', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 150, price: Math.round(150 * 0.90), unit: '1.1 kg', rating: 4.3, image: '/images/kissan-fresh-tomato-ketchup-1.1kg.svg' },
    { id: 64, name: 'Del Monte Tomato Ketchup', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 130, price: Math.round(130 * 0.90), unit: '900 g', rating: 4.2, image: '/images/del-monte-tomato-ketchup.svg' },
    { id: 65, name: 'Maggi Hot & Sweet Tomato Chilli Sauce', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 130, price: Math.round(130 * 0.90), unit: '900 g', rating: 4.3, image: '/images/maggi-hot-sweet-tomato-chilli-sauce-900g.svg' },
    { id: 66, name: 'Maggi Hot & Sweet Tomato Chilli Sauce', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 185, price: Math.round(185 * 0.89), unit: '1 kg', rating: 4.3, image: '/images/maggi-hot-sweet-tomato-chilli-sauce-1kg.svg' },
    { id: 67, name: 'Maggi Rich Tomato Ketchup', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 75, price: Math.round(75 * 0.90), unit: '190 g', rating: 4.2, image: '/images/maggi-rich-tomato-ketchup.svg' },
    { id: 68, name: 'Kissan Sweet & Spicy Tomato Ketchup', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 80, price: Math.round(80 * 0.90), unit: '415 g', rating: 4.2, image: '/images/kissan-sweet-spicy-tomato-ketchup.svg' },
    { id: 69, name: 'Heinz Tomato Ketchup', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 165, price: Math.round(165 * 0.90), unit: '450 g', rating: 4.3, image: '/images/heinz-tomato-ketchup-450g.svg' },
    { id: 70, name: 'Heinz Tomato Ketchup', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 285, price: Math.round(285 * 0.89), unit: '900 g', rating: 4.3, image: '/images/heinz-tomato-ketchup-900g.svg' },
    { id: 71, name: "Ching's Secret Schezwan Chutney", category: 'kitchen', subcategory: 'sauces_spreads', mrp: 90, price: Math.round(90 * 0.90), unit: '250 g', rating: 4.2, image: '/images/chings-secret-schezwan-chutney.svg' },
    { id: 72, name: "Ching's Secret Dark Soy Sauce Rich, Brown and Zesty", category: 'kitchen', subcategory: 'sauces_spreads', mrp: 60, price: Math.round(60 * 0.90), unit: '210 g', rating: 4.2, image: '/images/chings-secret-dark-soy-sauce.svg' },
    { id: 73, name: "Ching's Secret Green Chilli Sauce", category: 'kitchen', subcategory: 'sauces_spreads', mrp: 60, price: Math.round(60 * 0.90), unit: '190 g', rating: 4.2, image: '/images/chings-secret-green-chilli-sauce.svg' },
    { id: 74, name: "Ching's Secret Red Chilli Sauce", category: 'kitchen', subcategory: 'sauces_spreads', mrp: 60, price: Math.round(60 * 0.90), unit: '200 g', rating: 4.2, image: '/images/chings-secret-red-chilli-sauce.svg' },
    { id: 75, name: 'Dr. Oetker FunFoods Veg Mayonnaise', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 99, price: Math.round(99 * 0.90), unit: '250 g', rating: 4.3, image: '/images/dr-oetker-funfoods-veg-mayonnaise.svg' },
    { id: 76, name: 'Veeba Veg Tandoori Flavoured Mayonnaise', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 109, price: Math.round(109 * 0.90), unit: '250 g', rating: 4.2, image: '/images/veeba-veg-tandoori-mayonnaise.svg' },
    { id: 77, name: 'Dr. Oetker FunFoods Crunchy Peanut Butter', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 139, price: Math.round(139 * 0.89), unit: '375 g', rating: 4.3, image: '/images/dr-oetker-funfoods-crunchy-peanut-butter.svg' },
    { id: 78, name: 'Sundrop Creamy Peanut Butter', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 150, price: Math.round(150 * 0.90), unit: '462 g', rating: 4.3, image: '/images/sundrop-creamy-peanut-butter.svg' },
    { id: 79, name: 'Kissan Mixed Fruit Jam', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 90, price: Math.round(90 * 0.90), unit: '200 g', rating: 4.2, image: '/images/kissan-mixed-fruit-jam.svg' },
    { id: 80, name: "Hershey's Cocoa Chocolate Spread", category: 'kitchen', subcategory: 'sauces_spreads', mrp: 185, price: Math.round(185 * 0.89), unit: '150 g', rating: 4.3, image: '/images/hersheys-cocoa-chocolate-spread.svg' },
    { id: 81, name: 'Kissan Pineapple Jam', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 210, price: Math.round(210 * 0.90), unit: '500 g', rating: 4.2, image: '/images/kissan-pineapple-jam.svg' },
    { id: 82, name: 'Patanjali Honey', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 210, price: Math.round(210 * 0.90), unit: '500 g', rating: 4.3, image: '/images/patanjali-honey.svg' },
    { id: 83, name: 'Dabur 100% Pure Honey', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 365, price: Math.round(365 * 0.89), unit: '750 g', rating: 4.4, image: '/images/dabur-100-pure-honey.svg' },
    { id: 84, name: "Hershey's Chocolate Syrup", category: 'kitchen', subcategory: 'sauces_spreads', mrp: 110, price: Math.round(110 * 0.90), unit: '200 g', rating: 4.2, image: '/images/hersheys-chocolate-syrup.svg' },
    { id: 85, name: "Hershey's Strawberry", category: 'kitchen', subcategory: 'sauces_spreads', mrp: 115, price: Math.round(115 * 0.90), unit: '200 g', rating: 4.2, image: '/images/hersheys-strawberry.svg' },
    { id: 86, name: 'Catch Ginger Garlic Paste', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 50, price: Math.round(50 * 0.90), unit: '200 g', rating: 4.2, image: '/images/catch-ginger-garlic-paste.svg' },
    { id: 87, name: 'Smith and Jones Ginger Garlic Paste', category: 'kitchen', subcategory: 'sauces_spreads', mrp: 50, price: Math.round(50 * 0.90), unit: '200 g', rating: 4.2, image: '/images/smith-and-jones-ginger-garlic-paste.svg' },
    // Dishwash
    { id: 88, name: 'Vim Lemon Dishwash Bar', category: 'kitchen', subcategory: 'dishwash', mrp: 30, price: Math.round(30 * 0.85), unit: '300 g', rating: 4.2, image: '/images/vim-lemon-dishwash-bar.svg' },
    { id: 89, name: 'Vim Lemon Tub Dishwashing Tub', category: 'kitchen', subcategory: 'dishwash', mrp: 60, price: Math.round(60 * 0.86), unit: '500 g', rating: 4.3, image: '/images/vim-lemon-tub-dishwashing.svg' },
    { id: 90, name: 'Patanjali Super Dishwash Bar', category: 'kitchen', subcategory: 'dishwash', mrp: 72, price: Math.round(72 * 0.86), unit: '4x225 g', rating: 4.2, image: '/images/patanjali-super-dishwash-bar.svg' },
    { id: 91, name: 'Exo Anti-Bacterial Dishwash Bar', category: 'kitchen', subcategory: 'dishwash', mrp: 66, price: Math.round(66 * 0.86), unit: '3x200 g', rating: 4.2, image: '/images/exo-anti-bacterial-dishwash-bar.svg' },
    { id: 92, name: 'Vim Pudina Anti Smell Dishwash Bar', category: 'kitchen', subcategory: 'dishwash', mrp: 30, price: Math.round(30 * 0.85), unit: '135 g', rating: 4.2, image: '/images/vim-pudina-anti-smell-dishwash-bar.svg' },
    { id: 93, name: 'Scotch Brite Sponge Scrub', category: 'kitchen', subcategory: 'dishwash', mrp: 55, price: Math.round(55 * 0.86), unit: '3 pieces', rating: 4.3, image: '/images/scotch-brite-sponge-scrub.svg' },
    { id: 94, name: 'Scotch Brite Stainless Steel Scrubber with 1 Scrub Pad', category: 'kitchen', subcategory: 'dishwash', mrp: 30, price: Math.round(30 * 0.85), unit: '1 pack', rating: 4.2, image: '/images/scotch-brite-stainless-steel-scrubber.svg' },
    { id: 95, name: 'Scotch Brite Sponge Wipe', category: 'kitchen', subcategory: 'dishwash', mrp: 230, price: Math.round(230 * 0.86), unit: '3 units', rating: 4.3, image: '/images/scotch-brite-sponge-wipe.svg' },
    { id: 96, name: 'Big Blue Bottle Brush', category: 'kitchen', subcategory: 'dishwash', mrp: 78, price: Math.round(78 * 0.86), unit: '1 unit', rating: 4.2, image: '/images/big-blue-bottle-brush.svg' },
    { id: 97, name: 'Scotch Brite Multipurpose Microfiber Cloth', category: 'kitchen', subcategory: 'dishwash', mrp: 199, price: Math.round(199 * 0.86), unit: '1 unit', rating: 4.3, image: '/images/scotch-brite-multipurpose-microfiber-cloth.svg' },
    { id: 98, name: 'Vim Lemon Dishwash Gel', category: 'kitchen', subcategory: 'dishwash', mrp: 130, price: Math.round(130 * 0.86), unit: '500 ml', rating: 4.3, image: '/images/vim-lemon-dishwash-gel-500ml.svg' },
    { id: 99, name: 'Vim Lemon Dishwash Gel with Tropical Lemon Freshness', category: 'kitchen', subcategory: 'dishwash', mrp: 600, price: Math.round(600 * 0.85), unit: '3.2 ltr', rating: 4.4, image: '/images/vim-lemon-dishwash-gel-3.2ltr.svg' },
    { id: 100, name: 'Pril Lime Grease Fighter Dishwash Gel', category: 'kitchen', subcategory: 'dishwash', mrp: 209, price: Math.round(209 * 0.86), unit: '750 ml', rating: 4.3, image: '/images/pril-lime-grease-fighter-dishwash-gel.svg' },
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
    toast.error("Please enter a subscription name");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
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

    // Create Razorpay recurring order
    const res = await fetch('https://onecrate-backend.onrender.com/api/recurring-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscriptionData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create order');

   const options = {
  key: data.razorpayKeyId,
  order_id: data.order.id,
  name: '12 Crate Essentials',
  description: `Payment for ${subscriptionName}`,
  image: '/logo.svg',
  handler: async function (response: any) {
    try {
      const verifyRes = await fetch('https://onecrate-backend.onrender.com/api/recurring-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          subscriptionName: subscriptionName,
        }),
      });

      if (!verifyRes.ok) throw new Error('Verification failed');

      toast.success('Subscription started!', { duration: 3000 });
      setCart({});
      setSubscriptionName('');
    } catch (err) {
      toast.error('Payment verification failed.');
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


    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err: any) {
    toast.error(err.message || 'Something went wrong.');
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