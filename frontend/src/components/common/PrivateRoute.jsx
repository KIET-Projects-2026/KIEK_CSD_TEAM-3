import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ requiredRole }) => {
  const { isAuthenticated, role, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Redirect to their appropriate dashboard if they try to access a route for another role
    return <Navigate to={role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
