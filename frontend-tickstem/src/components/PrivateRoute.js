import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // User is not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user.rol)) {
    // User is authenticated but does not have the required role, redirect to unauthorized or login
    return <Navigate to="/login" replace />; // Or a dedicated /unauthorized page
  }

  return children; // User is authenticated and has the required role, render the children components
};

export default PrivateRoute;