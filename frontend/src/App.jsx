import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

import HomePage from './pages/public/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardHome from './pages/dashboard/DashboardHome';
import UserProfile from './pages/dashboard/UserProfile';
import OrganizationSettings from './pages/dashboard/OrganizationSettings';
import EmployeeList from './pages/dashboard/EmployeeList';
import RolesPage from './pages/dashboard/RolesPage';
import PayrollPage from './pages/dashboard/PayrollPage';
import RecruitmentDashboard from './pages/dashboard/RecruitmentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AttendancePage from './pages/dashboard/AttendancePage';
import LeavePage from './pages/dashboard/LeavePage';
import DocumentsPage from './pages/dashboard/DocumentsPage';
import OrgChartPage from './pages/dashboard/OrgChartPage';
import PerformancePage from './pages/dashboard/PerformancePage';
import FeedPage from './pages/dashboard/FeedPage';
import NetworkPage from './pages/dashboard/NetworkPage';

import { useAuthStore } from './store/authStore';
import AIWidget from './components/shared/AIWidget';

// Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return children;
};

// Public Route Guard (Redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/auth" element={<PublicRoute><AuthLayout /></PublicRoute>}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Dashboard Routes (Protected) */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/organization" element={<OrganizationSettings />} />
          <Route path="/organization/employees" element={<EmployeeList />} />
          <Route path="/dashboard/roles" element={<RolesPage />} />
          <Route path="/dashboard/payroll" element={<PayrollPage />} />
          <Route path="/dashboard/recruitment" element={<RecruitmentDashboard />} />
          {/* Admin Routes - In real app, verify isSuperAdmin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard/attendance" element={<AttendancePage />} />
          <Route path="/dashboard/leaves" element={<LeavePage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/organization/chart" element={<OrgChartPage />} />
          <Route path="/dashboard/performance" element={<PerformancePage />} />
          <Route path="/network/feed" element={<FeedPage />} />
          <Route path="/network/connections" element={<NetworkPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      {/* Global Widget for Authenticated Users */}
      {isAuthenticated && <AIWidget />}

    </Router>
  );
}

export default App;
