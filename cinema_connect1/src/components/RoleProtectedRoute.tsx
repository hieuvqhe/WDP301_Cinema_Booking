import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<"admin" | "staff" | "customer">;
  redirectTo?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  redirectTo = "/home" 
}) => {
  const { isAuthenticated, user } = useAuthStore();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in the allowed roles
  const userRole = user.role;
  if (!allowedRoles.includes(userRole)) {
    // Redirect to appropriate page based on user role
    const roleRedirectMap: Record<string, string> = {
      admin: "/admin",
      staff: "/partner", 
      customer: "/home"
    };
    
    return <Navigate to={roleRedirectMap[userRole] || redirectTo} replace />;
  }

  // If authenticated and role is allowed, render the children
  return <>{children}</>;
};

export default RoleProtectedRoute;
