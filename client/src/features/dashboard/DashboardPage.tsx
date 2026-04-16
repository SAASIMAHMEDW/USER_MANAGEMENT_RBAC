import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminDashboard } from './components/AdminDashboard';
import { ManagerDashboard } from './components/ManagerDashboard';
import { UserDashboard } from './components/UserDashboard';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    default:
      return <UserDashboard />;
  }
};
