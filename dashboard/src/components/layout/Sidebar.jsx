import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  X, 
  ChevronRight
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
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <img 
                src={logo} 
                alt="PartNest Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              PartNest
            </h1>
          </Link>
          
          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {/* Icon Container */}
                  <div className={`
                    flex items-center justify-center w-9 h-9 rounded-lg
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
                    }
                  `}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  {/* Label */}
                  <span className={`
                    flex-1 font-medium text-sm
                    ${isActive ? 'text-blue-700' : 'text-gray-700'}
                  `}>
                    {item.name}
                  </span>
                  
                  {/* Active Indicator or Hover Arrow */}
                  {isActive ? (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full -ml-4"></div>
                  ) : (
                    <ChevronRight className={`
                      h-4 w-4 text-gray-400 transition-all duration-200
                      ${hoveredItem === item.name ? 'opacity-100 translate-x-1' : 'opacity-0'}
                    `} />
                  )}

                  {/* Notification Badge (if applicable) */}
                  {item.badge && (
                    <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer - Just Role Indicator */}
        <div className="border-t border-gray-200 p-4">
          <div className="text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
              {user.role.toLowerCase()} Dashboard
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;