import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BrowseJobsPage from './pages/BrowseJobsPage';
import PostJobPage from './pages/PostJobPage';
import ProfilePage from './pages/ProfilePage';
import JobDetailPage from './pages/JobDetailPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import MyJobsPage from './pages/MyJobsPage';
import NotificationsPage from './pages/NotificationsPage';
import SavedJobsPage from './pages/SavedJobsPage';
import ConnectionsPage from './pages/ConnectionsPage';

// Landing: if authenticated → dashboard; else show landing
const LandingRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

// Public route (login/register): if authenticated → dashboard
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Landing page — shown to first-time visitors */}
      <Route path="/welcome" element={<LandingRoute><LandingPage /></LandingRoute>} />

      {/* Root redirect: first-timers → /welcome, returning users → /login */}
      <Route path="/" element={<RootRedirect />} />

      {/* Auth */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/auth/google/success" element={<PublicRoute><LoginPage /></PublicRoute>} />

      {/* All authenticated routes share AppLayout */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/jobs" element={<BrowseJobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/my-applications" element={<MyApplicationsPage />} />
        <Route path="/saved-jobs" element={<SavedJobsPage />} />
        <Route path="/my-jobs" element={<MyJobsPage />} />
        <Route path="/post-job" element={<PostJobPage />} />
        <Route path="/applicants" element={<MyJobsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/connections" element={<ConnectionsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  const seen = localStorage.getItem('jobmart_seen_landing');
  return <Navigate to={seen ? '/login' : '/welcome'} replace />;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '12px', background: '#1e293b', color: '#fff', fontSize: '14px' },
              success: { style: { background: '#16a34a', color: '#fff' } },
              error: { style: { background: '#dc2626', color: '#fff' } },
            }}
          />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
