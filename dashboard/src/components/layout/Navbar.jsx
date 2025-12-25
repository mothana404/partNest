import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  Menu as MenuIcon,
  LogOut,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications] = useState([
    { id: 1, message: 'New application received', time: '5m ago', unread: true, type: 'application' },
    { id: 2, message: 'Job post approved', time: '1h ago', unread: true, type: 'success' },
    { id: 3, message: 'Profile viewed by 3 companies', time: '2h ago', unread: false, type: 'info' },
  ]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'application': return '📄';
      case 'success': return '✅';
      case 'info': return '👀';
      default: return '📌';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MenuIcon className="h-5 w-5" />
            </button>

            {/* Desktop Greeting */}
            <div className="hidden md:block">
              <h2 className="text-lg font-semibold text-gray-900">
                {getGreeting()}, {user?.fullName?.split(' ')[0]}!
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;