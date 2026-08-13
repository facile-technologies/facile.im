import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Customers from './pages/customers/Customers';
import Profiles from './pages/profiles/Profiles';
import NfcChipsPage from './pages/nfc/NfcChipsPage';
import Teams from './pages/teams/Teams';
import BusinessRequests from './pages/business/BusinessRequests';
import BusinessPlans from './pages/business/BusinessPlans';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import OTP from './pages/auth/OTP';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ComingSoon from './pages/ComingSoon';

function App() {
  const themeMode = useSelector((state) => state.theme.mode);

  // Sync theme to document class on mount/change
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  return (
    <BrowserRouter basename="/admin">
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#22c55e',
              color: '#FFFFFF',
              fontWeight: '500',
            },
            iconTheme: {
              primary: '#FFFFFF',
              secondary: '#22c55e',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444', // Red-500
              color: '#FFFFFF',
              fontWeight: '500',
            },
            iconTheme: {
              primary: '#FFFFFF',
              secondary: '#ef4444',
            },
          },
        }}
      />
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp" element={<OTP />} />

        {/* Private Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="teams" element={<Teams />} />
            <Route path="platform-links" element={<Profiles />} />
            <Route path="nfc/:status" element={<NfcChipsPage />} />
            <Route path="nfc" element={<Navigate to="/nfc/produced" replace />} />
            <Route path="business-requests" element={<ComingSoon />} />
            <Route path="business-plans" element={<BusinessPlans />} />
            <Route path="coming-soon" element={<ComingSoon />} />
          </Route>
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
