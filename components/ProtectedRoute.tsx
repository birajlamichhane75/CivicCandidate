import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
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
  const { id } = useParams<{ id: string }>(); // Get constituency ID from URL parameters

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (requireVerification) {
    // 1. Check Verification Status
    if (user.verification_status === 'pending') {
      return <Navigate to="/verification-status" replace />;
    }
    if (!user.is_verified) {
      return <Navigate to="/verify" replace />;
    }

    // 2. Check Constituency Access
    // If the route has an 'id' parameter (constituency id) and user is not admin
    if (id && user.role !== 'admin') {
      // If user is verified but tries to access a different constituency
      if (user.constituency_id !== id) {
         // Redirect them to their own constituency dashboard if available
         if (user.constituency_id) {
             // If we are already redirecting, we assume the dashboard handles the view
             return <Navigate to={`/constituency/${user.constituency_id}`} replace />;
         } else {
             // Fallback for weird state where verified but no ID (shouldn't happen)
             return <Navigate to="/" replace />;
         }
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;