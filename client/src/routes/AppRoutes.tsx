import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PrivateRoute } from '../shared/components/guards/PrivateRoute';
import { RoleGuard } from '../shared/components/guards/RoleGuard';
import { AppLayout } from '../shared/components/layout/AppLayout';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { UsersPage } from '../features/users/UsersPage';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-velvet-black flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage />
          )
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <RegisterPage />
          )
        }
      />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route
          path="users"
          element={
            <RoleGuard allowedRoles={['admin', 'manager']}>
              <UsersPage />
            </RoleGuard>
          }
        />
      </Route>

      <Route
        path="*"
        element={
          <div className="min-h-screen bg-velvet-black flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-display text-display text-white mb-4">404</h1>
              <p className="font-body text-silver-mist mb-6">Page not found</p>
              <a
                href="/dashboard"
                className="font-mono text-button uppercase tracking-widest text-white border border-white px-6 py-3 rounded-pill hover:bg-white hover:text-black transition-colors"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};
