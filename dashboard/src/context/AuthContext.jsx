import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const SIX_HOURS = 6 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('auth_expiry');

    if (storedUser && token && expiry) {
      const isExpired = Date.now() > Number(expiry);

      if (!isExpired) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          clearStorage();
        }
      } else {
        clearStorage();
      }
    } else {
      clearStorage();
    }

    setLoading(false);
  }, []);

  const login = (userData, token) => {
    const expiryTime = Date.now() + SIX_HOURS;

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.setItem('auth_expiry', expiryTime.toString());

    setUser(userData);
  };

  const logout = () => {
    clearStorage();
    setUser(null);
  };

  const clearStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('auth_expiry');
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const getToken = () => localStorage.getItem('token');

  const isAuthenticated = () => {
    const expiry = localStorage.getItem('auth_expiry');
    if (!user || !expiry) return false;

    return Date.now() < Number(expiry);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    getToken,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
