import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authService';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  requireVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, requireVerification = false }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (requireVerification) {
    if (user.verification_status === 'pending') {
      return <Navigate to="/verification-status" replace />;
    }
    if (!user.is_verified) {
      return <Navigate to="/verify" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;