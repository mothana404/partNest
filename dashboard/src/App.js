import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import RegisterCompany from "./pages/auth/RegisterCompany";
import RegisterStudent from "./pages/auth/RegisterStudent";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import { useAuth } from "./hooks/useAuth";

// Company Pages
import JobPosts from "./pages/company/JobPosts";
import CandidatesPage from "./pages/company/CandidatesPage";

// Student Pages
import BrowseJobsPage from "./pages/student/BrowseJobsPage";
import SavedJobsPage from "./pages/student/SavedJobsPage";
import MyApplicationsPage from "./pages/student/MyApplicationsPage";
import ProfilePage from "./pages/student/ProfilePage";
import DashboardHomePage from "./pages/student/DashboardHomePage";
import CompanyProfile from "./pages/company/CompanyProfile";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import ProfileEditPage from "./components/ProfileEditPage";

// Admin Pages
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminApplicationsPage from "./pages/admin/AdminApplicationsPage";
import AdminCompaniesPage from "./pages/admin/AdminCompaniesPage";
import InterviewsPage from "./pages/company/InterviewsPage";

function App() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  // Helper function to get default route based on role
  const getDefaultRoute = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin':
        return '/admin/dashboard/users';
      case 'company':
        return '/company/dashboard';
      case 'student':
        return '/student/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Navigate
              to={
                isAuthenticated() && user
                  ? getDefaultRoute(user.role)
                  : "/login"
              }
              replace
            />
          }
        />

        {/* Auth Routes - Redirect to dashboard if already authenticated */}
        <Route
          path="/login"
          element={
            isAuthenticated() && user ? (
              <Navigate to={getDefaultRoute(user.role)} replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Registration routes */}
        <Route
          path="/register/student"
          element={
            isAuthenticated() && user ? (
              <Navigate to={getDefaultRoute(user.role)} replace />
            ) : (
              <RegisterStudent />
            )
          }
        />

        <Route
          path="/register/company"
          element={
            isAuthenticated() && user ? (
              <Navigate to={getDefaultRoute(user.role)} replace />
            ) : (
              <RegisterCompany />
            )
          }
        />

        {/* Protected Routes - Student */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardHomePage />} />
          <Route path="dashboard/jobs" element={<BrowseJobsPage />} />
          <Route
            path="dashboard/applications"
            element={<MyApplicationsPage />}
          />
          <Route path="dashboard/saved" element={<SavedJobsPage />} />
          <Route path="profile/edit" element={<ProfileEditPage />} />
          <Route path="dashboard/profile" element={<ProfilePage />} />
        </Route>

        {/* Protected Routes - Company */}
        <Route
          path="/company/*"
          element={
            <ProtectedRoute allowedRoles={["COMPANY"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="dashboard/jobs" element={<JobPosts />} />
          <Route path="dashboard/candidates" element={<CandidatesPage />} />
          <Route path="dashboard/profile" element={<CompanyProfile />} />
          <Route path="dashboard/interviews" element={<InterviewsPage />} />
        </Route>

        {/* Protected Routes - Admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Redirect /admin/dashboard to /admin/dashboard/users */}
          <Route path="dashboard" element={<Navigate to="/admin/dashboard/users" replace />} />
          <Route path="dashboard/users" element={<AdminUsers />} />
          <Route path="dashboard/categories" element={<AdminCategories />} />
          <Route path="dashboard/jobs" element={<AdminJobs />} />
          <Route path="dashboard/applications" element={<AdminApplicationsPage />} />
          <Route path="dashboard/companies" element={<AdminCompaniesPage />} />
        </Route>

        {/* 404 Not Found */}
        <Route
          path="*"
          element={
            <div className="flex h-screen items-center justify-center text-2xl">
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;