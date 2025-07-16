import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu, X, Package, Bell, Search, LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = `inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${className}`;
  const variants = {
    primary:
      'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-md focus:ring-emerald-400',
    ghost: 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface NavigationProps {
  onAuthClick: () => void;
  onProfileClick: () => void;
  onLogoClick: () => void;
  onPageChange: (page: string) => void;
  onLogout: () => void;
  user: { fullName: string; email: string } | null;
}

interface NavItem {
  name: string;
  path: string;
  highlight: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  onAuthClick,
  onProfileClick,
  onLogoClick,
  onPageChange,
  onLogout,
  user,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  const navItems: NavItem[] = [
    { name: 'Home', path: 'home', highlight: false },
    { name: 'Browse Kits', path: 'home#subscriptions', highlight: true },
   // { name: 'Features', path: 'home#features', highlight: false },
    { name: 'How It Works', path: 'home#how-it-works', highlight: false },
    { name: 'About', path: 'about', highlight: false },
    { name: 'Contact', path: 'contact', highlight: false },
  ];

  const handleNavClick = (item: NavItem) => {
    const page = item.path.includes('#') ? 'home' : item.path;
    onPageChange(page);
    if (item.path.includes('#')) {
      setTimeout(() => {
        const element = document.getElementById(item.path.split('#')[1]);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    setIsOpen(false);
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 shadow-md' : 'bg-white/90'
        } backdrop-blur-md border-b border-emerald-100/30`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1  }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
   <motion.div
  className="flex items-center space-x-2 cursor-pointer group"
  whileHover={{ scale: 1.02 }}
  onClick={onLogoClick}
>
  <img
    className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 object-contain"
    src="/logo.svg"
    alt="12 Crate Premium Essentials Logo"
    loading="lazy"
    onError={(e) => {
      e.currentTarget.src = '/fallback-logo.png';
    }}
  />
</motion.div>


            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    item.highlight
                      ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
                  } relative group`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {item.name}
                  {item.highlight && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full" />
                  )}
                  <motion.div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-emerald-500 group-hover:w-full"
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>
              ))}
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <motion.button
                className="p-2 rounded-lg hover:bg-emerald-50 hidden sm:block relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-gray-600 hover:text-emerald-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </motion.button>

              {user ? (
                <>
                  <motion.button
                    className="p-2 rounded-lg hover:bg-emerald-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onProfileClick}
                    title="Profile"
                  >
                    <div className="w-40 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'View Products'}
                    </div>
                  </motion.button>

                  <motion.button
                    className="p-2 rounded-lg hover:bg-emerald-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onLogout}
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5 text-gray-600 hover:text-emerald-600" />
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    className="p-2 rounded-lg hover:bg-emerald-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAuthClick}
                    title="Login"
                  >
                    <User className="w-5 h-5 text-gray-600 hover:text-emerald-600" />
                  </motion.button>

                  <Button
                    className="hidden sm:flex"
                    size="sm"
                    onClick={onAuthClick}
                  >
                    Login
                  </Button>
                </>
              )}

              <motion.button
                className="lg:hidden p-2 rounded-lg hover:bg-emerald-50"
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6 text-gray-700" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6 text-gray-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="fixed top-16 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl shadow-lg z-50 lg:hidden max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 space-y-1">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    className={`w-full text-left py-2 px-4 rounded-lg text-sm font-medium ${
                      item.highlight
                        ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                        : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
                    } flex items-center justify-between`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <span>{item.name}</span>
                    {item.highlight && (
                      <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    )}
                  </motion.button>
                ))}

                {user ? (
                  <div className="flex justify-between mt-3">
                    <Button
                      className="flex-1 mr-2"
                      variant="ghost"
                      size="md"
                      onClick={() => {
                        onProfileClick();
                        setIsOpen(false);
                      }}
                    >
                      Profile
                    </Button>
                    <Button
                      className="flex-1 ml-2"
                      size="md"
                      onClick={() => {
                        onLogout();
                        setIsOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full mt-3"
                    size="md"
                    onClick={() => {
                      onAuthClick();
                      setIsOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                )}

                <div className="flex justify-center space-x-3 pt-3">
                  <motion.button
                    className="p-2 rounded-lg hover:bg-emerald-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Search className="w-5 h-5 text-gray-600 hover:text-emerald-600" />
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-lg hover:bg-emerald-50 relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bell className="w-5 h-5 text-gray-600 hover:text-emerald-600" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;