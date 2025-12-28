import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  X, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { navigationConfig } from '../../config/navigations';
import logo from '../../assets/PartnestLogo.png';

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  if (!user) return null;

  const navigation = navigationConfig[user.role] || [];

  return (
    <>
      {/* Mobile Overlay with Animation */}
      <div
        className={`fixed inset-0 z-0 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-0 flex w-72 flex-col bg-white/95 backdrop-blur-xl border-r border-gray-200 transition-all duration-500 ease-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        {/* Header */}
        <div className="relative flex h-16 items-center justify-between px-6 border-b border-gray-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 bg-white shadow-lg">
                <img 
                  src={logo} 
                  alt="PartNest Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                PartNest
              </h1>
              <span className="text-xs text-gray-500 font-medium">Dashboard</span>
            </div>
          </Link>
          
          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gradient-to-br from-red-50 to-pink-50 hover:text-red-600 transition-all duration-300 hover:rotate-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info Card */}
        <div className="relative p-4 m-4 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
          <div className="relative flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg border-2 border-white/30 shadow-lg">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{user?.fullName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                  <Sparkles className="w-3 h-3" />
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-1.5">
            {navigation.map((item, index) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`
                    relative flex items-center gap-3 px-3 py-3 rounded-xl
                    transition-all duration-300 group overflow-hidden
                    animate-slide-in
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105' 
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:scale-105'
                    }
                  `}
                >
                  {/* Animated Background on Hover */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 opacity-0 group-hover:opacity-10 rounded-xl"></div>
                  )}

                  {/* Icon Container */}
                  <div className={`
                    relative flex items-center justify-center w-10 h-10 rounded-lg
                    transition-all duration-300 transform group-hover:rotate-6
                    ${isActive 
                      ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg' 
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:text-blue-600'
                    }
                  `}>
                    <Icon className={`h-5 w-5 transition-transform duration-300 ${hoveredItem === item.name ? 'scale-110' : ''}`} />
                  </div>
                  
                  {/* Label */}
                  <span className={`
                    flex-1 font-semibold text-sm relative z-0
                    ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-blue-600'}
                  `}>
                    {item.name}
                  </span>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-white rounded-r-full -ml-4 shadow-lg animate-pulse"></div>
                  )}

                  {/* Hover Arrow */}
                  <ChevronRight className={`
                    h-4 w-4 relative z-0 transition-all duration-300
                    ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}
                    ${hoveredItem === item.name ? 'opacity-100 translate-x-1' : 'opacity-0'}
                  `} />

                  {/* Notification Badge */}
                  {item.badge && (
                    <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-[10px] font-bold text-white shadow-lg animate-bounce">
                      {item.badge}
                    </span>
                  )}

                  {/* Sparkle Effect on Hover */}
                  {hoveredItem === item.name && !isActive && (
                    <Sparkles className="absolute top-2 right-2 h-3 w-3 text-yellow-500 animate-ping" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="relative border-t border-gray-200 p-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 capitalize">
              <Sparkles className="w-4 h-4 animate-pulse" />
              {user.role.toLowerCase()} Dashboard
            </span>
            <p className="text-xs text-gray-500 font-medium">
              Version 2.0.0
            </p>
          </div>
        </div>
      </aside>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
          opacity: 0;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </>
  );
};

export default Sidebar;