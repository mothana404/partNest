// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import Register from '../pages/public/Register';
import Login from '../pages/public/Login';
import Home from '../pages/public/Home';
import AboutUs from '../pages/public/AboutUs';
import ContactUs from '../pages/public/ContactUs';
import BrowseJobs from '../pages/public/BrowseJobs';

// Protected Pages
import JobDetails from '../pages/public/JobDetails';
import UserProfile from '../pages/protected/UserProfile';
import SavedJobs from '../pages/protected/SavedJobs';
import Dashboard from '../pages/protected/Dashboard';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/* <Route path="/SignUp" element={<Register />} />
        <Route path="/SignIn" element={<Login />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<AboutUs />} />
        <Route path="/Contact" element={<ContactUs />} />
        <Route path="/Jobs" element={<BrowseJobs />} />
        
        <Route path="/JobDetails/:id" element={<JobDetails />} />
        <Route path="/Profile" element={<UserProfile />} />
        <Route path="/Saved" element={<SavedJobs />} />



        {/* Protected Routes */}
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute>
              <SavedJobs />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;