// src/routes/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  // Check if token exists in cookies using js-cookie
  const token = Cookies.get('token');
  
  if (!token) {
    return <Navigate to="/SignUp" replace />;
  }

  return children;
};

export default ProtectedRoute;