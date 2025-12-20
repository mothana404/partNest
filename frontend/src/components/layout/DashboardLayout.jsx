import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/SignIn');
  };

  // Generate initials from user name
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Generate random gradient based on user's name
  const generateGradient = (name) => {
    if (!name) return "bg-gradient-to-r from-blue-500 to-purple-600";
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gradients = [
      "bg-gradient-to-r from-blue-500 to-purple-600",
      "bg-gradient-to-r from-green-400 to-cyan-500",
      "bg-gradient-to-r from-pink-500 to-orange-400",
      "bg-gradient-to-r from-indigo-500 to-blue-500",
      "bg-gradient-to-r from-yellow-400 to-orange-500"
    ];
    return gradients[hash % gradients.length];
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-72' : 'w-20'
        } bg-slate-800 text-white transition-all duration-300 relative overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          {/* Logo and Toggle Button */}
          <div className="p-4 flex items-center justify-between border-b border-slate-700">
            <h2 className={`${!isSidebarOpen && 'hidden'} font-bold text-xl`}>WorkHub</h2>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              {isSidebarOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>

          {/* User Card */}
          {user && (
            <div className={`p-4 ${isSidebarOpen ? 'block' : 'hidden'}`}>
              <div className="rounded-xl overflow-hidden shadow-lg mb-4">
                <div className={`h-16 ${generateGradient(user.name)}`}></div>
                <div className="bg-slate-700 p-4 relative">
                  <div className="absolute -top-8 left-4">
                    {user.profilePic ? (
                      <img 
                        src={user.profilePic} 
                        alt="Profile" 
                        className="w-16 h-16 rounded-full border-4 border-slate-700 shadow-lg"
                      />
                    ) : (
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-4 border-slate-700 shadow-lg ${generateGradient(user.name)}`}>
                        {getInitials(user.name)}
                      </div>
                    )}
                  </div>
                  <div className="pt-8">
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <p className="text-slate-300 text-sm">{user.email }</p>
                    <p className="text-slate-300 text-sm">{user.role || "Member"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              <NavigationButton 
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                } 
                label="Dashboard" 
                onClick={() => navigate('/dashboard')}
                collapsed={!isSidebarOpen}
              />
              <NavigationButton 
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                label="Profile" 
                onClick={() => navigate('/profile')}
                collapsed={!isSidebarOpen}
              />
              <NavigationButton 
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                }
                label="Saved Jobs" 
                onClick={() => navigate('/saved-jobs')}
                collapsed={!isSidebarOpen}
              />
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-700">
            <NavigationButton 
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              }
              label="Logout" 
              onClick={handleLogout}
              collapsed={!isSidebarOpen}
              danger
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800">Welcome, {user?.name}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              {user && (
                <div className="flex items-center">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${generateGradient(user.name)}`}>
                      {getInitials(user.name)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Navigation Button Component
const NavigationButton = ({ icon, label, onClick, collapsed, danger = false }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center rounded-lg px-3 py-2.5 
        ${danger ? 'hover:bg-red-600/20 text-red-400' : 'hover:bg-slate-700 text-slate-200'}
        transition-colors duration-200
      `}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && <span className="ml-3">{label}</span>}
    </button>
  );
};

export default DashboardLayout;