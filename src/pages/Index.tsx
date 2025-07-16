import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import SubscriptionBoxes from '@/components/SubscriptionBoxes';
import SubscriptionDetail from '@/components/SubscriptionDetail';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Stats from '@/components/Stats';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import UserProfile from '@/components/UserProfile';
import AboutPage from '@/components/AboutPage';
import ContactPage from '@/components/ContactPage';
import { useToast } from '@/hooks/use-toast';
import { useAtom, useSetAtom } from 'jotai';
import { userAtom } from '@/atoms/user';

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<
    'home' | 'profile' | 'about' | 'contact' | 'subscription-detail'
  >('home');
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    number | null
  >(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user] = useAtom(userAtom);
  const setUser = useSetAtom(userAtom);
  const { toast } = useToast();

  // Handle navigation clicks
  const handleProfileClick = () => {
    if (isLoggedIn) {
      setCurrentView('profile');
      toast({
        title: 'Welcome to your profile! 👋',
        description:
          'Here you can manage your subscriptions, settings, and preferences.',
      });
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLogoClick = () => {
    setCurrentView('home');
    setSelectedSubscriptionId(null);
  };

  const handlePageChange = (page: string) => {
    setCurrentView(page as 'home' | 'profile' | 'about' | 'contact');
    setSelectedSubscriptionId(null);
  };

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleSubscriptionClick = (subscriptionId: number) => {
    setSelectedSubscriptionId(subscriptionId);
    setCurrentView('subscription-detail');
  };

  const handleBackToSubscriptions = () => {
    setCurrentView('home');
    setSelectedSubscriptionId(null);
  };

  // Handle successful authentication
  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    setCurrentView('profile');
    toast({
      title: 'Welcome to OneCrate! 🎉',
      description:
        "You're now logged in. Explore your profile and manage your subscriptions.",
    });
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    setUser(null); // Reset userAtom
    setCurrentView('home');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  // Render subscription detail page
  if (currentView === 'subscription-detail' && selectedSubscriptionId) {
    return (
      <>
        <Navigation
          onAuthClick={handleAuthClick}
          onProfileClick={handleProfileClick}
          onLogoClick={handleLogoClick}
          onPageChange={handlePageChange}
          onLogout={handleLogout}
          user={user}
        />
        <SubscriptionDetail
          subscriptionId={selectedSubscriptionId}
          onBack={handleBackToSubscriptions}
        />
        <Footer />
      </>
    );
  }

  // Render other pages
  if (currentView === 'profile') {
    return (
      <>
        <Navigation
          onAuthClick={handleAuthClick}
          onProfileClick={handleProfileClick}
          onLogoClick={handleLogoClick}
          onPageChange={handlePageChange}
          onLogout={handleLogout}
          user={user}
        />
        <UserProfile />
      </>
    );
  }

  if (currentView === 'about') {
    return (
      <>
        <Navigation
          onAuthClick={handleAuthClick}
          onProfileClick={handleProfileClick}
          onLogoClick={handleLogoClick}
          onPageChange={handlePageChange}
          onLogout={handleLogout}
          user={user}
        />
        <AboutPage />
        <Footer />
      </>
    );
  }

  if (currentView === 'contact') {
    return (
      <>
        <Navigation
          onAuthClick={handleAuthClick}
          onProfileClick={handleProfileClick}
          onLogoClick={handleLogoClick}
          onPageChange={handlePageChange}
          onLogout={handleLogout}
          user={user}
        />
        <ContactPage />
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <Navigation
          onAuthClick={handleAuthClick}
          onProfileClick={handleProfileClick}
          onLogoClick={handleLogoClick}
          onPageChange={handlePageChange}
          onLogout={handleLogout}
          user={user}
        />
        <Hero />
        <SubscriptionBoxes onSubscriptionClick={handleSubscriptionClick} />
        <Features />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <Footer />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </>
  );
};

export default Index;