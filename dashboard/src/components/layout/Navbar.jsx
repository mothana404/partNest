import { Fragment, useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  Menu as MenuIcon,
  LogOut,
  Calendar,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', icon: Sun, color: 'text-yellow-500' };
    if (hour < 18) return { text: 'Good afternoon', icon: Sun, color: 'text-orange-500' };
    return { text: 'Good evening', icon: Moon, color: 'text-indigo-500' };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <header className={`p-1 sticky top-0 z-40 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg shadow-gray-200/50' 
        : 'bg-white/80 backdrop-blur-md'
    } border-b border-gray-200`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center gap-3 p-2">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <MenuIcon className="h-5 w-5" />
            </button>

            {/* Desktop Greeting with Animation */}
            <div className="hidden md:block group">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <GreetingIcon className={`h-5 w-5 ${greeting.color} relative animate-pulse`} />
                </div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent">
                  {greeting.text}, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {user?.fullName?.split(' ')[0]}
                  </span>!
                </h2>
                <Sparkles className="h-4 w-4 text-yellow-500 animate-bounce" />
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100">
                  <Calendar className="h-3.5 w-3.5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="px-3 py-1 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border border-purple-100">
                  <span className="text-sm font-medium text-gray-700 tabular-nums">
                    {currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* User Profile Badge */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">{user?.fullName?.split(' ')[0]}</span>
                <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="group relative flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-white bg-white hover:bg-gradient-to-r from-red-500 to-red-600 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-gray-200 hover:border-red-500 shadow-sm hover:shadow-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              <LogOut className="h-5 w-5 relative z-10 transform group-hover:rotate-12 transition-transform duration-300" />
              <span className="hidden sm:inline text-sm font-semibold relative z-10">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;