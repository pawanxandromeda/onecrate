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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<
    'home' | 'profile' | 'about' | 'contact' | 'subscription-detail'
  >('home');
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user] = useAtom(userAtom);
  const setUser = useSetAtom(userAtom);
  const { toast } = useToast();

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setCurrentView('profile');
      setIsMobileMenuOpen(false); // ✅ Close mobile menu
      toast({
        title: 'Welcome to your profile! 👋',
        description: 'Here you can manage your subscriptions, settings, and preferences.',
      });
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLogoClick = () => {
    setCurrentView('home');
    setSelectedSubscriptionId(null);
    setIsMobileMenuOpen(false); // ✅ Close mobile menu
  };

  const handlePageChange = (page: string) => {
    setCurrentView(page as 'home' | 'profile' | 'about' | 'contact');
    setSelectedSubscriptionId(null);
    setIsMobileMenuOpen(false); // ✅ Close mobile menu
  };

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false); // ✅ Close mobile menu
  };

  const handleSubscriptionClick = (subscriptionId: number) => {
    setSelectedSubscriptionId(subscriptionId);
    setCurrentView('subscription-detail');
    setIsMobileMenuOpen(false); // ✅ Close mobile menu
  };

  const handleBackToSubscriptions = () => {
    setCurrentView('home');
    setSelectedSubscriptionId(null);
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    setIsMobileMenuOpen(false); // ✅ Close mobile menu
    setCurrentView('profile');
    toast({
      title: 'Welcome to 12 Crate! 🎉',
      description: "You're now logged in. Explore your profile and manage your subscriptions.",
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    setUser(null);
    setCurrentView('home');
    setIsMobileMenuOpen(false); // ✅ Close mobile menu
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  const commonNavProps = {
    onAuthClick: handleAuthClick,
    onProfileClick: handleProfileClick,
    onLogoClick: handleLogoClick,
    onPageChange: handlePageChange,
    onLogout: handleLogout,
    user: user,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  };

  if (currentView === 'subscription-detail' && selectedSubscriptionId) {
    return (
      <>
        <Navigation {...commonNavProps} />
        <SubscriptionDetail
          subscriptionId={selectedSubscriptionId}
          onBack={handleBackToSubscriptions}
        />
        <Footer />
      </>
    );
  }

  if (currentView === 'profile') {
    return (
      <>
        <Navigation {...commonNavProps} />
        <UserProfile />
      </>
    );
  }

  if (currentView === 'about') {
    return (
      <>
        <Navigation {...commonNavProps} />
        <AboutPage />
        <Footer />
      </>
    );
  }

  if (currentView === 'contact') {
    return (
      <>
        <Navigation {...commonNavProps} />
        <ContactPage />
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <Navigation {...commonNavProps} />
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
