// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

const ProtectedRoute = ({ children, requiredRole }) => {
  const data = useAuth();  // Get the user from Auth context

  // If the user is not logged in, redirect to login page
  if (!data) {
    return <Navigate to="/" />;
  }

  // Debug: Log the current user role and requiredRole (remove in production)
  console.log('Current user role:', data.user.role);
  console.log('Required role for this route:', requiredRole);

  // If a required role is specified and the user's role does not match, redirect to Unauthorized
  if (requiredRole && data.user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  // If authenticated and authorized, render the protected content
  return children;
};

export default ProtectedRoute;
