import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import { useAuth } from '@/components/context/AuthContext';
import KitBuilderTab from '@/components/Dashboard/KitBuilderTab';

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<
    'home' | 'profile' | 'about' | 'contact' | 'subscription-detail'
  >('home');
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);
  const { user, isLoggedIn, loading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, selectedSubscriptionId]);

  useEffect(() => {
    if (location.hash === '#profile' && isLoggedIn) {
      setCurrentView('profile');
      setIsAuthModalOpen(false);
      setIsMobileMenuOpen(false);
      toast({
        title: 'Welcome to your profile! 👋',
        description: 'Here you can manage your subscriptions, settings, and preferences.',
      });
    }
  }, [location, isLoggedIn, toast]);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setCurrentView('profile');
      setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
  };

  const handlePageChange = (page: string) => {
    setCurrentView(page as 'home' | 'profile' | 'about' | 'contact');
    setSelectedSubscriptionId(null);
    setIsMobileMenuOpen(false);
  };

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleSubscriptionClick = (subscriptionId: number) => {
    setSelectedSubscriptionId(subscriptionId);
    setCurrentView('subscription-detail');
    setIsMobileMenuOpen(false);
  };

  const handleBackToSubscriptions = () => {
    setCurrentView('home');
    setSelectedSubscriptionId(null);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setIsMobileMenuOpen(false);
    setCurrentView('profile');
    toast({
      title: 'Welcome to 12 Crate! 🎉',
      description: "You're now logged in. Explore your profile and manage your subscriptions.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentView('home');
    setIsMobileMenuOpen(false);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  const handleSubscribe = (subscriptionId: number) => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      toast({
        title: 'Login Required',
        description: 'Please log in or sign up to subscribe.',
      });
    }
  };

  const commonNavProps = {
    onAuthClick: handleAuthClick,
    onProfileClick: handleProfileClick,
    onLogoClick: handleLogoClick,
    onPageChange: handlePageChange,
    onLogout: handleLogout,
    user, // Now matches NavigationProps' user type
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (currentView === 'subscription-detail' && selectedSubscriptionId) {
    return (
      <>
        <Navigation {...commonNavProps} />
        <SubscriptionDetail
          subscriptionId={selectedSubscriptionId}
          onBack={handleBackToSubscriptions}
          isLoggedIn={isLoggedIn}
          onSubscribe={handleSubscribe}
        />
        <Footer />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  if (currentView === 'profile') {
    return (
      <>
        <Navigation {...commonNavProps} />
        <UserProfile />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  if (currentView === 'about') {
    return (
      <>
        <Navigation {...commonNavProps} />
        <AboutPage />
        <Footer />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  if (currentView === 'contact') {
    return (
      <>
        <Navigation {...commonNavProps} />
        <ContactPage />
        <Footer />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <Navigation {...commonNavProps} />
        <Hero />
        <SubscriptionBoxes
          onSubscriptionClick={handleSubscriptionClick}
          isLoggedIn={isLoggedIn}
          onSubscribe={handleSubscribe}
        />
        <KitBuilderTab
          setActiveTab={(tabId) => console.log(`Switch to ${tabId}`)}
          onSubscribe={handleSubscribe}
        />
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