import { Navigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import React from 'react';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useStore();

  // For demonstration, let's say role_id 1 is Admin. 
  // In a real app, you'd check permissions dynamically.
  if (user?.role_id !== 1) {
    return <Navigate to="/" replace />;
  }

  return children;
};
